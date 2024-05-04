from django.shortcuts import render, redirect, get_object_or_404

from rest_framework.generics import ListAPIView
from userProfile.models import CustomUser, Educator
from userProfile.serializers import CustomUserSerializer,TeacherProfileSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from rest_framework import serializers
from userProfile.serializers import CustomUserSerializer, AdminUserSerializer
from userProfile.models import CustomUser  # Ensure you import your CustomUser model
from rest_framework.generics import CreateAPIView
from rest_framework import status


def AdminPanel(request):
    return render(request,'AdminPanel.html')

def AIrequest(request):
    return render(request,'AI-Request.html')

def EduRequest(request):
    return render(request,'Edu-Request.html')

def userMang(request):
    return render(request,'userMang.html')


class UserListView(ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = CustomUser.objects.get(pk=user_id)
        user.delete()
        return Response(status=204)
    except CustomUser.DoesNotExist:
        return Response(status=404)
    


#Create User (in admin panel)
User = get_user_model()

class CreateUserView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = AdminUserSerializer
    
    
    
@api_view(['POST'])
def approve_educator(request, pk):
    try:
        educator = Educator.objects.get(pk=pk)
        educator.educator_verified = True
        educator.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Educator.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def deny_educator(request, pk):
    try:
        educator = Educator.objects.get(pk=pk)
        educator.educator_verified = False
        educator.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Educator.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def educator_details(request, pk):
    try:
        educator = Educator.objects.get(pk=pk)
        serializer = TeacherProfileSerializer(educator)
        return Response(serializer.data)
    except Educator.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    
@api_view(['GET'])
def list_educators(request):
    educators = Educator.objects.all()  # Adjust this query as needed
    serializer = TeacherProfileSerializer(educators, many=True)
    return Response(serializer.data)

