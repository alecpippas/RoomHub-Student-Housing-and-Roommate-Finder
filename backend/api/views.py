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
                                 is_active=True)
        
        serialize=UserSerializerWithToken(user, many=False)
        return Response(serialize.data)
    except Exception as e:
        message={'details': e}
        print(e)
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

