FROM python:3.10-slim

# Set a working directory
WORKDIR /app

# Copy only the requirements first, to leverage Docker cache
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . /app

EXPOSE 8000

# Default command will be overridden by docker-compose "command"
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
