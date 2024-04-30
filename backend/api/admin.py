from django.contrib import admin
from .models import UserProfile, Listing, Message, ListingPhoto, Comment, Fav
# from .models import UserProfile, Listing, Message, Favorite


# regestering models make them accessible (create, read, update, and delete records) through and admin interface
# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Listing)
admin.site.register(Message)
# admin.site.register(Favorite)
admin.site.register(ListingPhoto)
admin.site.register(Comment)
admin.site.register(Fav)