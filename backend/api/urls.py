from api import views
from django.urls import path
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
# )

urlpatterns = [
    path("", views.getRoutes,name="getRoutes"),
    # path("login/"),
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('users/profile/', views.getUserProfile, name='getUserProfile'),
    path('users/profile/display/<str:username>/', views.getProfile, name='getProfile'),
    # path('users/', views.getUsers, name='getUsers'),
    path('users/register/', views.registerUser, name='register'),
    path('users/profile/update/', views.editProfile, name='update'),
    # path('activate/<uidb64>/<token>', views.ActivateAccountView.as_view(), name='activate')
]