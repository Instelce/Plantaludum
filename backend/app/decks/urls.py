from django.urls import path

from decks.views import *

# decks
decks_list_or_create = DeckModelViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
deck_detail = DeckModelViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

# decks plants
deck_plants = DeckModelViewSet.as_view({
    'get': 'plants'
})
deck_plants_create = DeckPlantModelViewSet.as_view({
    'post': 'create'
})

# user played decks
user_decks = UserPlayedDeckListCreateView.as_view()
user_deck_update_or_delete = UserPlayedDeckRetrieveUpdateDestroyView.as_view()

urlpatterns = [
    path('decks', decks_list_or_create),
    path('decks/<int:pk>', deck_detail),

    path('decks/<int:pk>/plants', deck_plants),
    path('decks/<int:deck_pk>/plants/<int:plant_id>', DeckPlantDestroyView.as_view()),
    path('decks/plants', deck_plants_create),
    path('decks/<int:deck_pk>/plants/count', get_deck_plants_count),
    path('decks/plants/count', get_all_decks_plants_count),
    path('decks/times_played/<int:deck_pk>', UpdateDeckTimesPlayedView.as_view()),

    path('users/<int:user_pk>/played_decks', user_decks),
    path('users/<int:user_pk>/played_decks/<int:deck_pk>', user_deck_update_or_delete),
    path('user-decks/<int:user_pk>', UserDecksListView.as_view())
]
