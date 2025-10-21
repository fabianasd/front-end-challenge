
build:
	docker compose build
	
down:
	docker compose down webvue

up: down
	docker-compose up -d

login:
	docker-compose run -w /application webvue /bin/bash

logs: 
	docker compose logs webvue --tail=10 -f

run-all: down build down up logs 

# Comando para rodar localmente em modo watch 
DEV_FILES=-f docker-compose.yml -f docker-compose.dev.yml

dev-up:
	docker compose $(DEV_FILES) up -d --build

dev-down:
	docker compose $(DEV_FILES) down

dev-logs:
	docker compose $(DEV_FILES) logs -f webvue

dev: dev-down dev-up dev-logs
