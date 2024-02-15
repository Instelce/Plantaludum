from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),

    # Decks
    path('api/', include('decks.urls')),

    # Identifications
    path('api/', include('identifications.urls')),

    # Auth
    path('api/auth/', include('users.urls')),
]
