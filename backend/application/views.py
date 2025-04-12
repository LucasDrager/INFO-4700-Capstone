###  HEADER IMPORTS  ###
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
###  SYSTEM IMPORTS  ###
from transformers import pipeline
import httpx
import ollama
import json
import traceback
import re
import os
###  SECURITY IMPORTS  ###
#JWT
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
#REST
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
#AUTH
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
#SERIAL
from .serializers import UserRegistrationSerializer, CustomTokenObtainPairSerializer
from application.serializers import UserRegistrationSerializer
###  API IMPORTS ###
from PyPDF2 import PdfReader
from application.models import Chat, Message, File
### DATABASE IMPORTS ###
from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import FileUploadSerializer

### INITIALIZATION ###
# Initialize the summarization pipeline with a specific model
summarizer = pipeline("summarization")

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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_pdf(request):
    print("UPLOAD_PDF VIEW HAS BEEN CALLED")
    serializer = FileUploadSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_pdfs(request):
    files = File.objects.all()
    serializer = FileUploadSerializer(files, many=True)
    return Response(serializer.data)

#################################
#     LLM API INFORMATION
#################################
OLLAMA_API_URL = os.environ.get('OLLAMA_APP_API_URL')  # API URL for inter-container calls

@csrf_exempt
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def chat_with_ollama(request):  
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        user = request.user  # Get the logged-in user
        data = json.loads(request.body)
        query = data.get("query", "").strip()

        if not query:
            return JsonResponse({"error": "Missing query parameter"}, status=400)

        # **Step 1: Find or Create a Chat Session for the User**
        chat, created = Chat.objects.get_or_create(user=user)  

        # **Step 2: Save User's Message in `messages` table**
        user_message = Message.objects.create(
            chat=chat,  
            sender=user.username,  # Use the username for sender field
            content=query,  
            sent_at=timezone.now()
        )

        # **Step 3: Call the Ollama API**
        payload = {"model": "deepseek-r1:14b", "prompt": query, "stream": True}
        print(f"Sending request to Ollama at {OLLAMA_API_URL}/api/generate")
        print(f"Payload: {json.dumps(payload, indent=2)}")

        full_response = ""
        previous_chunk_ends_with_space = True  # Ensures proper spacing

        with httpx.stream("POST", f"{OLLAMA_API_URL}/api/generate", json=payload, timeout=600) as response:
            response.raise_for_status()

            for line in response.iter_lines():  
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

        # Remove AI "thinking" sections
        full_response = re.sub(r"<think>.*?</think>", "", full_response, flags=re.DOTALL).strip()

        # **Step 4: Save AI Response in `messages` table**
        bot_message = Message.objects.create(
            chat=chat,  
            sender="bot",  
            content=full_response,  
            sent_at=timezone.now()
        )

        return JsonResponse({"response": full_response})

    except httpx.HTTPStatusError as http_err:
        print("Ollama HTTP error:", http_err.response.text)
        return JsonResponse({"error": f"Ollama HTTP error: {http_err.response.text}"}, status=http_err.response.status_code)


# Get chat history for the logged-in user
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_chat_history(request):
    user = request.user  
    chat = Chat.objects.filter(user=user).first()  # Get user's chat
    if not chat:
        return JsonResponse({"messages": []})  # No chat history

    messages = Message.objects.filter(chat=chat).order_by("sent_at")  # Fetch messages
    return JsonResponse({
        "messages": [{"sender": m.sender, "text": m.content, "sent_at": m.sent_at} for m in messages]
    })
    
    
# Text summarization endpoint
@csrf_exempt
def summarize_text(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        data = json.loads(request.body)
        text = data.get('text', '')
        
        if not text:
            return JsonResponse({'error': 'No text provided'}, status=400)

        # Use BART model for summarization
        summary = summarizer(text, max_length=130, min_length=30, do_sample=False)
        
        return JsonResponse({
            'summary': summary[0]['summary_text']
        })
    except Exception as e:
        print(f"Error in summarize_text: {str(e)}")
        traceback.print_exc()
        return JsonResponse({'error': str(e)}, status=500)
    
#################################
#   SECURITY API INFORMATION
#################################
User = get_user_model()
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
class RegisterUserView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

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

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anyone to register
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
