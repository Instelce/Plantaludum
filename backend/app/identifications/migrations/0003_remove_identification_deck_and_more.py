# Generated by Django 4.2.1 on 2024-02-04 12:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('decks', '0003_userplayeddeck_current_stars_and_more'),
        ('identifications', '0002_alter_identification_deck'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='identification',
            name='deck',
        ),
        migrations.AddField(
            model_name='identification',
            name='user_played_deck',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='decks.userplayeddeck'),
            preserve_default=False,
        ),
    ]
