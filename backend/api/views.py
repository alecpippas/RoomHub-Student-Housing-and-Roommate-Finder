import django
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from .serializers import *
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Listing
from rest_framework.generics import CreateAPIView
from PIL import Image


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
    profile=UserProfile.objects.filter(user=username).values()
    # print(profile)
    data={'user': username}                                                                            
    for q in profile:
        for field in q:
            if field=="id" or field=="user_id":
                continue
            data[field]=q[field]
    serializer = ProfileSerializer(data, many=False)
    return Response(data)

@parser_classes([MultiPartParser, FormParser])
@api_view(['POST'])
def editProfile(request, format=None):
    data = request.data
    print(data)
    try:
        obj = UserProfile.objects.filter(user=data['user'])
        if obj:
            obj.delete()
        if "profile_picture[]" in data:
            data["profile_picture"] = data["profile_picture[]"]
        serializer=ProfileSerializer(data=data, many=False)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
    except Exception as e:
        message={'details': e}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


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

@parser_classes([MultiPartParser, FormParser])
@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def createListing(request, format=None):
    data=request.data
    try:
        serializer=ListingSerializer(data=data, many=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        message={'details': e}
        print(e)
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@parser_classes([MultiPartParser, FormParser])
@api_view(['POST'])
def uploadListingPhoto(request, format=None):
    
    data=request.data.copy()
    creationTime=Listing.objects.order_by('created_at').last().created_at
    data.__setitem__("created_at", creationTime)
    try:
        serializer=ListingPhotoSerializer(data=data, many=False)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        message={'details': e}
        print(e)
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    return None




@api_view(['GET'])
def getListing(request, pk):
    created_at=pk
    postData = Listing.objects.filter(created_at=created_at).values()
    imageData = ListingPhoto.objects.filter(created_at=created_at).values()
    return Response({
        "postData":postData,
        "imageData":imageData
        })


@api_view(['GET'])
def getAllListings(request):
    listings=Listing.objects.all()
    images = ListingPhoto.objects.all()
    imageSerializer = ListingPhotoSerializer(images, many=True)
    serializer=ListingSerializer(listings, many=True)
    print(serializer.data)
    print('\n')
    print(imageSerializer.data)
    return Response({
        "postData": serializer.data,
        "imageData": imageSerializer.data
        })


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

# @api_view(['PUT', 'PATCH'])
# @permission_classes([IsAuthenticated])
# def updateListing(request):
#     listing_id = request.id
#     try:
#         listing = Listing.objects.get(id=listing_id)
#     except Listing.DoesNotExist:
#         #listing does not exist error message
#         error_message_dne = {'details': 'Listing not found\n' + str(Listing.DoesNotExist)}
#         return Response(error_message_dne, status=status.HTTP_404_NOT_FOUND)
#     except Exception as e:
#         #general error message
#         error_message_e = {'details': 'Error: ' + str(e)}
#         return Response(error_message_e, status=status.HTTP_400_BAD_REQUEST)


#     #check if partial update of the fields only included in the PATCH request
#     partial = request.method == 'PATCH'
#     serializer=ListingSerializer(listing, data=request.data, many=False, partial=partial)

#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_200_OK)
#     else:
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def updateListing(request, pk):
    created_at = pk
    data = request.data
    try:
        obj = Listing.objects.filter(created_at=created_at)
        print(obj.values)
        if obj:
            obj.delete()
        
        data["created_at"] = created_at
        serializer = ListingSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
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
def removeListing(request, pk):
    try:
            obj = Listing.objects.filter(created_at=pk)
            if obj:
                obj.delete()
            return Response(status=status.HTTP_200_OK)
    except Exception as e:
        error_message = {'details': e}
        print(e)
        return Response(error_message, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def postComment(request):
    
    data=request.data.copy()
    creationTime=Listing.objects.filter(created_at=data['created_at']).values_list("created_at")[0][0]
    # print(creationTime.values_list("created_at")[0])
    print((creationTime))
    print(type(creationTime))
    data['created_at'] = creationTime
    print(data)
    try:
        serializer=CommentSerializer(data=data, many=False)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        message={'details': e}
        print(e)
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    return None

@api_view(['GET'])
def getComments(request, pk):
    created_at = pk
    # unitRentID = request.data.get('unitRentID')
    results = Comment.objects.filter(created_at=created_at).values_list()
    # print(results)
    data = []
    for res in results:
        data.append(res)
    

    return Response({"data": data})



@api_view(["POST"])  # Allows only POST requests to this view.
def addFav(request):
    data=request.data
    print(data)
    try:
        serializer=FavSerializer(data=data, many=False)
        print(serializer)
        if serializer.is_valid():
            print("yes")
            serializer.save()
            print("yes")
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        message={'details': e}
        print(e)
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["GET"])
def getFavs(request, pk):
    print("holy")
    usernaame=pk
    favorites = Fav.objects.filter(username=usernaame).values()
    print(favorites)
    return Response({
        "data": favorites
        })
    

@api_view(['POST'])
def checkFav(request):
    username = request.data.get("username")
    created_at = request.data.get("created_at")
    try:
        favObj = Fav.objects.filter(username=username, created_at=created_at)
        print(favObj)
        
        if favObj:
            return JsonResponse({'data': True}, status=200)
        
        return JsonResponse({'data': False}, status=200)
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def delFav(request):
    username = request.data.get("username")
    created_at = request.data.get("created_at")
    try:
            obj = Fav.objects.filter(created_at=created_at, username=username)
            if obj:
                obj.delete()
            return Response(status=status.HTTP_200_OK)
    except Exception as e:
        error_message = {'details': e}
        print(e)
        return Response(error_message, status=status.HTTP_400_BAD_REQUEST)
