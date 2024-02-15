from django.urls import path, include
from rest_framework.routers import SimpleRouter

from .views import *

urlpatterns = [
    path('schedule', schedule_task),
    path('identifications/user/<int:user_id>', UserIdentificationListView.as_view()),
    path('identifications/<int:pk>', IdentificationDeleteView.as_view()),
]
