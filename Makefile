## up: starts all containers in the background without forcing build
up:
	@echo "Starting Docker images..."
	docker-compose up -d
	@echo "Docker images started!"

## up_build: stops docker-compose (if running), builds all projects and starts docker compose
up_build: 
	@echo "Stopping docker images (if running...)"
	docker-compose down
	@echo "Building (when required) and starting docker images..."
	docker-compose up --build -d
	@echo "Docker images built and started!"

## down: stop docker compose
down:
	@echo "Stopping docker compose..."
	docker-compose down
	@echo "Done!"

## install: install all dependencies
install:
	@echo "Installing dependencies..."
	find . -maxdepth 2 -name package.json -execdir npm i \;
	@echo "Done!"

## logs: show logs from all containers
logs:
	@echo "Showing logs from all containers..."
	docker-compose logs -f
	@echo "Done!"