from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import datetime   
# Create your models here.

"""--------------------------User's profile table----------------------------------"""

def uploadListingImage(instance, filename=""):
    # print('listings/{filename}'.format(filename=filename))
    return 'listings/{filename}'.format(filename=filename)

def uploadProfilePicture(instance, filename=""):
    return 'profiles/{filename}'.format(filename=filename)


class UserProfile(models.Model):    

    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    # user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', default=1)
    user = models.CharField(max_length=100, primary_key=True, default="None")
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    bio = models.TextField(max_length=500, null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    school = models.CharField(max_length=255, null=True, blank=True)
    pets = models.BooleanField(default=False)
    allergies = models.TextField(max_length=500, blank=True, null=True)
    budget = models.IntegerField(null=True, blank=True, default=0)
    sleep_schedule = models.TextField(max_length=500, blank=True, null=True)
    profile_picture = models.ImageField(upload_to=uploadProfilePicture, default='profiles/default.png')

    class Meta:
        ordering = ['last_name']

    def __str__(self):
        return self.user


"""--------------------------Room Listing board table----------------------------------"""
class Listing(models.Model):
    created_at = models.DateTimeField(default=timezone.now, unique=True)
    username = models.ForeignKey(User, on_delete=models.CASCADE, to_field="username", related_name='listings')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    price = models.IntegerField(default=0)
    location = models.CharField(max_length=255, default="")
    available_from = models.DateField(default=datetime.date.today)
    duration = models.CharField(max_length=100, blank=True, null=True)  # Example: "3 months", "indefinite", etc.
    preferences = models.TextField(blank=True, null=True)  # Roommate preferences
    is_active = models.BooleanField(default=True)
    sqft=models.IntegerField(default=0)
    bedrooms=models.IntegerField(default=0)
    bathrooms=models.IntegerField(default=0)
    amenities=models.JSONField(blank=True, null=True)

    def __str__(self):
        time = str(self.created_at)
        return self.title
    
class ListingPhoto(models.Model):
    created_at = models.ForeignKey(Listing, to_field="created_at", on_delete=models.CASCADE)
    image = models.ImageField(upload_to=uploadListingImage, default='listings/default.jpg')

class Comment(models.Model):
    created_at = models.ForeignKey(Listing, to_field="created_at", on_delete=models.CASCADE)
    username = models.CharField(max_length=100, null=True, blank=True)
    content = models.TextField(null=True, blank=True)

# """-------------------------Messege box------------------------------------------------"""
class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"From {self.sender} to {self.receiver} at {self.timestamp}"
    
# """------------------------------Favorite the unit------------------------------------"""
class Fav(models.Model):
    created_at = models.ForeignKey(Listing, to_field="created_at", on_delete=models.CASCADE)
    username = models.ForeignKey(User, on_delete=models.CASCADE, to_field="username", related_name='fav')
    title = models.CharField(max_length=100, null=True, blank=True)
