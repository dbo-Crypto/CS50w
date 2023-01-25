# Generated by Django 4.1.5 on 2023-01-25 08:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0012_auction_active'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='auction',
            name='watchlist',
        ),
        migrations.AddField(
            model_name='auction',
            name='winner',
            field=models.CharField(default='None', max_length=64),
        ),
    ]
