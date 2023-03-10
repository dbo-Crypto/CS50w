from django.urls import path

from . import views

app_name = "encyclopedia"

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:title>", views.title, name="title"),
    path("new", views.new, name="new"),
    path("wiki/edit/<str:title>", views.edit, name="edit"),
    path("rand", views.rand, name="rand")
]
