# NOTE: This Makefile is intended to be run using a Unix-style shell.
# Windows users should run it from Git Bash or WSL.

# Detect OS
ifeq ($(OS),Windows_NT)
    CHECK_CMD = command -v $(1) >/dev/null 2>&1 || (echo "$(2) not found" && exit 1)
    SHELL_CD = cd
    SHELL_AND = &&
    RM = rm -rf
    CP = cp -r
    MKDIR = mkdir -p
else
    SHELL := /bin/bash
    CHECK_CMD = command -v $(1) >/dev/null 2>&1 || (echo "$(2) not found" && exit 1)
    SHELL_CD = cd
    SHELL_AND = &&
    RM = rm -rf
    CP = cp -r
    MKDIR = mkdir -p
endif

# Variables
DOCKER_COMPOSE := docker compose
SERVICES_DIR := services

# Colors for terminal output (Windows compatible)
GREEN := \033[0;32m
NC := \033[0m

.PHONY: setup dev test build clean logs new-service help

# Default target
help:
	@echo "Available commands:"
	@echo "  setup        - Initial project setup"
	@echo "  start-db     - Start development Database"
	@echo "  db-setup     - Run Database Migration"
	@echo "  db-seed      - Seed Database with initial data"
	@echo "  dev          - Start development environment"
	@echo "  test         - Run all tests"
	@echo "  build        - Build all services"
	@echo "  clean        - Clean up development environment"
	@echo "  logs         - View service logs"

# Setup project
setup: check-prereqs create-env start-db install-deps db-setup db-seed
	@echo "${GREEN}Setup complete! Run 'make dev' to start the development environment${NC}"

# Check prerequisites
check-prereqs:
	@echo "Checking prerequisites..."
	@$(call CHECK_CMD,docker,Docker)
	@$(call CHECK_CMD,docker-compose,Docker Compose)
	@$(call CHECK_CMD,node,Node.js)

# Create environment files
create-env:
	@echo "Creating environment files..."
	@for service in $(SERVICES_DIR)/*; do \
		if [ -f $$service/.env.example ]; then \
			cp $$service/.env.example $$service/.env; \
			echo "Created .env for $$(basename $$service)"; \
		fi; \
	done

# Start database containers
start-db:
	@echo "Starting database containers..."
	@$(DOCKER_COMPOSE) up -d db

# Install dependencies
install-deps:
	@echo "Installing dependencies..."
	@npm install
	@for service in $(SERVICES_DIR)/*; do \
		if [ -f $$service/package.json ]; then \
			echo "Installing dependencies for $$(basename $$service)..."; \
			cd $$service && npm install && cd ../..; \
		fi; \
	done

# Setup databases
db-setup:
	@echo "Setting up databases..."
	@for service in $(SERVICES_DIR)/*; do \
		if [ -d $$service/app/migrations ]; then \
			echo "Setting up database for $$(basename $$service)..."; \
			cd $$service && \
			npm run migration:run || echo "Migrations failed for $$(basename $$service) but continuing..." && \
			cd ../..; \
		fi; \
	done

# Seed databases for new services (Run once, if any failed, run for the indivdual service that failed)
db-seed:
	@echo "Seeding databases..."
	@for service in $(SERVICES_DIR)/*; do \
		if [ -d $$service/app/seeders ]; then \
			echo "Seeding data for $$(basename $$service)..."; \
			cd $$service && \
			npx ts-node -r dotenv/config app/seeders/run-seeders.ts && \
			cd ../..; \
		fi; \
	done
# Create database for new service
create-db:
	@read -p "Enter the new database name (Service Name): " dbname; \
	dbname=litf-db-$$dbname; \
	echo "Creating database $$dbname..."; \
	docker exec -i litf-db psql -U root -c "CREATE DATABASE \"$$dbname\";"

# Start development environment
dev:
	@echo "Starting development environment..."
	@npm run dev

#Create Migration
create-migration:
	@read -p "Enter the service name (e.g., user-service): " service_name; \
	read -p "Enter the migration name: " migration_name; \
	cd services/$$service_name && npm run typeorm migration:generate app/migrations/$$migration_name -- -d app/config/typeorm.config.ts


# Run tests
test:
	@echo "Running tests..."
	@for service in $(SERVICES_DIR)/*; do \
		if [ -f $$service/package.json ]; then \
			echo "Testing $$(basename $$service)..."; \
			cd $$service && npm test && cd ../..; \
		fi; \
	done

# Build services
build:
	@echo "Building services..."
	@for service in $(SERVICES_DIR)/*; do \
		if [ -f $$service/package.json ]; then \
			echo "Building $$(basename $$service)..."; \
			cd $$service && npm run build && cd ../..; \
		fi; \
	done

# Clean up
clean:
	@echo "Cleaning up..."
	@$(DOCKER_COMPOSE) down -v
	@find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
	@find . -name ".env" -type f -delete
	@find . -name "dist" -type d -prune -exec rm -rf '{}' +
	@find . -name "build" -type d -prune -exec rm -rf '{}' +

# View logs
logs:
	@if [ "$(service)" ]; then \
		$(DOCKER_COMPOSE) logs -f $(service); \
	else \
		$(DOCKER_COMPOSE) logs -f; \
	fi
