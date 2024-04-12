from django.contrib import admin
from .models import UserProfile, RoomListing, Message, Favorite

# regestering models make them accessible (create, read, update, and delete records) through and admin interface
# Register your models here.
admin.site.register(UserProfile)
admin.site.register(RoomListing)
admin.site.register(Message)
admin.site.register(Favorite)