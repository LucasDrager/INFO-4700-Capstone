FROM python:3.10-slim

# Set a working directory
WORKDIR /app

# Copy only the requirements first, to leverage Docker cache
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . /app

EXPOSE 8000

# Run migrations before starting the server
CMD ["sh", "-c", "python manage.py migrate || (echo 'Migration failed!' && exit 1); python manage.py runserver 0.0.0.0:8000"]
