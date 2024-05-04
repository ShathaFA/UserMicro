from django.contrib import admin
from .models import CustomUser, Educator, Student

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'email', 'role', 'birthday', 'profile_pic')

    
@admin.register(Educator)
class CustomEducatorAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_email', 'company', 'professional_title', 'linkedIn_account', 'is_official_reviewer', 'areas_of_specialization')

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'  # Optional: to set a column name

@admin.register(Student)
class CustomStudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_email', 'areas_of_interest')

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'  # Optional: to set a column name
