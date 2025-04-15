# Makefile for Dockerized Django Application
# This Makefile provides commands to manage the Docker containers for the Django application.
start:
	docker-compose up -d --build
stop:
	docker-compose down
Tear-down-stop:
	docker-compose down -v
	find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
Tear-down-start:
	docker-compose down -v
	find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
	docker-compose up -d --build
	docker-compose exec backend python manage.py makemigrations
	docker-compose exec backend python manage.py migrate --fake-initial
restart:
	docker-compose up -d --build
	docker-compose exec backend python manage.py makemigrations
	docker-compose exec backend python manage.py migrate --fake-initial