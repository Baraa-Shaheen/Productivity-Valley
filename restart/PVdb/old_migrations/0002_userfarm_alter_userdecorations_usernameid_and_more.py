# Generated by Django 5.0.3 on 2024-04-16 04:15

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('PVdb', '0001_initial'),
    ]

    operations = [
        
        migrations.RenameField(
            model_name='tasks',
            old_name='taskName',
            new_name='name',
        ),
        migrations.AlterField(
            model_name='usersettings',
            name='fontStyle',
            field=models.CharField(default='pixelArt', max_length=15),
        )
    ]
