from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ChatMessage
from PyPDF2 import PdfReader
import httpx
import ollama
import json
import traceback
import re
import os

def welcome_message(request):
    return JsonResponse({"message": "Welcome to My Website!"})

def about_message(request):
    return JsonResponse({"message": "This is the About Page!"})

def contact_message(request):
    return JsonResponse({"message": "Contact us at support@example.com"})

# Parse PDF
# This works by getting a post request with a pdf file and returning the text extracted from the pdf file.
# 

@csrf_exempt # This is to allow the POST request from the frontend
def parse_pdf(request):
    if request.method == 'POST':
        try:
            if 'pdf_files' not in request.FILES:
                print("No file was uploaded")
                return JsonResponse({"message": "No file was uploaded"}, status=400)

            pdf_files = request.FILES.getlist('pdf_files')
            all_texts = [] # lets add data to this list and return it
            # In the future we are probably going to connect this to the db.
            for pdf_file in pdf_files:
                if not pdf_file.name.endswith('.pdf'):
                    print(f"Invalid file type: {pdf_file.name}")
                    return JsonResponse({"message": "File must be a PDF"}, status=400)

                print(f"Processing file: {pdf_file.name}")
                reader = PdfReader(pdf_file)
                text = ''
                for page in reader.pages:
                    text += page.extract_text()
                all_texts.append(text)
            print("PDFs processed successfully")

            return JsonResponse({"message": "PDFs processed successfully", "texts": all_texts})

        except Exception as e:
            print(f"Error processing PDF: {str(e)}")
            return JsonResponse({"message": f"Error processing PDF: {str(e)}"}, status=500)

    return JsonResponse({"message": "Please upload a PDF file"})

#################################
#     LLM API INFORMATION
#################################
OLLAMA_API_URL = os.environ.get('OLLAMA_APP_API_URL') #USE TO DO INTER-CONTAINER API CALLS

@csrf_exempt
def chat_with_ollama(request): # Makes a call to the LLM
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        data = json.loads(request.body)
        query = data.get("query", "").strip()

        if not query:
            return JsonResponse({"error": "Missing query parameter"}, status=400)

        # Save user message to DB
        ChatMessage.objects.create(sender="user", text=query)

        payload = {"model": "deepseek-r1:14b", "prompt": query, "stream": True}
        print(f"Sending request to Ollama at {OLLAMA_API_URL}/api/generate")
        print(f"Payload: {json.dumps(payload, indent=2)}")

        full_response = ""
        previous_chunk_ends_with_space = True  # Helps ensure proper spacing

        with httpx.stream("POST", f"{OLLAMA_API_URL}/api/generate", json=payload, timeout=600) as response:
            response.raise_for_status()

            for line in response.iter_lines(): # Deep Seek returns infromation in many different "returns" so this handles that.
                if line:
                    try:
                        data = json.loads(line)
                        bot_text = data.get("response", "").strip()

                        # Ensure spacing between streamed responses
                        if not previous_chunk_ends_with_space and not bot_text.startswith(" "):
                            bot_text = " " + bot_text

                        previous_chunk_ends_with_space = bot_text.endswith(" ")

                        full_response += bot_text
                    except json.JSONDecodeError:
                        print("Warning: Skipping malformed JSON chunk:", line)

        # Remove entire "<think>...</think>" sections from the full response
        # Deep seek thinks a lot
        full_response = re.sub(r"<think>.*?</think>", "", full_response, flags=re.DOTALL).strip()

        # Save bot response to DB
        ChatMessage.objects.create(sender="bot", text=full_response)

        return JsonResponse({"response": full_response})

    except httpx.HTTPStatusError as http_err:
        print("Ollama HTTP error:", http_err.response.text)
        return JsonResponse({"error": f"Ollama HTTP error: {http_err.response.text}"}, status=http_err.response.status_code)

#Gets chat history with the bot
def get_chat_history(request):
    messages = ChatMessage.objects.all().order_by("timestamp")
    return JsonResponse({
        "messages": [{"sender": m.sender, "text": m.text} for m in messages]
    })

#################################
#   SECURITY API INFORMATION
#################################
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import UserRegistrationSerializer, CustomTokenObtainPairSerializer

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
class RegisterUserView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer
    
@api_view(['POST'])
def register_user(request):
    serializer = RegisterUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Registration successful!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User


@api_view(["POST"])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(request, username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
            "email": user.email
        })
    else:
        return JsonResponse({"error": "Invalid credentials"}, status=400)

@api_view(["POST"])
def logout_user(request):
    logout(request)
    return JsonResponse({"message": "Logged out successfully"}, status=200)

@api_view(["POST"])
def register_user(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "Username already exists"}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)
    user.save()

    return JsonResponse({"message": "User created successfully"})