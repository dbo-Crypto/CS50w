# Generated by Django 4.1.5 on 2023-01-25 10:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0016_auction_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='auction',
            name='image',
            field=models.ImageField(default='Empty', upload_to='static/auctions/img'),
        ),
    ]