# Generated by Django 4.2.1 on 2024-02-06 16:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('identifications', '0006_identification_answer_identification_is_verified_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='identification',
            name='is_verified',
        ),
    ]