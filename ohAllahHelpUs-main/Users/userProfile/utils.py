from django.conf import settings
from django.core.signing import Signer
from django.urls import reverse
from django.core.mail import send_mail
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import PasswordResetTokenGenerator

User = get_user_model()

def send_verification_email(user):
    signer = Signer()
    token = signer.sign(user.pk)
    verification_url = reverse('verify-email', args=[token])
    full_url = f'{settings.SITE_DOMAIN}{verification_url}'
    send_mail(
        'Verify your email',
        f'Please click on the link to verify your email: {full_url}',
        'from@example.com',
        [user.email],
        fail_silently=False,
    )


token_generator = PasswordResetTokenGenerator()

