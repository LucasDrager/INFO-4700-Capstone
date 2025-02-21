from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PyPDF2 import PdfReader

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
