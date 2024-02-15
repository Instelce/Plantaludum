from django.db import models

from users.models import User
from decks.models import Deck, UserPlayedDeck


class Identification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_played_deck = models.ForeignKey(UserPlayedDeck, on_delete=models.CASCADE)
    plant_id = models.IntegerField()
    image_id = models.IntegerField()
    answer = models.IntegerField(default=-1)

    def __str__(self):
        return f"{self.user.username} must identify {self.image_id} image | answer {self.answer}"

    class Meta:
        unique_together = (('user', 'image_id'),)
