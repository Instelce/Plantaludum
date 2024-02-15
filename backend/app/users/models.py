from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(null=False, blank=False, unique=True)
    level = models.PositiveIntegerField(default=0)
    score = models.PositiveIntegerField(default=0)
    games_played = models.PositiveIntegerField(default=0)
    identifications = models.PositiveIntegerField(default=0)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self) -> str:
        return self.username
