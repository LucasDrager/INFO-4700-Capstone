from django.contrib.auth.models import User
from django.db import models
import hashlib
import os
from datetime import datetime

def hashed_upload_path(instance, filename):
    name, ext = os.path.splitext(filename)
    timestamp = datetime.now().isoformat()
    hash_input = f"{timestamp}_{filename}".encode('utf-8')
    hash_name = hashlib.sha256(hash_input).hexdigest()[:16]  # Shorten the hash
    return f"pdfs/{hash_name}{ext.lower()}"

class ChatMessage(models.Model):
    sender = models.CharField(max_length=10)  # "user" or "bot"
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

class ReaderProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=255, blank=True)
    bio = models.TextField(blank=True)
    stats = models.JSONField(default=dict)

# Storing meta data of file uploads in DB file system handled by django
class File(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="files")
    file_name = models.CharField(max_length=255)
    file = models.FileField(upload_to=hashed_upload_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)

class Annotation(models.Model):
    file = models.ForeignKey(File, on_delete=models.CASCADE, related_name="annotations")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="annotations")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class Chat(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chats")
    started_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    sender = models.CharField(max_length=50)
    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
