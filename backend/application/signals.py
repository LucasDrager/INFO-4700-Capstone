# Application signals
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Chat, Message

@receiver(post_save, sender=User)
def create_user_chat(sender, instance, created, **kwargs):
    if created:
        # Create the chat
        chat = Chat.objects.create(user=instance)
        
        # Create the welcome message
        Message.objects.create(
            chat=chat,
            sender="bot",
            content="Welcome to Lectern! How can I assist you today?"
        )
