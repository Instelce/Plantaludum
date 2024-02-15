from rest_framework import serializers

from users.serializers import UserUsernameSerializer
from decks.models import Deck, DeckPlant, UserPlayedDeck


class CreateDeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = [
            'id',
            'name',
            'description',
            'difficulty',
            'preview_image_url',
            'private',
            'user'
        ]


class WriteDeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = [
            'name',
            'description',
            'difficulty',
            'preview_image_url',
            'created_at',
            'times_played',
            'private',
            'user'
        ]


class ReadDeckSerializer(serializers.ModelSerializer):
    user = UserUsernameSerializer()

    class Meta:
        model = Deck
        fields = [
            'id',
            'name',
            'description',
            'difficulty',
            'preview_image_url',
            'created_at',
            'times_played',
            'private',
            'user'
        ]
        read_only_fields = fields


class DeckPlantSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeckPlant
        fields = ['id', 'deck', 'plant_id']


class WriteUserPlayedDeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPlayedDeck
        fields = ['id', 'user', 'deck', 'level', 'current_stars']


class ReadUserPlayedDeckSerializer(serializers.ModelSerializer):
    deck = ReadDeckSerializer()

    class Meta:
        model = UserPlayedDeck
        fields = ['id', 'user', 'deck', 'level', 'current_stars']
        read_only_fields = fields


class UserPlayedDeckWithDeckSerializer(serializers.ModelSerializer):
    deck = ReadDeckSerializer()

    class Meta:
        model = UserPlayedDeck
        fields = ['id', 'deck']
        read_only_fields = fields