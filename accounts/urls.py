from django.urls import path
from .views import RegisterAPIView, VerifyOTPAPIView

urlpatterns = [
    path("register/", RegisterAPIView.as_view()),
    path("verify-otp/", VerifyOTPAPIView.as_view()),
]
