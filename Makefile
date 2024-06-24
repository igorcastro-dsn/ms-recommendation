PROJECT_NAME=ms-recommendation
DOCKER_COMPOSE_FILE=docker-compose.yaml

install:
	yarn install

build:
	yarn build

setup:
    yarn setup

start: build setup docker-up
    NODE_ENV=development yarn start

test: unit-test integ-test

unit-test:
	yarn test:unit

setup-integ-test:
	docker-compose -f docker-compose.integration.yaml up -d

integ-test: setup-integ-test
	yarn test:integration

docker-up:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

docker-down:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

docker-build:
	docker-compose -f $(DOCKER_COMPOSE_FILE) build

migrate:
	yarn typeorm migration:run

clean:
	rm -rf node_modules
	rm -rf bin
