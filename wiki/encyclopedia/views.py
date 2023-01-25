import random
from markdown2 import Markdown
from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect


from . import util


def index(request):
    if request.method == "POST":
        entry = request.POST['get_entry']
        list = util.list_entries()
        res_list = []
        if entry in list:
            return HttpResponseRedirect(f"/wiki/{entry}")
        for i in list:
            if entry in i:
                res_list.append(i)
        lenght = len(res_list)
        if lenght > 0:
            return render(request, "encyclopedia/search_result.html", {
                "res_list": res_list,
                "entry": entry,
                "len": lenght,
                "list": list
            })
        else:
            return render(request, "encyclopedia/search_result.html", {
                "list": list,
                "entry": entry,
                 "len": lenght
            })
    else:
        return render(request, "encyclopedia/index.html", {
            "entries": util.list_entries(),
        })


def title(request, title):
    content = util.get_entry(title)
    if content == None:
        return render(request, "encyclopedia/error.html", {
            "title" : title
        })
    else:
        markdowner = Markdown()
        content = markdowner.convert(content)
        print(content)
        return render(request, "encyclopedia/entry.html", {
            "title": title,
            "content": content
        })


def new(request):
    if request.method == "POST":
        title = request.POST["new_title"]
        new_entry = request.POST["new_entry"]
        if title in util.list_entries():
            return HttpResponse("This entry already exists!")
        util.save_entry(title, new_entry)
        return HttpResponseRedirect(f"/wiki/{title}")
    else:
        return render(request, "encyclopedia/new.html")


def edit(request, title):
    if request.method == "POST":
        new_content = request.POST["edit_entry"]
        util.save_entry(title, new_content)
        return HttpResponseRedirect(f"/wiki/{title}")
    else:
        content = util.get_entry(title)
        if content == None:
            return render(request,"encyclopedia/error.html", {
                "title" : title
            })
        else:
            return render(request, "encyclopedia/edit.html", {
                "title": title,
                "content": content
            })


def rand(request):
    list = util.list_entries()
    n = random.randint(0, len(list)-1)
    return HttpResponseRedirect(f"/wiki/{list[n]}")
