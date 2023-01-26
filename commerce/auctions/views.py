from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from .models import Auction, Bid, Comment, Watchlist
from .models import User
from django import forms


def index(request):
    return render(request, "auctions/index.html",{
        "auctions" : Auction.objects.all()
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")

def new(request):
    # Get the form information 
    if request.method =="POST":
        item_title = request.POST["item_title"]
        auction_price = request.POST["auction_price"]
        description = request.POST["description"]
        # Test if the image file is empty, if empty replace by specific image.
        try:
            img = request.FILES
            img = img['img']
        except:
            img = "Empty"
        category = request.POST["category"]
        # Create the new auction entry woth collected information.
        new_auction = Auction(title=item_title, price=auction_price, description=description,vendor=request.user.username, image=img, category=category)
        new_auction.save()
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/new.html")

def item(request, title):
        # Get informarion needed for item page
        current_user = request.user.username
        all_list = Watchlist.objects.all()
        # Check if the item is in the user watchlist
        count = 0
        for i in all_list:
            if current_user == i.user and title == i.item:
                count += 1
            else:
                count += 0
        if count == 0:
            checked = False
        else:
            checked = True
        # Get information to check if the connected user is the auction winner.
        this_item = Auction.objects.filter(title=title)
        current_vendor = this_item[0].vendor
        active = this_item[0].active
        winner = this_item[0].winner
        # Load all comments for this item
        all_comments = Comment.objects.filter(item=this_item[0].title)

        return render(request, "auctions/item.html",{
            "auctions" : Auction.objects.all(),
            "title" : title,
            "current_user" : current_user,
            "watchlists" : Watchlist.objects.filter(user=current_user),
            "checked" : checked,
            "current_vendor" : current_vendor,
            "active" : active,
            "winner" : winner,
            "all_comments" : all_comments,

        })

def watchlist(request):
    # Get info for Watchlist
    if request.method == "POST":
        checked = request.POST["watchlist"]
        title = request.POST["title"]
        user = request.POST["user"]
        # If the item is not on watchlist and doesn't exist in the database, crreate it.
        if checked == "Add to Watchlist" and not Watchlist.objects.filter(item=title, user=user).exists():
            new_watchlist = Watchlist(user=user, item=title, watchlist=True)
            new_watchlist.save()
            return HttpResponseRedirect("watchlist")
        # If already on the watchlist, remove the entry.
        elif checked == "Remove from Watchlist" and Watchlist.objects.filter(item=title, user=user).exists():
            watchlist = Watchlist.objects.filter(item=title, user=user)
            watchlist.delete()
            return HttpResponseRedirect(reverse("watchlist"))
            
    else:
        return render(request, "auctions/watchlist.html",{
            "watchlists" : Watchlist.objects.all(),
        })

def bid(request):
    # Get information needed to bid
    if request.method == "POST":
        current_user = request.user.username
        bid_amount = request.POST["bid"]
        title = request.POST["title"]
        item = Auction.objects.filter(title=title)
        price = item[0].price
        title = item[0].title
        active = item[0].active
        # Check if the bid amount is greater than the current price and that the auction is still active.
        # If yes, create the entry.
        if int(bid_amount) > price and active == True:
            item = Auction.objects.filter(title=title).update(price=bid_amount)
            new_bid = Bid(item=title, name=current_user, price=bid_amount)
            new_bid.save()
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "auctions/error_bid.html")

def close(request):
    # Get information for Close auction.
    if request.method == "POST":
        title = request.POST["title"]
        action = request.POST["action"]
        # If close button triggered, change auction state to inactive and get the highest bider.
        if action == "Close Auction":
            item = Auction.objects.filter(title=title).update(active=False)
            winner = Bid.objects.filter(item=title).order_by('-price').values()
            winner = winner[0]['name']
            item = Auction.objects.filter(title=title).update(winner=winner)
        # Re-Open auction if needed.
        elif action == "Re-Open Auction":
            item = Auction.objects.filter(title=title).update(active=True)
            winner = Bid.objects.filter(item=title).order_by('-price').values()
            print(winner)
        
        return HttpResponseRedirect(reverse(f"index"))

# Display closed auctions page.
def closed_listing(request):
    return render(request, "auctions/closed_listing.html",{
         "auctions" : Auction.objects.all(),
    })

def comment(request):
    # Get infprmation for comment
    if request.method == "POST":
        item = request.POST["title"]
        comment = request.POST["comment"]
        author = request.POST["user"]
        # Create new comment entry.
        new_comment = Comment(item=item, author=author, comment=comment)
        new_comment.save()
    return HttpResponseRedirect(f"item/{item}")

def categories(request):
    # Get categories information + create category list to be displayed on the page.
    categories = Auction.objects.all()
    cat_list = []
    for category in categories:    
        if category.category not in cat_list:
            cat_list.append(category.category)
    
    return render(request, "auctions/categories.html",{
        "cat_list" : cat_list,
    })

# Display all the items from a category.
def category(request, category):
    category_list = Auction.objects.filter(category=category)
    return render(request, "auctions/category.html",{
        "category_list" : category_list,
        "category" : category,
    })

