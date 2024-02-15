from django.db import models
from decks.models import Deck
from users.models import User


STARS = [(i, i) for i in range(0, 4)]


class GameResult(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Deck, on_delete=models.CASCADE)
    score = models.PositiveIntegerField(default=0)
    stars = models.IntegerField(choices=STARS)
    time = models.TimeField()
    played_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} played {self.quiz.name} quiz in {self.played_at}"
