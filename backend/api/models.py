from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import datetime   
# Create your models here.

"""--------------------------User's profile table----------------------------------"""

def upload_to(instance, filename=""):
    # print('listings/{filename}'.format(filename=filename))
    return 'listings/{filename}'.format(filename=filename)

class UserProfile(models.Model):    

    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', default=1)
    # username = models.CharField(max_length=100, null=True, default="None")
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    # profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    profile_picture = models.CharField(max_length=1, null=True, blank=True, default="")
    bio = models.TextField(max_length=500, null=True, blank=True)
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    school = models.CharField(max_length=255, null=True, blank=True)
    pets = models.BooleanField(default=False)
    allergies = models.TextField(max_length=500, blank=True, null=True)
    budget = models.IntegerField(null=True, blank=True, default=0)
    sleep_schedule = models.TextField(max_length=500, blank=True, null=True)

    class Meta:
        ordering = ['last_name']

    def __str__(self):
        return self.user.username


"""--------------------------Room Listing board table----------------------------------"""
class Listing(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listings', default=1)
    created_at = models.DateTimeField(default=timezone.now)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    location = models.CharField(max_length=255, default="")
    available_from = models.DateField(default=datetime.date.today)
    duration = models.CharField(max_length=100, blank=True, null=True)  # Example: "3 months", "indefinite", etc.
    preferences = models.TextField(blank=True, null=True)  # Roommate preferences
    # is_active = models.BooleanField(default=True)
    sqft=models.IntegerField(default=0)
    bedrooms=models.IntegerField(default=0)
    bathrooms=models.IntegerField(default=0)
    amenities=models.JSONField(blank=True, null=True)
    image = models.ImageField(upload_to=upload_to, default='listings/default.jpg')

    def __str__(self):
        return self.title
    
class ListingPhoto(models.Model):
    # created_at = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(upload_to=upload_to, default='listings/default.jpg')

# """--------------------------Room Listing board table----------------------------------"""
# class RoomListing(models.Model):
#     owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='listings')
#     title = models.CharField(max_length=255)
#     description = models.TextField()
#     location = models.CharField(max_length=255)
#     available_from = models.DateField()
#     duration = models.CharField(max_length=100)  # Example: "3 months", "indefinite", etc.
#     preferences = models.TextField(blank=True, null=True)  # Roommate preferences
#     created_at = models.DateTimeField(default=timezone.now)
#     is_active = models.BooleanField(default=True)

#     def __str__(self):
#         return self.title
    
# """-------------------------Messege box------------------------------------------------"""
class Message(models.Model):
    sender = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"From {self.sender.user.username} to {self.recipient.user.username} at {self.timestamp}"
    
# """------------------------------Favorite the unit------------------------------------"""
class Favorite(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='favorites')
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='favorited_by')

    class Meta:
        unique_together = ('user', 'listing')  # Ensures a user can't favorite the same listing more than once

    def __str__(self):
        return f"{self.user.user.username} favorites {self.listing.title}"  