# Generated by Django 4.1.5 on 2023-01-24 09:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0007_alter_watchlist_item_alter_watchlist_user'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Watchlist',
        ),
        migrations.AddField(
            model_name='auction',
            name='watchlist',
            field=models.BooleanField(default=False),
        ),
    ]
