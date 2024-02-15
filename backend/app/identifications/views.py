from django_celery_beat.models import PeriodicTask, IntervalSchedule
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, DestroyAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from decks.permissions import IsOwner
from .serializers import *
from .tasks import assignment_task

@api_view(['GET'])
def schedule_task(request):
    interval, _ = IntervalSchedule.objects.get_or_create(
        every=2,
        # every=15,
        period=IntervalSchedule.HOURS,
        # period=IntervalSchedule.SECONDS,
    )


    periodic = PeriodicTask.objects.get_or_create(
        interval=interval,
        name='assignment-schedule',
        task='identifications.tasks.assignment_task'
    )

    return Response({"message": "Task scheduled"})


class UserIdentificationListView(APIView):
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, user_id, format=None):
        queryset = Identification.objects.filter(user_id=user_id)
        serializer = ReadIdentificationSerializer(queryset, many=True)
        return Response(serializer.data)


class IdentificationDeleteView(RetrieveUpdateDestroyAPIView):
    queryset = Identification.objects.all()
    permission_classes = [IsOwner]

    def get_serializer_class(self):
        if self.request.method == 'DELETE' and self.request.method == 'PATCH':
            return WriteIdentificationSerializer
        return ReadIdentificationSerializer

    def update(self, request, *args, **kwargs):
        instance = Identification.objects.get(id=self.kwargs['pk'])
        serializer = WriteIdentificationSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
