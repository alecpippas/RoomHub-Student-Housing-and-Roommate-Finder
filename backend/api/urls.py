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
    path('listings/create/', createListing, name='createListing'),
    path('listings/uploadImage/', uploadListingPhoto, name='uploadListingPhoto'),
    path('listings/', getAllListings, name='getAllListings'),
    path('listings/<str:pk>/', getListing, name='getListing'),
    path('listings/update/<str:pk>/', updateListing, name='updateListing'),
    path('listings/remove/<str:pk>/', removeListing, name='removeListing'),
    path('users/profile/display/<str:username>/', getProfile, name='getProfile'),
    path('users/profile/update/', editProfile, name='update'),
    path('activate/<uidb64>/<token>', ActivateAccountView.as_view(), name='activate'),
    path('send-message/', sendMessage, name='send-message'),
    path('get-messages/', getMessages, name='get-messages'),
    path('postComment/', postComment, name='postComment'),
    path('getComments/<str:pk>/', getComments, name='getComments'),
    path('addFav/', addFav, name='addFav'),
    path('getFavs/<str:pk>/', getFavs, name='getFavs'),
    path('checkFav/', checkFav, name='checkFav'),
    path('delFav/', delFav, name='delFav'),

]