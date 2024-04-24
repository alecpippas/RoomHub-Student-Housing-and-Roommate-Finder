from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient

from rest_framework_simplejwt.tokens import RefreshToken


#generate a JWT token for the test user so they are authenticated for positve testing
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }




# Create your tests here.


class UserProfileTestSuite(TestCase):
    def setUp(self):
        #create a test user 
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        tokens = get_tokens_for_user(self.user) #get JWT token
        self.client = APIClient() #initialize Django's test client

        #reconfigure test client to include Authorization header with JWT in test requests
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + tokens['access']) 

    def test_get_user_profile_authenticated(self):
        
        # reverse lookup the url pattern where getUserProfile view is invoked
        url = reverse('getUserProfile')
        
        response = self.client.get(url) #tell test client to "send" get request to API endpoint at the url 
     
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check if the response data includes the username
        self.assertEqual(response.data['username'], 'testuser')

    def test_get_user_profile_unauthenticated(self):
        # Attempt to access profile without JWT token
        self.client.credentials()
        url = reverse('getUserProfile')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

 
