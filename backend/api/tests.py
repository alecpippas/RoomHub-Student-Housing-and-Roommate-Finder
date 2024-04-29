from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient
from .models import UserProfile, Listing, ListingPhoto
from .serializers import ProfileSerializer, ListingSerializer, ListingPhotoSerializer

from rest_framework_simplejwt.tokens import RefreshToken
import datetime
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils.timezone import make_aware



#generate a JWT token for the test user so they are authenticated for positve testing
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }




# Create your tests here.

#testing inactive views using token-based authentication
class GetUserProfileTestSuite(TestCase):
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

#testing login views with JWT authentication
class LoginTestSuite(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='correct_password')
        self.login_url = reverse('token_obtain_pair')
    
    def test_login_with_correct_credentials(self):
        response = self.client.post(self.login_url, {'username': 'testuser', 'password': 'correct_password'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data) #check if access token is in the response data
    
    def test_login_with_incorrect_password(self):
        response = self.client.post(self.login_url, {'username': 'testuser', 'password': 'really_bad_password'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('token', response.data) #check that token is not in the response payload

    def test_login_with_incorrect_username(self):
        response = self.client.post(self.login_url, {'username': 'fakeuser', 'password': 'correct_password'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('token', response.data) #check that token is not in the response payload





#testing active views with session-based authentication
class GetProfileTestSuite(TestCase):
    def setUp(self):
        #create a test user 
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.user_profile = UserProfile.objects.create(
            user=self.user,
            bio='This is my bio.',
            first_name = 'Charlie',
            last_name='Chaplin',
            age=25,
            gender='Male',
            school='NYU',
            pets = True,
            allergies = 'Severe Pollen',
            budget = 3000,
            sleep_schedule = 'Nightime',
            )

        self.client = APIClient() #initialize Django's test client


    def test_get_profile(self):
            
            url = reverse('getProfile', kwargs={'username': self.user.username}) #kwargs argument to append username to URL dynamic element /<str:username>/
            
            #authenticate/login with server for session-based authentication
            self.client.login(username='testuser', password='testpass123')
            
            response = self.client.get(url) #tell Django test client to "send" get request to API endpoint at the url 
        
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            
            # Check if the response content matches the user profile information in the database
            self.assertEqual(response.data['user'], 'testuser')
            self.assertEqual(response.data['first_name'], 'Charlie')
            self.assertEqual(response.data['last_name'], 'Chaplin')
            self.assertEqual(response.data['age'], 25)
            self.assertEqual(response.data['gender'], 'Male')
            self.assertEqual(response.data['school'], 'NYU')
            self.assertEqual(response.data['pets'], True)
            self.assertEqual(response.data['allergies'], 'Severe Pollen')
            self.assertEqual(response.data['budget'], 3000)
            self.assertEqual(response.data['sleep_schedule'], 'Nightime')


    def test_get_profile_unauthenticated(self):
        # Attempt to access profile without JWT token
        self.client.credentials()
        url = reverse('getUserProfile')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

 

from rest_framework_simplejwt.tokens import RefreshToken

class GetProfileTestSuite(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass123')
        self.user_profile = UserProfile.objects.create(user=self.user, bio='Test Bio')

        # Create a token for the created user
        refresh = RefreshToken.for_user(self.user)
        self.token = str(refresh.access_token)

        # Set up the API client
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_get_user_profile(self):
        url = reverse('getProfile', kwargs={'username': self.user.username})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def tearDown(self):
        self.client.logout()



class EditProfileTestSuite(TestCase):
    def setUp(self):
        # Set up user profile
        self.user_profile = UserProfile.objects.create(user='testuser', first_name='Johnny', last_name='Appleseed')
        self.client = APIClient()
        self.edit_profile_url = reverse('update')

    def test_edit_profile(self):
        # Data to update
        data = {
            'user': 'testuser',
            'first_name': 'Mary',
            'last_name': 'Appleseed',
            'bio': 'New better bio.',
            'age': 30,
            'gender': 'F',
            'school': 'NYU',
            'pets': True,
            'allergies' : 'None',
            'budget': 1500,
            'sleep_schedule': 'Daytime',
            'profile_picture': ''  #not testing profile picture file upload functionality
        }

        
        response = self.client.post(self.edit_profile_url, data, format='multipart')

        #check if editProfile profile raises an exception or not
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        #Check if user profile with new data is in the database
        profile = UserProfile.objects.get(user='testuser')
        self.assertEqual(profile.first_name, 'Mary')
        self.assertEqual(profile.bio, 'New better bio.')
        self.assertEqual(profile.age, 30)
        

    def tearDown(self):
        # Clean up database after each Test Case
        UserProfile.objects.filter(user='testuser').delete()
    
    def test_edit_profile_incorrect_field_values(self):
        test_cases = [
            {'user': 'testuser',
            'first_name': 'Mary',
            'last_name': 'Appleseed',
            'bio': 'New better bio.',
            'age': -1,
            'gender': 'F',
            'school': 'NYU',
            'pets': True,
            'allergies' : 'None',
            'budget': 1500,
            'sleep_schedule': 'Daytime',
            'profile_picture': ''}, #negative age 
            {'user': 'testuser',
            'first_name': 'Mary',
            'last_name': 'Appleseed',
            'bio': 'New better bio.',
            'age': 500, 
            'gender': 'F',
            'school': 'NYU',
            'pets': True,
            'allergies' : 'None',
            'budget': 1500,
            'sleep_schedule': 'Daytime',
            'profile_picture': ''}, #large age
            {'user': 'testuser',
            'first_name': 'Mary',
            'last_name': 'Appleseed',
            'bio': 'New better bio.',
            'age': -1,
            'gender': 'X',
            'school': 'NYU',
            'pets': True,
            'allergies' : 'None',
            'budget': 1500,
            'sleep_schedule': 'Daytime',
            'profile_picture': ''}, #invalid gender
            {'user': 'testuser',
            'first_name': ('Mary' * 26),
            'last_name': 'Appleseed',
            'bio': 'New better bio.',
            'age': 30,
            'gender': 'F',
            'school': 'NYU',
            'pets': True,
            'allergies' : 'None',
            'budget': 1500,
            'sleep_schedule': 'Daytime',
            'profile_picture': ''}, #first name too long
            {'user': 'testuser',
            'first_name': False,
            'last_name': 'Appleseed',
            'bio': 'New better bio.',
            'age': 30,
            'gender': 'F',
            'school': 'NYU',
            'pets': True,
            'allergies' : 'None',
            'budget': 1500,
            'sleep_schedule': 'Daytime',
            'profile_picture': ''}, #name is boolean
            {'user': 'testuser',
            'first_name': 'Mary',
            'last_name': 'Appleseed',
            'bio': 'New better bio.',
            'age': 30,
            'gender': 'F',
            'school': 'NYU',
            'pets': 'I have a cat, a dog, and many fish.',
            'allergies' : 'None',
            'budget': 1500,
            'sleep_schedule': 'Daytime',
            'profile_picture': ''}, #pet not boolean
            {'user': 'testuser',
            'first_name': 'Mary',
            'last_name': 'Appleseed',
            'bio': 'New better bio.',
            'age': 30,
            'gender': 'F',
            'school': 'NYU',
            'pets': True,
            'allergies' : True,
            'budget': 1500,
            'sleep_schedule': 'Daytime',
            'profile_picture': ''}, #allergies is boolean
            {'user': 'testuser',
            'first_name': 'Mary',
            'last_name': 'Appleseed',
            'bio': 'New better bio.',
            'age': 30,
            'gender': 'F',
            'school': 'NYU',
            'pets': True,
            'allergies' : 'None',
            'budget': 1500,
            'sleep_schedule': ('Nighttime' * 100),
            'profile_picture': ''}, #sleep_schedule is over 500 characters
            {'user': 'testuser',
            'first_name': 'Mary',
            'last_name': 'Appleseed',
            'bio': '''
             Passionate explorer. Coffee aficionado. Music junkie. Nature enthusiast.
             Adventure seeker. Bibliophile. Foodie. Wanderlust soul. Dreamer. Creative
             thinker. Curious mind. Tech geek. Animal lover. Star-gazer. Fitness freak.
             Movie buff. History nerd. Art admirer. Beach bum. Mountain lover. Photography
             enthusiast. Yoga practitioner. Poetry writer. DIY enthusiast. Gamer. Wine 
             connoisseur. Travel addict. Fashion enthusiast. Plant parent. Thrill-seeker. 
             Risk-taker. Life enthusiast. Eternal optimist. Daydreamer. Night owl. Sun chaser.
             Moon child. Rain lover. Snowflake catcher. Ice cream addict. Storyteller. Problem solver. 
             Icebreaker. Connector. Lifelong learner. Advocate of kindness. Believer in magic. Fueled 
             by passion, powered by dreams.
             ''',
            'age': 30,
            'gender': 'F',
            'school': 'NYU',
            'pets': True,
            'allergies' : 'None',
            'budget': 1500,
            'sleep_schedule': 'Daytime',
            'profile_picture': ''}, #bio over 500 characters long
             {'user': 'testuser',
            'first_name': 'Mary',
            'last_name': 'Appleseed',
            'bio': 'New better bio.',
            'age': 30,
            'gender': 'F',
            'school': 'NYU',
            'pets': True,
            'allergies' : 'None',
            'budget': -100,
            'sleep_schedule': 'Daytime',
            'profile_picture': ''}, #negative budget
            {'user': 'testuser',
            'first_name': 'Mary',
            'last_name': 'Appleseed',
            'bio': 'New better bio.',
            'age': 30,
            'gender': 'F',
            'school': 'NYU',
            'pets': True,
            'allergies' : 'None',
            'budget': 20001,
            'sleep_schedule': 'Daytime',
            'profile_picture': ''}, #unrealistic budget over $20,000
        ]

        for test_case in test_cases:
            with self.subTest(case=test_case):
                response = self.client.post(self.edit_profile_url, test_case, format='multipart')
                if response.status_code != status.HTTP_400_BAD_REQUEST:
                    print('Test failed:', response.data)  # This will print the error details
                self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)



class ListingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)  # Assuming authentication is required
        self.listing_url = reverse('createListing')
        self.photo_url = reverse('uploadListingPhoto')

    def test_create_listing_positive(self):
       
        data = {
            'username': self.user,
            'created_at': make_aware(datetime.datetime(2024, 4, 1, 0, 0)),
            'title': 'Test Title',
            'description': 'Test Description',
            'price': 1000,
            'location': 'Manhattan',
            'available_from': make_aware(datetime.datetime(2024, 5, 1, 0, 0)),
            'duration': '6 months',
            'preferences': 'Quite on the week days. Party on the weekends. Clean roommate. Will cook for me.',
            'is_active': True,
            'sqft': 800,
            'bedrooms': 2,
            'bathrooms': 1, # consider changing to float field in the model
            'amenities': 'Indoor olympic swimming pool.',
        }

        response = self.client.post(self.listing_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        #ascertain only one Listing instance/record was created
        self.assertEqual(Listing.objects.count(), 1)

    def test_create_listing_negative(self):
        #negative test with missing field values for title and price
        data = {
            'username': self.user,
            # Missing title
            'description': 'Test Description',
            # Missing Price
            'location': 'Test Location',
            'available_from':  make_aware(datetime.datetime(2024, 5, 1, 0, 0)),
            'duration': '6 months',
            'preferences': 'Quite on the week days. Party on the weekends. Clean roommate. Will cook for me.',
            'is_active': True,
            'sqft': 800,
            'bedrooms': 2,
            'bathrooms': 1, # consider changing to float field in the model
            'amenities': 'Indoor olympic swimming pool.',
        }

        response = self.client.post(self.listing_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_upload_photo_positive(self):
      
        listing = Listing.objects.create(username=self.user,
                                         created_at=  make_aware(datetime.datetime(2024, 4, 1, 0, 0)),
                                         title= 'Test Title',
                                         description= 'Test Description',
                                         price= 1000,
                                         location= 'Manhattan',
                                         available_from=  make_aware(datetime.datetime(2024, 5, 1, 0, 0)),
                                         duration= '6 months',
                                         preferences= 'Quite on the week days. Party on the weekends. Clean roommate. Will cook for me.',
                                         is_active= True,
                                         sqft= 800,
                                         bedrooms= 2,
                                         bathrooms= 1,
                                         amenities= 'Indoor olympic swimming pool.')
        
        #simulated photo from Django's standard uploadedfile module
        image = SimpleUploadedFile(name='awesome_image.jpg', content=b'image data', content_type='image/jpeg')

        photo_data = {
            'created_at': listing.created_at,
            'image': image  # Use a valid image path or SimpleUploadedFile for real testing
        }
        response = self.client.post(self.photo_url, photo_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(ListingPhoto.objects.count(), 1)

    def test_upload_photo_negative(self):
        listing = Listing.objects.create(username=self.user,
                                        created_at= datetime.date(2024, 4, 1),
                                        title= 'Test Title',
                                        description= 'Test Description',
                                        price= 1000,
                                        location= 'Manhattan',
                                        available_from= datetime.date(2024, 5, 1),
                                        duration= '6 months',
                                        preferences= 'Quite on the week days. Party on the weekends. Clean roommate. Will cook for me.',
                                        is_active= True,
                                        sqft= 800,
                                        bedrooms= 2,
                                        bathrooms= 1,
                                        amenities= 'Indoor olympic swimming pool.')
    
        #simulated photo from Django's standard uploadedfile module
        image = SimpleUploadedFile(name='awesome_image.jpg', content=b'image data', content_type='image/jpeg')

        data = {
            # Invalid or missing created_at
            'image': 'Invalid path'  # Invalid path to image
        }
        response = self.client.post(self.photo_url, data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def tearDown(self):
        self.client.logout()