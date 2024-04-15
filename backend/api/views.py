import django
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from .serializers import *
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Listing
from .serializers import ListingSerializer
from rest_framework.generics import CreateAPIView
from verify_email.email_handler import send_verification_email



# for sending verification email and generating tokens
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from .utils import TokenGenerator,generate_token
from django.utils.encoding import force_bytes,force_text,DjangoUnicodeDecodeError
from django.core.mail import EmailMessage
from django.conf import settings
from django.views.generic import View


# Create your views here.
@api_view(['GET'])
def getRoutes(request):
    return Response('Hello Team RoomHub')

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer=UserSerializerWithToken(self.user).data
        for k,v in serializer.items():
            data[k]=v

        return data
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class=MyTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user=request.user
    serializer=UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    user=User.objects.all()
    serializer=UserSerializer(user,many=True)
    return Response(serializer.data)


@api_view(['POST'])
def registerUser(request):
    data=request.data
    try:
        user=User.objects.create(first_name=data['fname'], 
                                 last_name=data['lname'], 
                                 username=data['email'],
                                 email=data['email'],
                                 password=make_password(data['password']),
                                 is_active=False)

        # generate token for sending verification email
        email_subject="RoomHub: Activate Your Account"
        message=render_to_string(
            "activate.html",
            {
                "user":data['fname'],
            # Change this to domain name when deploying for production
                "domain":"127.0.0.1:8000",
                "uid":urlsafe_base64_encode(force_bytes(user.pk)),
                "token":generate_token.make_token(user)
            }
        )
        email_message=EmailMessage(email_subject, message, settings.EMAIL_HOST_USER, [data['email']])
        email_message.send()

        serialize=UserSerializerWithToken(user, many=False)

        return Response(serialize.data)
    except Exception as e:
        if type(e) == django.db.utils.IntegrityError:
            message={'details': "Email Is Already Taken"}
        else:
            message={'details':e}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
def getProfile(request, username):
    profile=UserProfile.objects.filter(user__username=username).values()
    data={'username': username}                                                                            
    for q in profile:
        for field in q:
            if field=="id" or field=="user_id":
                continue
            data[field]=q[field]
    serializer = ProfileSerializer(data, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def editProfile(request):
    data = request.data
    print(data)
    try:
        obj = UserProfile.objects.filter(user__username=data['username'])
        print(obj.values())
        if obj:
            obj.delete()

        serializer=ProfileSerializer(data=data, many=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
    except Exception as e:
        message={'details': e}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


class ListListingsView(APIView):
    def get(self, request, format=None):
        listings = Listing.objects.all()
        serializer = ListingSerializer(listings, many=True)
        return Response(serializer.data)
    
class CreateListingView(CreateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticated]  # Require users to be authenticated

class ActivateAccountView(View):
    def get(self, request, uidb64, token):
        try:
            uid=force_text(urlsafe_base64_decode(uidb64))
            user=User.objects.get(pk=uid)
        except Exception as identifier:
            user=None
        if user is not None and generate_token.check_token(user, token):
            user.is_active=True
            user.save()
            return render(request, "activatesuccess.html")
        else:
            return render(request, "activatefail.html")

            # message={"details":"Account is activated!"}
            # return Response(message, status=status.HTTP_200_OK)


#CRUD Views for Listings

#CREATE

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createListing(request):
    data=request.data
    try:
        #frontend is only sending the following fields to the backend for now
        #add more fields in the future
        listing=Listing.objects.create(title=data['title'], 
                                 description=data['description'], 
                                 price=data['price'],
                                 is_active=True)
        
        serialize=ListingSerializer(listing, many=False)
        return Response(serialize.data)
    except Exception as e:
        message={'details': e}
        print(e)
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

#READ

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getListing(request):
    listing=request.user
    serializer=ListingSerializer(listing, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getAllListings(request):
    listings=Listing.objects.all()
    serializer=ListingSerializer(listings, many=True)
    return Response(serializer.data)


#READ Multiple listings after Search Bar query or updating filters on listing webpage

#@api_view(['GET'])
#@permission_classes([IsAuthenticated])
#def getFilteredListings(request):
    #search_query filters
#    location = request.GET.get('location', None)
#    available_from = request.GET.get('available_from', None)
#    duration = request.GET.get('duration', None)
#    min_price = request.GET.get('min_price', None)
#    max_price = request.GET.get('max_price', None)

    # Start with all listings
    #queryset = RoomListing.objects.all()
    
    # Apply filters if parameters are provided
    #if title:
    #    queryset = queryset.filter(title__icontains=title)
    #if location:
    #    queryset = queryset.filter(location__icontains=location)
    #if available_from:
    #    try:
    #        available_date = datetime.datetime.strptime(available_from, "%Y-%m-%d").date()
    #        queryset = queryset.filter(available_from__gte=available_date)
    #    except ValueError:
    #        return JsonResponse({'error': 'Invalid date format. Please use YYYY-MM-DD.'}, status=400)
    #if duration:
    #    queryset = queryset.filter(duration__icontains=duration)
    #if is_active is not None:
    #    is_active = is_active.lower() in ['true', '1', 't']
    #    queryset = queryset.filter(is_active=is_active)
    #if min_price:
    #    queryset = queryset.filter(price__gte=min_price)
    #if max_price:
    #    queryset = queryset.filter(price__lte=max_price)
    
    # Transform the queryset into a list of dictionaries
    #listings = list(queryset.values('id', 'owner', 'title', 'location', 'available_from', 'duration', 'is_active', 'price'))
    
    # Return the filtered listings as JSON
    #return JsonResponse({'listings': listings})

#UPDATE

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def updateListing(request):
    listing_id = request.id
    try:
        listing = Listing.objects.get(id=listing_id)
    except Listing.DoesNotExist:
        #listing does not exist error message
        error_message_dne = {'details': 'Listing not found\n' + str(Listing.DoesNotExist)}
        return Response(error_message_dne, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        #general error message
        error_message_e = {'details': 'Error: ' + str(e)}
        return Response(error_message_e, status=status.HTTP_400_BAD_REQUEST)


    #check if partial update of the fields only included in the PATCH request
    partial = request.method == 'PATCH'
    serializer=ListingSerializer(listing, data=request.data, many=False, partial=partial)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#REMOVE

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def removeListing(request):
    listing_id = request.id
    try:
        listing = Listing.objects.get(id=listing_id)
        listing.delete()
        success_message = {'details' : f'Listing {listing_id} has successfully been removed.'}
        return Response(success_message)
    except Exception as e:
        error_message = {'details': e}
        print(e)
        return Response(error_message, status=status.HTTP_400_BAD_REQUEST)



