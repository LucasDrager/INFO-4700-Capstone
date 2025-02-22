# Database specific funtions
from django.db import models

class ChatMessage(models.Model):
    sender = models.CharField(max_length=10)  # "user" or "bot"
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
