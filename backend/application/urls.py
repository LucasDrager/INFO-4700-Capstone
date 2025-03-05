"""
URL configuration for application project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.http import HttpResponse
from .views import welcome_message, about_message, contact_message, parse_pdf, chat_with_ollama, get_chat_history, summarize_text

def health_check(request):
    return HttpResponse('Backend is running')

urlpatterns = [
    path('', health_check),  # Root URL pattern
    path('api/summarize/', summarize_text),
    path('api/welcome/', welcome_message),
    path('api/about/', about_message),
    path('api/contact/', contact_message),
    path('api/parse-pdf/', parse_pdf),
    path('admin/', admin.site.urls),
    path("api/chat/", chat_with_ollama),
    path('api/chat-history/', get_chat_history),
]
