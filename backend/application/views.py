from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PyPDF2 import PdfReader

def welcome_message(request):
    return JsonResponse({"message": "Welcome to My Website!"})

def about_message(request):
    return JsonResponse({"message": "This is the About Page!"})

def contact_message(request):
    return JsonResponse({"message": "Contact us at support@example.com"})

@csrf_exempt # This is to allow the POST request from the frontend
def parse_pdf(request):
    if request.method == 'POST':
        try:
            if 'pdf_file' not in request.FILES:
                print("No file was uploaded")
                return JsonResponse({"message": "No file was uploaded"}, status=400)

            pdf_file = request.FILES['pdf_file']
            if not pdf_file.name.endswith('.pdf'):
                print(f"Invalid file type: {pdf_file.name}")
                return JsonResponse({"message": "File must be a PDF"}, status=400)

            print(f"Processing file: {pdf_file.name}")
            reader = PdfReader(pdf_file)
            text = ''
            for page in reader.pages:
                text += page.extract_text()
            print("PDF processed successfully")
            return JsonResponse({"message": text})

        except Exception as e:
            print(f"Error processing PDF: {str(e)}")
            return JsonResponse({"message": f"Error processing PDF: {str(e)}"}, status=500)

    return JsonResponse({"message": "Please upload a PDF file"})
