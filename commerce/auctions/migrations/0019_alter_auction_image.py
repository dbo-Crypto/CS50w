# Generated by Django 4.1.5 on 2023-01-25 10:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0018_alter_auction_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='auction',
            name='image',
            field=models.ImageField(default='Empty', upload_to='images/'),
        ),
    ]
