# Generated by Django 4.2.1 on 2024-02-06 16:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('identifications', '0005_identificationanswer_is_verified'),
    ]

    operations = [
        migrations.AddField(
            model_name='identification',
            name='answer',
            field=models.IntegerField(default=-1),
        ),
        migrations.AddField(
            model_name='identification',
            name='is_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.DeleteModel(
            name='IdentificationAnswer',
        ),
    ]
