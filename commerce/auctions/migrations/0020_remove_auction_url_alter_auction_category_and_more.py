# Generated by Django 4.1.5 on 2023-01-25 17:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0019_alter_auction_image'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='auction',
            name='url',
        ),
        migrations.AlterField(
            model_name='auction',
            name='category',
            field=models.CharField(default='Empty', max_length=64),
        ),
        migrations.AlterField(
            model_name='auction',
            name='image',
            field=models.ImageField(upload_to='images'),
        ),
        migrations.AlterField(
            model_name='auction',
            name='winner',
            field=models.CharField(default='Empty', max_length=64),
        ),
    ]
