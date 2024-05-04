from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = get_user_model()  # Uses your custom user model
        fields = UserCreationForm.Meta.fields + ('email', 'birthday', 'profile_pic', 'role',)
