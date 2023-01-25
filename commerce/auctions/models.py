from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    def __str__(self):
        return f"{self.username : {self.password}}"


class Auction(models.Model):
    title = models.CharField(max_length=64)
    price = models.IntegerField()
    vendor = models.CharField(max_length=64)
    description = models.CharField(max_length=512)
    image = models.ImageField(upload_to='images',default="Empty")
    category = models.CharField(max_length=64, default="Empty")
    active = models.BooleanField(default=True)
    winner = models.CharField(max_length=64, default="Empty")

    def __str__(self):
        return f"{self.title} auctionned by {self.vendor} : started auction at ${self.price}"


class Bid(models.Model):
    item = models.CharField(max_length=64)
    name = models.CharField(max_length=64)
    price = models.IntegerField()

    def __str__(self):
        return f"{self.name} is trying to buy {self.item} for {self.price}"


class Comment(models.Model):
    item = models.CharField(max_length=64, default="Empty")
    author = models.CharField(max_length=64, default="Empty")
    comment  = models.CharField(max_length=512, default="Empty")
    
    def __str__(self):
        return f"{self.author} commented {self.comment}"

class Watchlist(models.Model):
    user = models.CharField(max_length=64)
    item = models.CharField(max_length=64)
    watchlist = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user} has  {self.item} on watchlist"