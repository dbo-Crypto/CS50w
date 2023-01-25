from django.urls import path
from . import views
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from .views import *



urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new", views.new, name="new"),
    path("item/<str:title>", views.item, name="item"),
    path("watchlist", views.watchlist, name="watchlist"),
    path("bid", views.bid, name="bid"),
    path("close", views.close, name="close"),
    path("closed_listing", views.closed_listing, name="closed_listing"),
    path("comment", views.comment, name="comment"),
    path("categories", views.categories, name="categories"),
    path("category/<str:category>", views.category, name="category"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
