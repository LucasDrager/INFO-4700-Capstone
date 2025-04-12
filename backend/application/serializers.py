#################################
#          IMPORTS
#################################
# AUTH
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User

# DATABASE
from .models import File

#################################
#    SECURITY API INFORMATION
#################################
User = get_user_model()
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def validate_email(self, value):
        """Ensure the email is unique"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def create(self, validated_data):
        """Create and return a new user with hashed password"""
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password']
        )
        
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['email'] = self.user.email
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

#################################
#   DATABASE API INFORMATION
#################################
class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['id', 'file', 'file_name', 'uploaded_at']
        read_only_fields = ['file_name', 'uploaded_at', 'id']

    def create(self, validated_data):
        validated_data['file_name'] = validated_data['file'].name
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


        