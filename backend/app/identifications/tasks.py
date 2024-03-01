import asyncio
import datetime
import os
import requests
from random import choice

from celery import shared_task

from users.models import User

from .models import Identification
from decks.models import UserPlayedDeck, DeckPlant


@shared_task
def assignment_task():
    users = User.objects.all()

    for user in users:

        # check if the user is connected in the last 5 days
        if user.last_login is not None and user.last_login.date().day > datetime.date.today().day - 5:
            identifications_data = []

            # existing identifications
            user_identification = Identification.objects.filter(user_id=user.id, answer=-1)
            create_count = 15 - user_identification.count()

            # user played decks
            user_played_decks = UserPlayedDeck.objects.filter(user_id=user.id)
            decks_plants = []

            if user_played_decks.count() > 0:
                # get all plants the user has cross
                for user_played_deck in user_played_decks:
                    plants = DeckPlant.objects.filter(
                        deck_id=user_played_deck.deck.id)

                    # all plants in the deck
                    for deck_plant in plants:
                        decks_plants.append(deck_plant)

                        response = requests.get(os.environ.get("FLORE_API_URL") + "/api/images?plant__id=" + str(deck_plant.plant_id))
                        if response.status_code == 200:
                            data = response.json()

                            # all images
                            for image in data['results']:
                                identifications_data.append({
                                    'deck': user_played_deck,
                                    'plant_id': deck_plant.plant_id,
                                    'image_id': image['id']
                                })

                # create 15 identification
                if create_count > 0 and len(identifications_data) > 0:
                    for _ in range(create_count):
                        if len(identifications_data) > 0:
                            identification = choice(identifications_data)
                            Identification.objects.create(
                                user_id=user.id,
                                user_played_deck=identification['deck'],
                                plant_id=identification['plant_id'],
                                image_id=identification['image_id']
                            )
                            identifications_data.remove(identification)

                print(f"{user.username} --------------------------------")
                print(f"CURRENT IDENTIFICATIONS {user_identification.count()}")
                print(f"CREATE COUNT            {create_count}")

    return 'Task completed successfully'
