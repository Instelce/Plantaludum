from django.contrib import admin

from decks.models import Deck, DeckPlant, UserPlayedDeck


admin.site.register(Deck)
admin.site.register(DeckPlant)
admin.site.register(UserPlayedDeck)
