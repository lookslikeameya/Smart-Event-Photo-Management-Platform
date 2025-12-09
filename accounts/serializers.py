import random
from django.core.mail import send_mail
from rest_framework import serializers
from .models import User, EmailOTP


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "username", "password"]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        user.is_verified = False
        user.save()

        otp_code = str(random.randint(100000, 999999))
        EmailOTP.objects.create(user=user, otp=otp_code)

        send_mail(
            subject="Your OTP Code",
            message=f"Your verification code is {otp_code}",
            from_email="no-reply@smartevent.com",
            recipient_list=[user.email],
        )

        return user

class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        user = User.objects.filter(email=data["email"]).first()
        if not user:
            raise serializers.ValidationError("User not found.")

        otp_obj = EmailOTP.objects.filter(user=user, otp=data["otp"], is_used=False).last()

        if not otp_obj:
            raise serializers.ValidationError("Invalid OTP.")

        if otp_obj.is_expired():
            raise serializers.ValidationError("OTP expired.")

        data["user"] = user
        data["otp_obj"] = otp_obj
        return data

    def save(self):
        user = self.validated_data["user"]
        otp_obj = self.validated_data["otp_obj"]

        user.is_verified = True
        user.save()

        otp_obj.is_used = True
        otp_obj.save()

        return user
