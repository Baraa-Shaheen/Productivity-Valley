# Generated by Django 4.2.9 on 2024-02-05 18:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("Database", "0002_decorations_tasks_alter_users_money"),
    ]

    operations = [
        migrations.CreateModel(
            name="Crops",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=30)),
                ("price", models.PositiveIntegerField()),
                ("worth", models.PositiveIntegerField()),
                (
                    "image",
                    models.ImageField(blank=True, null=True, upload_to="images/"),
                ),
            ],
        ),
        migrations.CreateModel(
            name="UserDecorations",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "decoration",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="Database.decorations",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="Database.users"
                    ),
                ),
            ],
            options={
                "unique_together": {("user", "decoration")},
            },
        ),
        migrations.CreateModel(
            name="UserCrop",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "crop",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="Database.crops"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="Database.users"
                    ),
                ),
            ],
            options={
                "unique_together": {("user", "crop")},
            },
        ),
    ]
