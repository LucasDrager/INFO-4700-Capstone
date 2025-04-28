# ──────────────────────────────────────────────────────────────
#  Makefile — portable (Windows / macOS / Linux) launcher
# ──────────────────────────────────────────────────────────────
# targets:
#   make start        → build + up + Django migrations
#   make stop         → compose down
#   make restart      → down + up + migrations
#   make teardown     → compose down -v
#   make migrations   → run makemigrations + migrate
#   make clean-migrations → wipe *.py INSIDE container, rebuild, migrate
# --------------------------------------------------------------------------

# 0. ─────────────────────────── GPU detection — host‑agnostic ─────────────
ifeq ($(OS),Windows_NT)
  DETECT := $(shell pwsh -NoLogo -NoProfile -ExecutionPolicy Bypass -File scripts\\detect_gpu.ps1)
else
  DETECT := $(shell scripts/detect_gpu.sh)
endif

BASE = docker-compose.yml                      # always loaded

# choose overlay file based on $(DETECT)
ifeq ($(DETECT),nvidia)
  OVERLAY = -f docker-compose.nvidia.yml
else ifeq ($(DETECT),amd)
  OVERLAY = -f docker-compose.amd.yml
else ifeq ($(DETECT),intel)
  OVERLAY = -f docker-compose.intel.yml
else
  OVERLAY =
endif

COMPOSE = docker compose -f $(BASE) $(OVERLAY)

# helper macro to run manage.py commands
define manage
	$(COMPOSE) exec backend python manage.py $(1)
endef

# 1. ─────────────────────────── primary targets ───────────────────────────
.PHONY: start stop restart teardown migrations clean-migrations

## bring everything up, then run migrations
start:
	$(COMPOSE) up -d --build
	$(call manage,makemigrations)
	$(call manage,migrate --fake-initial)

## graceful stop (keep volumes)
stop:
	$(COMPOSE) down

## rebuild + migrations
restart:
	$(COMPOSE) down
	$(COMPOSE) up -d --build
	$(call manage,makemigrations)
	$(call manage,migrate --fake-initial)

## drop volumes (DB etc.)
teardown:
	$(COMPOSE) down -v

## manual migrations
migrations:
	$(call manage,makemigrations)
	$(call manage,migrate --fake-initial)

## wipe generated Django migration files **inside** a temp container
clean-migrations:
	# delete all migration *.py **inside** backend image
	$(COMPOSE) run --rm backend sh -c "find /app -path '*/migrations/*.py' ! -name '__init__.py' -delete"
	$(COMPOSE) down -v
	$(COMPOSE) up -d --build
	$(call manage,makemigrations)
	$(call manage,migrate --fake-initial)
