from rest_framework import serializers

from game.models import GameResult


class WriteGameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameResult
        fields = [
            'user',
            'decks',
            'score',
            'stars',
            'time',
            'played_at'
        ]


class ReadGameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameResult
        fields = [
            'user',
            'decks',
            'score',
            'stars',
            'time',
            'played_at'
        ]
        read_only_fields = fields
