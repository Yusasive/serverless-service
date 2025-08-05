# LIFT 2025 - LCCI Project

A microservices-based project that provides authentication and user management capabilities.

## Project Structure

```
litf-2025/
├── services/          # Directory containing all microservices
│   ├── auth-service/  # Authentication and authorization service
│   └── user-service/  # User management service
├── scripts/          # Helper scripts for development and deployment
├── Makefile          # Project automation and setup commands
├── docker-compose.yml # Local development database container configuration
└── README.md         # Project documentation
```

## Prerequisites

Before you begin, ensure you have the following installed:
- Make (for running setup commands)
- Docker and Docker Compose
- Git

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/lamydas/LITF-2025.git
cd litf-2025
```

2. Run the initial setup:
```bash
make setup
```

This command will:
- Create necessary Docker containers
- Set up environment files
- Initialize databases
- Install dependencies for all services

3. Start the development environment:

   Option 1: Run all services in one terminal:
   ```bash
   make dev
   ```

   Option 2: Run services individually in separate terminals:
   ```bash
   # Terminal 1 - Auth Service
   cd services/auth-service
   npm run dev

   # Terminal 2 - User Service
   cd services/user-service
   npm run dev

   # Terminal 3 - Admin UI Service
   cd services/admin-ui-service
   npm run start
   ```

   Running services individually gives you clearer logs and more control over each service.

## Available Make Commands

| Command | Description |
|---------|-------------|
| `make setup` | Quick Initial project setup, This included development environment setup required |
| `make start-db` | Start development Database |
| `make db-setup` | Run Database Migration |
| `make db-seed` | Seed Database with initial data |
| `make dev` | Start development environment |
| `make test` | Run all tests |
| `make build` | Build all services |
| `make clean` | Clean up development environment |
| `make logs` | View service logs |


## Service Configuration

Each service requires specific environment variables for proper operation. Example configurations can be found in each service's `.env.example` file.


## Adding New Services

1. Create a new service directory in `services/`:
- Add controller, routes, models, and service-specific logic here

2. Follow the generated service template and update:
- Environment variables, copy other service `.env.example` and update accordingly
- Database schema (if required) in migrations directory

3. Adding new service database
- Make sure your service .env contains database credentials for example
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=litf-db-<service-name>
DB_USER=root
DB_PASSWORD=root
NODE_ENV=development
```

4. Create a database json file for migration purpose (database.json) for example
Example: services/<service-name>/database.json
```bash
{
  "dev": {
    "driver": "pg",
    "host": "localhost",
    "port": "5432",
    "database": "litf-db-<service-name>",
    "user": "root",
    "password": "root",
    "schema": "public"
  }
}
```

5. Create new service database with
```bash
make create-db
```

6. Update `init-db/init-multiple-dbs.sq` folder for subsequent developers to have it created during setup

## Adding New Database Migration
1. Use the following command to create migartion
```bash
make create-migration
```

2. Follow the instruction to add the service you are making migartion for and add a migration name

3. Update teh SQL command to create and undo the database changes you need in the up and down version of the sql migration file

3. Apply migration to db with
```bash
make db-setup
```

## Troubleshooting

If you encounter issues:

1. Clean the environment:
```bash
make clean
```

2. Rebuild from scratch:
```bash
make setup
```

3. Check service logs:
```bash
make logs service=service-name
```

## Contributing

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and ensure all tests pass:
```bash
make test
```

3. Commit your changes
```bash
git commit -m 'Add some amazing feature'
```

4. Push to the branch
```bash
git push origin feature/amazing-feature
```

5. Submit a pull request with a clear description of your changes.

### Pull Request Template

When submitting a pull request, please use the following template:

```markdown
## Description
[Provide a brief description of the changes introduced by this PR]

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] This change requires a documentation update

## How Has This Been Tested?
[Describe the tests that you ran to verify your changes]

1. Test A
2. Test B

## Checklist:
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules

## Related Issues
[Link any related issues here using #issue-number]
```

### Example PR Description

```markdown
## Description
Added email notification feature for user registration process

## Type of Change
- [x] New feature (non-breaking change which adds functionality)

## How Has This Been Tested?
1. Unit tests for email service
2. Integration tests with auth service
3. Manual testing with different email providers

## Checklist:
- [x] My code follows the style guidelines of this project
- [x] I have performed a self-review of my own code
- [x] I have added tests that prove my feature works
- [x] All tests pass locally

## Related Issues
Closes #123
```