
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