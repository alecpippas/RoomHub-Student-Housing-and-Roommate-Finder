from api import views
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
)
from .views import (
    getRoutes,
    MyTokenObtainPairView,
    getUserProfile,
    getUsers,
    registerUser,
    ActivateAccountView,
    ListListingsView,
    CreateListingView
)

urlpatterns = [
    path("", getRoutes,name="getRoutes"),
    # path("login/"),
    path('users/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/profile/', getUserProfile, name='getUserProfile'),
    path('users/', getUsers, name='getUsers'),
    path('users/register/', registerUser, name='register'),
    path('activate/<uidb64>/<token>', ActivateAccountView.as_view(), name='activate'),
    path('api/listings/create', CreateListingView.as_view(), name='create-listing'),
    path('api/listings/', ListListingsView.as_view(), name='list-listings')
]