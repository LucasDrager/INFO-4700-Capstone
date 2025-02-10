from django.http import JsonResponse

def welcome_message(request):
    return JsonResponse({"message": "Welcome to My Website!"})

def about_message(request):
    return JsonResponse({"message": "This is the About Page!"})

def contact_message(request):
    return JsonResponse({"message": "Contact us at support@example.com"})
