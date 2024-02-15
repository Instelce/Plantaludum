from rest_framework.serializers import ModelSerializer

from .models import *
from decks.serializers import UserPlayedDeckWithDeckSerializer


class ReadIdentificationSerializer(ModelSerializer):
    user_played_deck = UserPlayedDeckWithDeckSerializer()

    class Meta:
        model = Identification
        fields = [
            'id',
            'user',
            'user_played_deck',
            'plant_id',
            'image_id',
            'answer',
        ]
        read_only_fields = fields


class WriteIdentificationSerializer(ModelSerializer):
    class Meta:
        model = Identification
        fields = [
            'user',
            'user_played_deck',
            'plant_id',
            'image_id',
            'answer',
        ]
