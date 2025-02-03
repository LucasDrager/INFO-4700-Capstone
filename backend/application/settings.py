# Example DB config using environment variables (in a real project, use .env and a config library)
import os

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB'),
        'USER': os.environ.get('POSTGRES_USER'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
        'HOST': os.environ.get('POSTGRES_HOST', 'db'),  # 'db' is our service name in docker-compose
        'PORT': '5432',
    }
}

# For local dev, you might allow all hosts for simplicity
ALLOWED_HOSTS = ['*']
