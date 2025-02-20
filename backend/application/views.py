from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PyPDF2 import PdfReader
import httpx
import ollama
import json
import traceback

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

# AI API CALLS
OLLAMA_API_URL = "http://ollama:11434"

@csrf_exempt
def chat_with_ollama(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    try:
        data = json.loads(request.body)
        query = data.get("query", "")

        if not query:
            return JsonResponse({"error": "Missing query parameter"}, status=400)

        payload = {"model": "deepseek-r1:14b", "prompt": query, "stream": True}
        print(f"Sending request to Ollama at {OLLAMA_API_URL}/api/generate")
        print(f"Payload: {json.dumps(payload, indent=2)}")

        with httpx.stream("POST", f"{OLLAMA_API_URL}/api/generate", json=payload, timeout=30) as response:
            response.raise_for_status()
            full_response = ""

            # ✅ Read response line by line (handling streaming JSON)
            for line in response.iter_lines():
                if line:
                    try:
                        data = json.loads(line)
                        full_response += data.get("response", "")
                    except json.JSONDecodeError:
                        print("Warning: Skipping malformed JSON chunk:", line)

        return JsonResponse({"response": full_response})

    except httpx.HTTPStatusError as http_err:
        print("Ollama HTTP error:", http_err.response.text)
        return JsonResponse({"error": f"Ollama HTTP error: {http_err.response.text}"}, status=http_err.response.status_code)

    except Exception as e:
        print("Unexpected Ollama API error:", e)
        traceback.print_exc()
        return JsonResponse({"error": "Failed to contact Ollama"}, status=500)

# @csrf_exempt
# def chat_with_ollama(request):
#     if request.method != "POST":
#         return JsonResponse({"error": "Invalid request method"}, status=400)

#     try:
#         # Parse JSON request body
#         data = json.loads(request.body)
#         query = data.get("query", "")
#         use_web_search = data.get("use_web_search", False)

#         if not query:
#             return JsonResponse({"error": "Missing query parameter"}, status=400)

#         # Optional: Perform a web search and add context
#         context = "No additional context provided."
#         if use_web_search:
#             search_results = search_web(query)
#             context = format_search_results(search_results, max_results=5)

#         # Generate a response from Ollama
#         try:
#             response = ollama.chat(
#                 model="deepseek-r1:14b",
#                 messages=[{"role": "user", "content": f"{context}\n{query}\nAnswer:"}]
#             )
#             ai_response = response.get("message", {}).get("content", "No response received")
#         except Exception as e:
#             print("Ollama API error:", e)
#             return JsonResponse({"error": "Failed to contact Ollama"}, status=500)

#         return JsonResponse({"response": ai_response})

#     except json.JSONDecodeError:
#         return JsonResponse({"error": "Invalid JSON received"}, status=400)
#     except Exception as e:
#         print("Unexpected error:", e)
#         return JsonResponse({"error": "Internal server error"}, status=500)
# @csrf_exempt
# def chat_with_ollama(request):
#     if request.method != "POST":
#         return JsonResponse({"error": "Invalid request method"}, status=400)

#     try:
#         data = json.loads(request.body)
#         query = data.get("query", "")

#         if not query:
#             return JsonResponse({"error": "Missing query parameter"}, status=400)

#         response = httpx.post(
#             f"{OLLAMA_API_URL}/api/generate",
#             json={"model": "deepseek-r1:14b", "prompt": query},
#             timeout=300
#         )

#         response.raise_for_status()
#         response_json = response.json()

#         # ✅ Collect full response text
#         full_response = "".join([msg["response"] for msg in response_json if "response" in msg])

#         return JsonResponse({"response": full_response})

#     except Exception as e:
#         print("Ollama API error:", e)
#         return JsonResponse({"error": "Failed to contact Ollama"}, status=500)

def search_web(query: str):
    """
    Perform a web search using SearXNG and return top search results.
    """
    SEARXNG_URL = "http://localhost:4000/search"
    params = {"q": query, "format": "json"}
    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        response = httpx.get(SEARXNG_URL, params=params, headers=headers, timeout=10)

        if response.status_code == 200:
            return response.json().get("results", [])
        else:
            print(f"Search failed: {response.status_code}")
            return []
    except Exception as e:
        print("Web search error:", e)
        return []

def format_search_results(results, max_results=5):
    """
    Format the top search results into a context string.
    """
    return "\n\n".join(
        [f"Title: {r.get('title', 'No title')}\nURL: {r.get('url', 'No URL')}\nSnippet: {r.get('content', 'No snippet')}" for r in results[:max_results]]
    )