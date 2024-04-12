from api import views
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

urlpatterns = [
    path("", views.getRoutes,name="getRoutes"),
    # path("login/"),
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/profile/', views.getUserProfile, name='getUserProfile'),
    path('users/', views.getUsers, name='getUsers'),
    path('users/register/', views.registerUser, name='register'),
    path('activate/<uidb64>/<token>', views.ActivateAccountView.as_view(), name='activate'),
    path('listings/', views.getListing, name='getListing'),
    path('listings/remove', views.removeListing, name='removeListing'),
    path('listings/update', views.updateListing, name='updateListing')
]