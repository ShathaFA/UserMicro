"""MindescapeA URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import UserListView, delete_user,CreateUserView



urlpatterns = [
    path('',views.AdminPanel, name = 'AdminPanel'),
    path('AIrequest',views.AIrequest, name = 'AIrequest'),
    path('EduRequest',views.EduRequest, name = 'EduRequest'),
    path('userMang',views.userMang, name = 'userMang'),

    path('userMang/api/', UserListView.as_view(), name='UserListView'),
    path('userMang/api/delete/<int:user_id>/', delete_user, name='delete_user'),
    path('userMang/api/create_user/', CreateUserView.as_view(), name='create_user'),


    path('educator/approve/<int:pk>/', views.approve_educator, name='approve_educator'),
    path('educator/deny/<int:pk>/', views.deny_educator, name='delete_educator'),
    path('educator/details/<int:pk>/', views.educator_details, name='educator_details'),
    path('educator/list/', views.list_educators, name='list_educators'),  # New path for listing educators

]