all:


test:	build tester

tester:
	docker-compose up tester

dev:
	docker-compose run --rm tester bash

lint:
	docker-compose run --rm --no-dep tester yarn lint

build:
	docker-compose build

clean:
	docker-compose down


export DOCKER_BUILDKIT = 1
export COMPOSE_DOCKER_CLI_BUILD = 1
