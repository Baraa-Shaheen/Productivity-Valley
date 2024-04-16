# Generated by Django 5.0.3 on 2024-04-15 15:06

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('PVdb', '0003_alter_userseeds_usernameid_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tasks',
            old_name='breakTime',
            new_name='timerTime',
        ),
        migrations.RemoveField(
            model_name='tasks',
            name='inBreak',
        ),
        migrations.AddField(
            model_name='tasks',
            name='timerState',
            field=models.PositiveIntegerField(default=0, validators=[django.core.validators.MaxValueValidator(2)]),
        ),
    ]
