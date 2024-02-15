from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, generics
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from decks.mixins import PermissionPolicyMixin
from decks.pagination import DeckInfiniteScrollPagination
from decks.permissions import IsOwner
from decks.serializers import *


class DeckModelViewSet(PermissionPolicyMixin, ModelViewSet):
    queryset = Deck.objects.all()
    pagination_class = DeckInfiniteScrollPagination

    filter_backends = [OrderingFilter, SearchFilter, DjangoFilterBackend]
    ordering_fields = ['name', 'difficulty', 'created_at', 'times_played']
    ordering = '-created_at'
    search_fields = ['name', 'description']
    filterset_fields = ['user__id', 'private', 'difficulty', 'created_at']

    permission_classes_per_method = {
        'list': [AllowAny],
        'retrieve': [AllowAny],
        'create': [IsAuthenticated],
        'update': [IsOwner],
        'partial_update': [IsOwner],
        'destroy': [IsOwner],
    }

    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return ReadDeckSerializer
        elif self.action == 'create':
            return CreateDeckSerializer
        return WriteDeckSerializer

    @action(detail=True, methods=['get'])
    def plants(self, request, pk=None):
        deck_plants = DeckPlant.objects.filter(deck_id=pk)
        serializer = DeckPlantSerializer(deck_plants, many=True)
        return Response(serializer.data)


class DeckPlantModelViewSet(PermissionPolicyMixin, ModelViewSet):
    queryset = DeckPlant.objects.all()
    serializer_class = DeckPlantSerializer
    pagination_class = PageNumberPagination

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['deck__id', 'plant_id']

    permission_classes_per_method = {
        'list': [AllowAny],
        'retrieve': [AllowAny],
        'create': [IsAuthenticated],
        'update': [IsOwner],
        'partial_update': [IsOwner],
        'destroy': [IsOwner]
    }


class DeckPlantDestroyView(APIView):
    permission_classes = [IsOwner]

    @staticmethod
    def delete(request, deck_pk=None, plant_id=None, *args, **kwargs):
        instance = DeckPlant.objects.get(deck=deck_pk, plant_id=plant_id)
        instance.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class UserPlayedDeckListCreateView(PermissionPolicyMixin, APIView):

    permission_classes_per_method = {
        'get': [AllowAny],
        'post': [IsAuthenticated]
    }

    @staticmethod
    def get(request, user_pk=None, *args, **kwargs):
        user_played_decks = UserPlayedDeck.objects.filter(user=user_pk)
        serializer = ReadUserPlayedDeckSerializer(user_played_decks, many=True)

        return Response(serializer.data)

    def post(self, request, user_pk=None, *args, **kwargs):
        serializer = WriteUserPlayedDeckSerializer(data={
          'user': user_pk,
          'deck': self.request.data.get('deck')
        })
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserPlayedDeckRetrieveUpdateDestroyView(PermissionPolicyMixin, RetrieveUpdateDestroyAPIView):
    queryset = UserPlayedDeck.objects.all()
    serializer_class = WriteUserPlayedDeckSerializer
    permission_classes_per_method = {
        'retrieve': [AllowAny],
        'update': [IsOwner],
        'partial_update': [IsOwner],
        'destroy': [IsOwner]
    }

    def retrieve(self, request, user_pk=None, deck_pk=None, *args, **kwargs):
        user_played_deck = UserPlayedDeck.objects.get(user=user_pk, deck=deck_pk)
        serializer = ReadUserPlayedDeckSerializer(user_played_deck)

        return Response(serializer.data)

    def update(self, request, user_pk=None, deck_pk=None, *args, **kwargs):
        instance = UserPlayedDeck.objects.get(user=user_pk, deck=deck_pk)
        serializer = WriteUserPlayedDeckSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)

    def destroy(self, request, user_pk=None, deck_pk=None, *args, **kwargs):
        instance = UserPlayedDeck.objects.get(user=user_pk, deck=deck_pk)
        self.perform_destroy(instance)

        return Response(status=status.HTTP_204_NO_CONTENT)


class UserDecksListView(generics.ListAPIView):
    serializer_class = ReadDeckSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['private', 'difficulty', 'created_at']

    def get_queryset(self):
        user_pk = self.kwargs['user_pk']
        return Deck.objects.filter(user_id=user_pk)
