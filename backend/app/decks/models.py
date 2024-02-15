from django.db import models
from users.models import User

DIFFICULTY = [(i, i) for i in range(1, 4)]
LEVEL = [(i, i) for i in range(1, 4)]


class Deck(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=500)
    difficulty = models.IntegerField(choices=DIFFICULTY)
    preview_image_url = models.URLField()
    created_at = models.DateField(auto_now_add=True)
    times_played = models.PositiveIntegerField(default=0)
    private = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} by {self.user.username}"


class DeckPlant(models.Model):
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    plant_id = models.IntegerField()

    def __str__(self):
        return f"plant {self.plant_id} in {self.deck.name}"

    class Meta:
        unique_together = (('deck', 'plant_id'),)


class UserPlayedDeck(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    level = models.IntegerField(choices=LEVEL, default=1)
    current_stars = models.IntegerField(choices=LEVEL, default=1)

    def __str__(self):
        return f"{self.user.username} has played the {self.deck.name} decks"

    class Meta:
        unique_together = (('user', 'deck'),)
