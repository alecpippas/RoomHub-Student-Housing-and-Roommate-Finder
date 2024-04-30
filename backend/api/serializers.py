from rest_framework import serializers
# from .models import Products
from django.contrib.auth.models import User
# from .models import RoomListing
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile, Listing, ListingPhoto, Comment, Fav, Message



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
        model=Listing
        #currently frontend only supports the following fields from RoomListings model
        #fields from the request body not explicitly listed here will not be updated in the database
        fields=['title','description','price','is_active','created_at']
        read_only_fields = ('created_at',)
    #customer serializer accessor methods
    

class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = [
            'created_at',
            'username',
            'title',
            'description',
            'price',
            'location',
            'available_from',
            'duration',
            'preferences',
            'is_active',
            'sqft',
            'bedrooms',
            'bathrooms',
            'amenities'
            # 'image'
        ]


class ListingPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingPhoto
        fields = ['created_at', 'image']

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['created_at', "username", 'content']


class FavSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fav
        fields = ['created_at', "username", "title"]


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserProfile
        fields = [
            'user',
            'first_name',
            'last_name',
            'bio',
            'age',
            'gender',
            'school',
            'pets',
            'allergies',
            'budget',
            'sleep_schedule',
            'profile_picture'
        ]
    
    def validate_age(self, value):
        '''Validate that age is positive and within a reasonable range'''
        if value < 0 or value > 130:
            raise serializers.ValidationError("Age must be between 0 and 130")
        return value
    
    def validate_gender(self, value):
        '''Validate that gender is one of the valid genders'''
        valid_genders = ['M', 'F', 'O']
        if value not in valid_genders:
            raise serializers.ValidationError("Invalid gender provided.")
        else:
            return value
    
    def validate_pets(self, value):
        '''ensure pets is a boolean'''
        if not isinstance(value, bool):
            raise serializers.ValidationError('Pets must be true or false.')
        return value
        
    def validate_first_name(self, value):
        '''Validate first name is less than 100 character database constraint and is a string'''
        if len(value) > 100:
            raise serializers.ValidationError("First name must be less than 100 characters long")
        if value == 'False' or value == 'True': #parser recasts non-string request data from HTML form into string
            raise serializers.ValidationError('First name must be a string.')
        return value
        
    def validate_last_name(self, value):
        '''Validate last name is less than 100 character database constraint and is a string'''
        if len(value) > 100:
            raise serializers.ValidationError("Last name must be less than 100 characters long")
        if not isinstance(value, str):
            raise serializers.ValidationError('Last name must be a string.')
        return value
    
    def validate_sleep_schedule(self, value):
        '''Validate sleep schedule not over 500 characters'''
        if len(value) > 500:
            raise serializers.ValidationError("Sleep schedule is too long. Must be less than 500 characters")
        else:
            return value
    
    def validate_bio(self, value):
        '''Validate bio is 500 or less characters long'''
        if len(value) > 500:
            raise serializers.ValidationError("Bio is too long. Must be 500 or less characters long.")
        else:
            return value

    def validate_allergies(self, value):
        '''Validate allergies is string value'''
        if value == 'True' or value == 'False':
            raise serializers.ValidationError("Allergies must be descriptive, non-boolean.")
        else:
            return value
    
    def validate_budget(self, value):
        '''Validate that budget is non-negative and reasonable (20,000/month or below)'''
        if value < 0 or value > 20000:
            raise serializers.ValidationError("The budget is not within range. Must be between $0 and $20,000 exclusive.")
        else:
            return value
        
    

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'message', 'timestamp', 'read']
    def create(self, validated_data):
        return super().create(validated_data)