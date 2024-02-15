# Generated by Django 4.2.1 on 2024-02-05 17:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('identifications', '0003_remove_identification_deck_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='IdentificationAnswer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('plant_id', models.IntegerField()),
                ('identification', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='identifications.identification')),
            ],
        ),
    ]
