# Generated by Django 4.2.1 on 2023-11-01 16:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_user_games_played'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='games_played',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
