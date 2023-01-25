# Generated by Django 4.1.5 on 2023-01-25 08:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0013_remove_auction_watchlist_auction_winner'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='item',
            field=models.CharField(default='Empty', max_length=64),
        ),
        migrations.AddField(
            model_name='comment',
            name='message',
            field=models.CharField(default='Empty', max_length=512),
        ),
        migrations.AlterField(
            model_name='comment',
            name='author',
            field=models.CharField(default='Empty', max_length=64),
        ),
    ]