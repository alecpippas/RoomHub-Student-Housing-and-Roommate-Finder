from api import views
from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)

urlpatterns = [
    path("", getRoutes,name="getRoutes"),
    # path("login/"),
    path('users/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/profile/', getUserProfile, name='getUserProfile'),
    path('users/', getUsers, name='getUsers'),
    path('users/register/', registerUser, name='register'),
    path('listings/create/', CreateListingView.as_view(), name='create-listing'),
#     path('listings/', views.getListing, name='getListing'),
    path('listings/', ListListingsView.as_view(), name='list-listings'),
    path('listings/remove', removeListing, name='removeListing'),
    path('listings/update', updateListing, name='updateListing'),
    path('users/profile/display/<str:username>/', getProfile, name='getProfile'),
    path('users/profile/update/', editProfile, name='update'),
    path('activate/<uidb64>/<token>', ActivateAccountView.as_view(), name='activate')
]