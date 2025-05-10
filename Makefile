.PHONY: run-dev
run-dev:
	hugo server -D

.PHONY: run-prod
run-prod:
	hugo server

.PHONY: build
build:
	hugo
