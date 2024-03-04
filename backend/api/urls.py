from api import views
from django.urls import path

urlpatterns = [
    path("", views.getRouters,name="getRoutes"),
    path("login/")
]