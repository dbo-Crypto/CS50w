# Generated by Django 4.1.5 on 2023-01-24 17:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0010_bid_item'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bid',
            name='item',
            field=models.CharField(max_length=64),
        ),
    ]
