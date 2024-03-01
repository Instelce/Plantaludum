from django.urls import path, include
from rest_framework.routers import SimpleRouter

from .views import *

urlpatterns = [
    # task to create identifications
    path('tasks/identifications/schedule', schedule_task),
    path('tasks/identifications/run', run_identification_task),

    # identifications
    path('identifications/user/<int:user_id>', UserIdentificationListView.as_view()),
    path('identifications/<int:pk>', IdentificationDeleteView.as_view()),
]
