# Mapper-Based Repository Architecture

## Overview
This document describes the refactored repository architecture using the mapper pattern instead of concrete repository implementations per entity.

## Architecture Changes

### Before (Concrete Repository per Entity)
```
base-mongoose.repository.ts (abstract)
└── repositories/
    └── activitylog.repository.ts (concrete implementation)
```

### After (Mapper-Based Architecture)
```
base-mongoose.repository.ts (concrete, uses mappers)
└── mappers/
    ├── base.mapper.interface.ts
    └── activitylog.mapper.ts
```

## Benefits

1. **DRY Principle**: No need to create repository classes for each entity
2. **Separation of Concerns**: Mapping logic is isolated in dedicated mapper classes
3. **Reusability**: One base repository handles all entities
4. **Maintainability**: Changes to repository logic only need to be made in one place
5. **Testability**: Mappers can be tested independently

## Implementation Details

### Base Mapper Interface (`base.mapper.interface.ts`)
```typescript
export interface IBaseMapper<TEntity, TDocument extends Document> {
  toEntity(document: TDocument): TEntity;
  toDocument(entity: TEntity): Partial<TDocument>;
  extractId(entity: TEntity): string;
}
```

### Entity Mapper Implementation
Each entity has a dedicated mapper that implements the base interface:
- `ActivityLogMapper` handles ActivityLog ↔ ActivityLogDocument mapping

### Base Repository Usage
The `BaseMongooseRepository` is now a concrete class that accepts:
- A Mongoose model
- A mapper implementation

### Dependency Injection Configuration
```typescript
{
  provide: 'IActivityLogRepository',
  useFactory: (model: Model<ActivityLogDocument>, mapper: ActivityLogMapper) => {
    return new BaseMongooseRepository<ActivityLog, string, ActivityLogDocument>(
      model,
      mapper
    );
  },
  inject: [getModelToken('ActivityLog'), ActivityLogMapper],
}
```

## Directory Structure
```
src/infrastructure/orm/mongoose/
├── base-mongoose.repository.ts      # Generic repository implementation
├── database.config.ts               # Database configuration
├── mongoose.module.ts               # NestJS module setup
├── mappers/
│   ├── base.mapper.interface.ts     # Mapper contract
│   └── activitylog.mapper.ts        # ActivityLog entity mapper
└── schemas/
    └── activitylog.schema.ts         # MongoDB schema definition
```

## Adding New Entities

To add a new entity (e.g., `User`):

1. **Create Schema**: `schemas/user.schema.ts`
2. **Create Mapper**: `mappers/user.mapper.ts`
3. **Register in Module**: Add to `mongoose.module.ts`
4. **Use Repository**: Inject as `IUserRepository`

No need to create a concrete repository class!

## Usage Example

```typescript
// In a service
constructor(
  @Inject('IActivityLogRepository')
  private readonly activityLogRepository: IBaseRepository<ActivityLog, string>
) {}

// All repository methods are available
await this.activityLogRepository.create(activityLog);
await this.activityLogRepository.findMany(specification);
await this.activityLogRepository.list(specification);
```

## Mapper Responsibilities

### Entity to Document (`toDocument`)
- Remove or transform entity-specific fields (like `id`)
- Prepare data for MongoDB storage
- Handle nested object transformations

### Document to Entity (`toEntity`)
- Convert MongoDB `_id` to entity `id`
- Transform database-specific fields to domain model
- Ensure proper typing and structure

### ID Extraction (`extractId`)
- Extract identifier from entity for update/delete operations
- Handle different ID formats (string, ObjectId, etc.)

## Testing Strategy

### Mapper Testing
```typescript
describe('ActivityLogMapper', () => {
  it('should map document to entity', () => {
    // Test toEntity method
  });
  
  it('should map entity to document', () => {
    // Test toDocument method
  });
  
  it('should extract ID from entity', () => {
    // Test extractId method
  });
});
```

### Repository Testing
- Test with mock mappers
- Focus on query building and MongoDB operations
- Verify mapper methods are called correctly

## Future Enhancements

1. **Generic Mapper Factory**: Create mappers dynamically
2. **Validation Integration**: Add validation to mappers
3. **Transformation Pipes**: Add data transformation pipelines
4. **Caching**: Cache frequently used mappings
5. **Auto-mapping**: Generate mappers from schemas/decorators
