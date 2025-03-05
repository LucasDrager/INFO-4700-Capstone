# Database specific funtions
from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser, AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings


class ChatMessage(models.Model):
    sender = models.CharField(max_length=10)  # "user" or "bot"
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

# Custom user manager
class ReaderDatabaseManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        user = self.model(username=username, email=email)
        user.set_password(password)  # Ensures hashing
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None):
        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

# Custom user model
class ReaderDatabase(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)  # Map to your predefined `user_id`
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)  # Map to `password_hash` in DB
    created_at = models.DateTimeField(auto_now_add=True)

    objects = ReaderDatabaseManager()

    USERNAME_FIELD = 'email'  # Login with email
    REQUIRED_FIELDS = ['username']

    class Meta:
        db_table = 'ReaderDatabase '  # Map to your existing table
        managed = False  # Django will NOT create or modify this table

    def set_password(self, raw_password):
        from django.contrib.auth.hashers import make_password
        self.password_hash = make_password(raw_password)  # Hash passwords correctly

    def check_password(self, raw_password):
        from django.contrib.auth.hashers import check_password
        return check_password(raw_password, self.password_hash)