from django.conf import settings
import requests
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

from .models import CustomUser, Educator, Student

from django.contrib.auth.hashers import make_password

User = get_user_model()


#for edit profile
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password


class CustomUserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    company = serializers.CharField(write_only=True, allow_blank=True, required=False)
    professional_title = serializers.CharField(write_only=True, allow_blank=True, required=False)
    linkedIn_account = serializers.URLField(write_only=True, allow_blank=True, required=False)
    areas_of_specialization = serializers.CharField(write_only=True, allow_blank=True, required=False)

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'birthday', 'role', 'email', 'password1', 'password2', 'profile_pic', 
                  'company', 'professional_title', 'linkedIn_account', 'areas_of_specialization']

    def validate(self, data):
        # Custom validation for email could also go here, but it's okay in validate_email
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password2": "Password fields didn't match."})
        
        # Example of password strength validation
        if len(data['password1']) < 8:
            raise serializers.ValidationError({"password1": "The password is too weak."})
        
        # Add more validations as needed
        return data

    def validate_email(self, value):
        if CustomUser.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password1')
        educator_data = {k: validated_data.pop(k, None) for k in ['company', 'professional_title', 'linkedIn_account', 'areas_of_specialization']}

        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        if user.role == 'teacher':
            Educator.objects.create(user=user, **educator_data)
        if user.role == 'student':
            student_data = {}
            Student.objects.create(user=user, **student_data)
        
        return user

class AdminUserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'email', 'password1', 'password2', 'role']
        # You had a typo here with missing comma after 'password2'
        # Removed extra_kwargs for 'password' since 'password1' and 'password2' are used instead

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password2": "Password fields didn't match."})
        
        if len(data['password1']) < 8:
            raise serializers.ValidationError({"password1": "The password is too weak."})
        
        return data

    def validate_email(self, value):
        if CustomUser.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email is already registered.")
        return value

    def create(self, validated_data):
        validated_data.pop('password2')  # Remove 'password2' as it's not needed after validation
        password = validated_data.pop('password1')
        validated_data['email_verified'] = True  # Set email_verified to True

        user = CustomUser.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        # Assuming 'educator_data' needs to be defined or fetched from 'validated_data' if role is 'teacher'
        if user.role == 'teacher':
            # You need to ensure 'educator_data' is correctly defined or extracted from 'validated_data' before this
            educator_data = {}  # This is just a placeholder. Adapt as necessary.
            Educator.objects.create(user=user, **educator_data)

        if user.role == 'student':
            student_data = {}
            Student.objects.create(user=user, **student_data)
        
        return user
    


# For Student Profile
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'birthday', 'profile_pic', 'role']

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()  # Method field for dynamically calculated data

    class Meta:
        model = Student
        fields = ['user', 'areas_of_interest', 'full_name']

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"  


class EditStudentProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', required=False)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    birthday = serializers.DateField(source='user.birthday', required=False)
    profile_pic = serializers.ImageField(source='user.profile_pic', required=False)
    password = serializers.CharField(write_only=True, required=False)
    areas_of_interest = serializers.CharField()

    class Meta:
        model = Student
        fields = ['email', 'first_name', 'last_name', 'birthday', 'profile_pic', 'password', 'areas_of_interest']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        password_errors = []  # Initialize an empty list to collect password validation errors
        if 'password' in validated_data:
            password = validated_data.pop('password')
            try:
                validate_password(password)
                instance.user.password = make_password(password)
            except ValidationError as e:
                password_errors.extend(list(e.messages))  # Collect the password validation errors

        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()


        # If there were any password validation errors, raise a ValidationError
        if password_errors:
            raise serializers.ValidationError({'password': password_errors})

        return instance  
    


#For teachers profile
class TeacherProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()  # Method field for dynamically calculated data
    request_date = serializers.SerializerMethodField()  # Use a method field to get the date joined from the User model

    class Meta:
        model = Educator
        fields = ['user', 'id','company','professional_title','linkedIn_account','areas_of_specialization', 'full_name', 'request_date']

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}" 
    
    def get_request_date(self, obj):
        return obj.user.date_joined.date()


class EditTeacherProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', required=False)
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    birthday = serializers.DateField(source='user.birthday', required=False)
    profile_pic = serializers.ImageField(source='user.profile_pic', required=False)
    password = serializers.CharField(write_only=True, required=False)
    company=serializers.CharField()
    professional_title=serializers.CharField()
    linkedIn_account=serializers.URLField()
    areas_of_specialization=serializers.CharField()

    class Meta:
        model = Educator
        fields = ['email', 'first_name', 'last_name', 'birthday', 'profile_pic', 'password', 'company','professional_title','linkedIn_account','areas_of_specialization']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        password_errors = []  # Initialize an empty list to collect password validation errors
        if 'password' in validated_data:
            password = validated_data.pop('password')
            try:
                validate_password(password)
                instance.user.password = make_password(password)
            except ValidationError as e:
                password_errors.extend(list(e.messages))  # Collect the password validation errors

        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()


        # If there were any password validation errors, raise a ValidationError
        if password_errors:
            raise serializers.ValidationError({'password': password_errors})

        return instance 
    
    
    
    
#for fetching data from Course Microservice
class SimpleContentSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    type = serializers.CharField(max_length=100)
    reference = serializers.CharField(max_length=255, required=False, allow_null=True)  # Keep for non-text content
    text_content = serializers.CharField(required=False, allow_null=True)  # Additional field for text content



class SimpleLessonSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField(max_length=200)
    contents = SimpleContentSerializer(many=True)

class SimpleSectionSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField(max_length=200)
    description = serializers.CharField(max_length=300)
    lessons = SimpleLessonSerializer(many=True, required=False, default=[])

class SimpleCourseSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    title = serializers.CharField(max_length=200)
    instructor = serializers.IntegerField()  # Assuming instructor is represented by an ID
    category = serializers.CharField(max_length=100)
    description = serializers.CharField()
    duration = serializers.CharField(max_length=50)
    difficultyLevel = serializers.CharField(max_length=50)
    coursePic = serializers.URLField(required=False, allow_null=True)
    isPublished = serializers.BooleanField()
    sections = SimpleSectionSerializer(many=True)
    enrolled_students = serializers.SerializerMethodField()

    def get_enrolled_students(self, obj):
        # Ensure this prints to verify the method is being called
        print("Course Object Received in Serializer:", obj)
        print('\n')
        print('\n')

        # This should return the 'enrolled_students' field if it exists in the obj
        return obj.get('enrolled_students', 0)
    
    
class EducatorWithUserSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()  # Nested user details

    class Meta:
        model = Educator
        fields = ['company', 'professional_title', 'linkedIn_account', 'user']  # include other fields as needed