from django.contrib import admin
from .models import UserProfile, Listing, Message, Favorite

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Listing)
admin.site.register(Message)
admin.site.register(Favorite)