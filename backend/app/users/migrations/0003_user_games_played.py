# Generated by Django 4.2.1 on 2023-11-01 10:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_user_level_alter_user_score'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='games_played',
            field=models.IntegerField(default=0),
        ),
    ]
