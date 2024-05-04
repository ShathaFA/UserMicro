from django.urls import path
from .views import *
from .views import logout_user  


urlpatterns = [
    path('signup/api', UserSignUpView.as_view(), name='signup_api'),
    path('signup/', signup_page, name='signup_page'),  # HTML page
    path('login/', login_page, name='login_page'),
    path('forgetPass/', forgetPass, name='forgetPass'),
    path('logout/', logout_user, name='logout'),

    path('verify-email/<token>/', verify_email, name='verify-email'),
    

    path('', profile_redirect, name='profile_redirect'),
    path('stdProfile/', stdProfile, name='stdProfile'),
    path('stdProfile/api/', StudentProfileView.as_view(), name='api-student-profile'),
    path('tchrProfile/', tchrProfile, name='tchrProfile'),
    path('tchrProfile/api/', TeacherProfileView.as_view(), name='api-teacher-profile'),


    path('edit/', editProfile_redirect, name='editProfile_redirect'),
    path('editProfile/', editStdProfile, name='editProfile'),
    path('editProfile/api/', EditStudentProfileView.as_view(), name='editProfileAPI'),
    path('editTchProfile/', editTchProfile, name='editTchProfile'),
    path('editTchrProfile/api/', EditTeacherProfileView.as_view(), name='editTchrProfileAPI'),
    #STT path('speech/recognition/', convert_speech_to_text, name='speech_recognition'),

    

    #for reset password

    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    path('confirmPass/<uidb64>/<token>/', confirm_password_reset, name='confirmPass'),

]   

