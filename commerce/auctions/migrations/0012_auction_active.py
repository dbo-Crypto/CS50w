# Generated by Django 4.1.5 on 2023-01-24 17:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0011_alter_bid_item'),
    ]

    operations = [
        migrations.AddField(
            model_name='auction',
            name='active',
            field=models.BooleanField(default=True),
        ),
    ]