# Clean Architecture Implementation

## Overview

This project now follows proper Clean Architecture principles with clear separation of concerns across different layers.

## Architecture Layers

### 1. App Layer (`src/app.module.ts`)

**Purpose**: Composition Root

- **Responsibility**: Wire together all dependencies and modules
- **Dependencies**: Only imports other layer modules
- **Key Files**:
  - `app.module.ts` - Main application module and dependency injection root

### 2. Interface Layer (`src/interface/`)

**Purpose**: External Interfaces (HTTP, Controllers, DTOs)

- **Responsibility**: Handle incoming requests and outgoing responses
- **Dependencies**: Application layer (use cases)
- **Key Files**:
  - `interface.module.ts` - Interface layer module
  - `http/controllers/` - HTTP controllers
  - `decorators/` - Custom decorators

### 3. Application Layer (`src/application/`)

**Purpose**: Business Logic and Use Cases

- **Responsibility**: Orchestrate business operations and enforce business rules
- **Dependencies**: Domain layer entities and repository interfaces
- **Key Files**:
  - `application.module.ts` - Application layer module
  - `use-cases/` - Business use cases
  - `common/` - Shared application utilities

### 4. Domain Layer (`src/domain/`)

**Purpose**: Core Business Entities and Rules

- **Responsibility**: Define entities, repository interfaces, business specifications, and enums
- **Dependencies**: None (pure business logic)
- **Key Files**:
  - `entities/` - Business entities with ActionType enum
  - `repos/` - Repository interfaces and specifications

### 5. Infrastructure Layer (`src/infrastructure/`)

**Purpose**: External Concerns (Database, External APIs, File System)

- **Responsibility**: Implement repository interfaces and handle data persistence
- **Dependencies**: Domain layer interfaces
- **Key Files**:
  - `infrastructure.module.ts` - Infrastructure layer module
  - `orm/mongoose/` - MongoDB implementation with mappers

## Module Structure

```
src/
├── main.ts                          # Application entry point
├── app.module.ts                    # Composition root
├── interface/
│   ├── interface.module.ts          # Interface layer module
│   ├── http/controllers/            # HTTP controllers
│   ├── validation/                  # DTOs with validation decorators
│   └── decorators/                  # Custom decorators
├── application/
│   ├── application.module.ts        # Application layer module
│   ├── use-cases/                   # Business use cases
│   ├── dto/                         # Internal DTOs
│   └── common/                      # Shared utilities
├── domain/
│   ├── entities/                    # Business entities
│   └── repos/                       # Repository interfaces
└── infrastructure/
    ├── infrastructure.module.ts     # Infrastructure layer module
    └── orm/mongoose/                # MongoDB implementation
        ├── base-mongoose.repository.ts
        ├── mappers/                 # Entity/Document mappers
        └── schemas/                 # MongoDB schemas
```

## Dependency Flow

```
AppModule
├── InfrastructureModule
├── InterfaceModule
    └── ApplicationModule
```

## Key Principles Followed

### 1. Dependency Inversion

- Higher-level modules don't depend on lower-level modules
- Both depend on abstractions (interfaces)
- Infrastructure implements domain interfaces

### 2. Single Responsibility

- Each module has a single, well-defined purpose
- Controllers handle HTTP concerns only
- Use cases handle business logic only
- Repositories handle data persistence only

### 3. Open/Closed Principle

- Open for extension, closed for modification
- New entities can be added by creating new mappers
- New use cases can be added without changing existing code

### 4. Interface Segregation

- Clients depend only on methods they use
- Repository interfaces are specific to entity needs
- Mapper interfaces are minimal and focused

## Benefits of This Structure

### ✅ **Testability**

- Each layer can be tested independently
- Easy to mock dependencies
- Clear boundaries for unit tests

### ✅ **Maintainability**

- Clear separation of concerns
- Changes in one layer don't affect others
- Easy to locate and modify functionality

### ✅ **Scalability**

- New features can be added without affecting existing code
- Easy to add new entities, use cases, or controllers
- Clear patterns to follow for new development

### ✅ **Flexibility**

- Can swap out implementations (e.g., MongoDB → PostgreSQL)
- Can add new interfaces (e.g., GraphQL alongside REST)
- Framework-agnostic business logic

## Adding New Features

### Adding a New Entity (e.g., `User`)

1. **Domain Layer**:

   ```typescript
   // src/domain/entities/user.ts
   export class User { ... }
   ```

2. **Infrastructure Layer**:

   ```typescript
   // src/infrastructure/orm/mongoose/schemas/user.schema.ts
   export const UserSchema = new Schema({ ... });

   // src/infrastructure/orm/mongoose/mappers/user.mapper.ts
   export class UserMapper implements IBaseMapper<User, UserDocument> { ... }
   ```

3. **Application Layer**:

   ```typescript
   // src/application/use-cases/create-user.usecase.ts
   export class CreateUserUseCase { ... }
   ```

4. **Interface Layer**:

   ```typescript
   // src/interface/http/controllers/users.controller.ts
   export class UsersController { ... }
   ```

5. **Update Modules**: Register new dependencies in respective modules

## Best Practices

1. **Keep Domain Pure**: No external dependencies in domain layer
2. **Interface Abstractions**: Always program to interfaces, not implementations
3. **Minimal Controllers**: Controllers should only handle HTTP concerns
4. **Rich Use Cases**: Business logic lives in use cases, not controllers
5. **Mapper Separation**: Keep entity/document mapping separate from business logic
6. **Module Organization**: Each layer should have its own module for clear boundaries

## Testing Strategy

- **Unit Tests**: Test each layer independently with mocked dependencies
- **Integration Tests**: Test layer interactions with real implementations
- **E2E Tests**: Test complete user flows through all layers
- **Repository Tests**: Test mappers and database operations separately
