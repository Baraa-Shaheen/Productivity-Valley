# Generated by Django 5.0.3 on 2024-04-16 23:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('PVdb', '0004_alter_tasks_id_alter_userdecorations_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tasks',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='userdecorations',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='userfurniture',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='userplots',
            name='id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
