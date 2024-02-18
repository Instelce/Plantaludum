from django.urls import path

from .views import *

urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('user', CurrentUserDetailView.as_view()),
    path('users', UserListView.as_view()),
    path('users/<int:pk>', UserRetrieveUpdateDestroyView.as_view()),

    path('login', CookieLoginView.as_view(), name='login'),
    path('refresh', CookieTokenRefreshView.as_view(), name='refresh-token'),
    path('logout', CookieLogoutView.as_view(), name='logout'),

    path('restore-theplantgame-stats', ThePlantGameUserStatsScrapperView.as_view())
]
