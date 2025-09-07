# Mongoose Setup Documentation

## Overview
This document describes the Mongoose integration implemented in the NestJS clean architecture project for ActivityLogs.

## Installed Packages
- `mongoose`: MongoDB object modeling for Node.js
- `@nestjs/mongoose`: NestJS integration for Mongoose
- `@nestjs/config`: Configuration management for NestJS

## Project Structure

### Infrastructure Layer (`src/infrastructure/orm/mongoose/`)

1. **Database Configuration** (`database.config.ts`)
   - Configures MongoDB connection URI
   - Default: `mongodb://localhost:27017/activitylogs`
   - Can be overridden via `DATABASE_URI` environment variable

2. **Database Module** (`mongoose.module.ts`)
   - Main MongoDB connection module
   - Registers ActivityLog schema
   - Exports ActivityLogRepository

3. **Base Repository** (`base-mongoose.repository.ts`)
   - Concrete class implementing `IBaseRepository<TEntity, TId>`
   - Uses mapper pattern for entity/document conversion
   - Provides common MongoDB operations
   - Converts domain specifications to MongoDB queries
   - Handles pagination, sorting, and complex queries

4. **ActivityLog Schema** (`schemas/activitylog.schema.ts`)
   - Defines MongoDB schema for ActivityLog
   - Includes indexes for performance optimization
   - Uses camelCase field naming convention

5. **ActivityLog Mapper** (`mappers/activitylog.mapper.ts`)
   - Handles entity/document mapping
   - Implements IBaseMapper interface for ActivityLog entity

### Application Layer Updates

1. **Use Case** (`src/application/use-cases/add-activitylog.usecase.ts`)
   - Injectable service for adding activity logs
   - Uses dependency injection with `IActivityLogRepository`

2. **App Module** (`src/app.module.ts`)
   - Configures NestJS application
   - Imports DatabaseModule
   - Registers services and controllers

3. **Controller** (`src/interface/http/controllers/activitylogs.controller.ts`)
   - RESTful API endpoints for activity logs
   - POST endpoint for creating activity logs
   - GET endpoint for retrieving activity logs

## Environment Configuration

Create a `.env` file in the project root:
```env
DATABASE_URI=mongodb://localhost:27017/activitylogs
PORT=3000
```

## Features Implemented

### Base Repository Features
- **CRUD Operations**: Create, Read, Update, Delete
- **Batch Operations**: CreateMany, UpdateMany, DeleteMany
- **Specification Pattern**: Complex queries using domain specifications
- **Pagination**: Page-based and offset-based pagination
- **Sorting**: Multi-field sorting support
- **Search**: Text search across multiple fields
- **Filtering**: Complex filtering with various operators

### MongoDB Query Translation
The base repository translates domain specifications to MongoDB queries:
- `whereEqual` → `{ field: value }`
- `whereGreaterThan` → `{ field: { $gt: value } }`
- `whereContains` → `{ field: { $regex: /value/i } }`
- `whereIn` → `{ field: { $in: values } }`
- And many more...

## Usage Example

```typescript
// In a service or controller
const spec = new BaseSpecification<ActivityLog>()
  .whereEqual('entityType', 'user')
  .whereGreaterThan('createdAt', new Date('2024-01-01'))
  .orderByField('createdAt', 'desc')
  .paginate({ page: 1, limit: 10 });

const results = await activityLogRepository.list(spec);
```

## API Endpoints

- `POST /activity-logs` - Create a new activity log
- `GET /activity-logs` - Retrieve activity logs (with query parameters)

## Next Steps

1. **Authentication/Authorization**: Add JWT authentication and role-based access control
2. **Advanced Queries**: Implement more complex query builders
3. **Caching**: Add Redis caching layer
4. **Enhanced Validation**: Extend current class-validator implementation
5. **Documentation**: Add Swagger API documentation
6. **Testing**: Add unit and integration tests

## Database Schema

The ActivityLog collection includes the following fields:
- `action`: String enum (POST, PUT, DELETE)
- `entityType`: String (user, beat, influencer, brand)
- `entityId`: String
- `fieldKey`: Mixed (any type, optional)
- `fieldValueBefore`: Mixed (any type, optional)
- `fieldValueAfter`: Mixed (any type, optional)
- `createdById`: String
- `createdByName`: String
- `createdAt`: Date (auto-generated)

Indexes are created on:
- `entityType` and `entityId` (compound index)
- `createdAt` (descending)
- `createdById`
