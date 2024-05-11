from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """
        Create and return a user with an email and password.
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        
        # Set the username after the user is created
        user.username = str(user.pk)
        user.save(using=self._db)
        
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and return a superuser with an email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)



class CustomUser(AbstractUser):
    email = models.EmailField(_('email address'), unique=True)  # Make email unique
    objects = CustomUserManager()  # Use the custom manager
    birthday = models.DateField(null=True, blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics/',default='profile_pics/profile-img.png', blank=True, null=True)
    role = models.CharField(max_length=20, blank=True, null=True)
    email_verified = models.BooleanField(default=False)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # Keep other required fields if any

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def save(self, *args, **kwargs):
        creating = not self.pk  # Check if the instance is being created
        super().save(*args, **kwargs)  # Save the instance first to get an ID
        if creating:
            self.username = str(self.pk)
            super().save(update_fields=['username'])  # Save again with the new username


# Abstract base class for profiles
class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="%(class)s_profile")

    class Meta:
        abstract = True

# Definition of Student model
class Student(Profile):
    areas_of_interest = models.TextField(blank=True)
    def get_absolute_url(self):
        return reverse('student_detail', kwargs={'pk': self.pk})


# Definition of Educator model
class Educator(Profile):
    company = models.CharField(max_length=100, blank=True)
    professional_title = models.CharField(max_length=100, blank=True)
    linkedIn_account = models.URLField(max_length=200, blank=True)
    is_official_reviewer = models.BooleanField(default=False)
    areas_of_specialization = models.TextField(blank=True)
    educator_verified = models.BooleanField(default=False)

    def get_absolute_url(self):
        return reverse('educator_detail', kwargs={'pk': self.pk})

# Definition of Admin model
class Admin(Profile):
    def get_absolute_url(self):
        return reverse('admin_detail', kwargs={'pk': self.pk})
