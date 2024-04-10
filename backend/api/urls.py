from api import views
from django.urls import path
from .views import *


urlpatterns = [
    path("", getRoutes,name="getRoutes"),
    # path("login/"),
    path('users/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/profile/', getUserProfile, name='getUserProfile'),
    path('users/', getUsers, name='getUsers'),
    path('users/register/', registerUser, name='register'),
    path('api/listings/create', CreateListingView.as_view(), name='create-listing'),
    path('api/listings/', ListListingsView.as_view(), name='list-listings'),
    path('users/profile/display/<str:username>/', views.getProfile, name='getProfile'),
    path('users/profile/update/', views.editProfile, name='update'),
]