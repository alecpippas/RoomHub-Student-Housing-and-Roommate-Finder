from rest_framework import serializers
# from .models import Products
from django.contrib.auth.models import User
from .models import RoomListing
from rest_framework_simplejwt.tokens import RefreshToken

class UserSerializer(serializers.ModelSerializer):
    name=serializers.SerializerMethodField(read_only=True)
    _id=serializers.SerializerMethodField(read_only=True)
    isAdmin=serializers.SerializerMethodField(read_only=True)
   
    class Meta:
        model=User
        fields=['id','_id','username','email','name','isAdmin']
    
    def get_name(self,obj):
        firstname=obj.first_name
        lastname=obj.last_name
        name=firstname+' '+lastname
        if name=='':
            name=obj.email[:5]
            return name
        return name
    
    def get__id(self,obj):
        return obj.id

    def get_isAdmin(self,obj):
        return obj.is_staff


class UserSerializerWithToken(UserSerializer):
    token=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=User
        fields=['id','_id','username','email','name','isAdmin','token'] # fields from the built-in Django 'User' Model
    
    def get_token(self,obj):
        token=RefreshToken.for_user(obj)
        return str(token.access_token)
    
#serializes data from Room model into JSON for the HTTP Request
class RoomListingSerializer(serializers.ModelSerializer):
    #custom serializer fields
    #owner=serializers.SerializerMethodField(read_only=True)
   
    class Meta:
        model=RoomListing
        #currently frontend only supports the following fields from RoomListings model
        #fields from the request body not explicitly listed here will not be updated in the database
        fields=['title','description','price','is_active','created_at']
        read_only_fields = ('created_at',)
    #customer serializer accessor methods
    
    