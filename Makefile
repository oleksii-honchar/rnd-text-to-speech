SHELL=/bin/bash
RED=\033[0;31m
GREEN=\033[0;32m
BG_GREY=\033[48;5;237m
YELLOW=\033[38;5;202m
BOLD_ON=\033[1m
BOLD_OFF=\033[21m
NC=\033[0m # No Color

ifneq (,$(wildcard ./.env))
	include ./.env
endif

IMAGE_VERSION := $(shell jq -r '.version' package.json)
IMAGE_NAME := $(shell jq -r '.name' package.json)

.PHONY: help

help:
	@echo Automation commands:
	@echo
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

check-node-env:
ifndef NODE_ENV
	@printf "${YELLOW}NODE_ENV not provided. Using ${BOLD_ON}'NODE_ENV=development'${BOLD_OFF} as default${NC}\n"
  export NODE_ENV = development
endif

# used for multi-platform builds
create-docker-container-builder:
	@docker buildx create --use --name docker-container --driver docker-container
	@docker buildx inspect docker-container --bootstrap

docker-build: check-node-env ## build docker image
	docker build --load -f ./Dockerfile --build-arg IMAGE_VERSION=$(IMAGE_VERSION) --build-arg IMAGE_NAME=$(IMAGE_NAME) -t $(DOCKERHUB_USERNAME)/$(IMAGE_NAME):$(IMAGE_VERSION) .

docker-build-n-push: check-node-env ## build docker image
	docker buildx build --builder docker-container --platform linux/amd64,linux/arm64 --push -f ./Dockerfile --build-arg IMAGE_VERSION=$(IMAGE_VERSION) --build-arg IMAGE_NAME=$(IMAGE_NAME) -t $(DOCKERHUB_USERNAME)/$(IMAGE_NAME):$(IMAGE_VERSION) -t $(DOCKERHUB_USERNAME)/$(IMAGE_NAME):latest .

docker-push: ## push latest image to docker hub of <type>
	@docker push $(DOCKERHUB_USERNAME)/$(IMAGE_NAME):$(IMAGE_VERSION)
	@docker push $(DOCKERHUB_USERNAME)/$(IMAGE_NAME):latest

docker-run: check-node-env ## build docker image
	docker run --rm -p 9000:9000 $(DOCKERHUB_USERNAME)/$(IMAGE_NAME):$(IMAGE_VERSION)

docker-tag-latest: ## tag image as latest
	@docker tag $(DOCKERHUB_USERNAME)/$(IMAGE_NAME):$(IMAGE_VERSION) $(DOCKERHUB_USERNAME)/$(IMAGE_NAME):latest

logs-restart: ## restart logs stack
	@docker compose -f ./ops/grafana-logs/docker-compose.logs.yaml down
	@docker compose -f ./ops/grafana-logs/docker-compose.logs.yaml up -d

logs-stop: ## stop logs stack
	@docker compose -f ./ops/grafana-logs/docker-compose.logs.yaml down

logs-logs: ## display logs from logs stack
	@docker compose -f ./ops/grafana-logs/docker-compose.logs.yaml logs -f

release-please-debug: ## debug release-please config
	@release-please release-pr \
		--token=${GITHUB_TOKEN} \
		--repo-url=oleksii-honchar/fastify-tmpl \
		--debug \
		--dry-run