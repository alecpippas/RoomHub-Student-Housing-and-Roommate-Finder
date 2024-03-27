from django.contrib import admin
from .models import UserProfile, RoommateListing, Message, Favorite

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(RoommateListing)
admin.site.register(Message)
admin.site.register(Favorite)