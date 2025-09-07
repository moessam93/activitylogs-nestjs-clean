# Validation Implementation

## Overview
Comprehensive validation system using `class-validator` and `class-transformer` packages.

## Global Validation Setup

### Main Application (`src/main.ts`)
```typescript
app.useGlobalPipes(new ValidationPipe({
  transform: true,          // Auto-transform request data
  whitelist: true,          // Strip unknown properties
  forbidNonWhitelisted: true, // Reject requests with unknown properties
}));
```

## Current Validation Rules

### CreateActivityLogDto
```typescript
export class CreateActivityLogDto {
  @IsNotEmpty()
  @IsString()
  entityType: string;           // Required string

  @IsNotEmpty()
  @IsString() 
  entityId: string;            // Required string

  @IsOptional()
  fieldKey?: any;              // Optional, any JSON type

  @IsOptional()
  fieldValueBefore?: any;      // Optional, any JSON type

  @IsOptional()
  fieldValueAfter?: any;       // Optional, any JSON type

  @IsNotEmpty()
  @IsString()
  createdById: string;         // Required string

  @IsNotEmpty()
  @IsString()
  createdByName: string;       // Required string

  @IsNotEmpty()
  @IsEnum(ActionType)
  action: ActionType;          // Required enum: POST, PUT, DELETE
}
```

## ActionType Enum Validation

### Definition (`src/domain/entities/activityLog.ts`)
```typescript
export enum ActionType {
  POST = 'POST',
  PUT = 'PUT', 
  DELETE = 'DELETE'
}
```

### Usage
- **Valid values**: `"POST"`, `"PUT"`, `"DELETE"`
- **Case sensitive**: Must match exactly
- **Automatic validation**: Rejects any other values

## Validation Benefits

1. **Type Safety**: Ensures data types match expected formats
2. **Data Integrity**: Only valid action types accepted
3. **Flexible Fields**: Optional fields accept any JSON-serializable data
4. **Request Sanitization**: Unknown properties automatically removed
5. **Error Handling**: Clear validation error messages returned

## Error Response Format

Invalid requests return structured error responses:
```json
{
  "statusCode": 400,
  "message": [
    "action must be one of the following values: POST, PUT, DELETE",
    "entityType should not be empty",
    "createdById must be a string"
  ],
  "error": "Bad Request"
}
```

## Example Valid Requests

### Minimal Request
```json
{
  "entityType": "user",
  "entityId": "123456",
  "createdById": "admin_001", 
  "createdByName": "System Admin",
  "action": "POST"
}
```

### Complete Request
```json
{
  "entityType": "influencer",
  "entityId": "inf_789",
  "fieldKey": "username",
  "fieldValueBefore": "old_username",
  "fieldValueAfter": "new_username",
  "createdById": "admin_001",
  "createdByName": "System Admin", 
  "action": "PUT"
}
```

### Complex Data Types
```json
{
  "entityType": "product",
  "entityId": "prod_456",
  "fieldKey": "specifications",
  "fieldValueBefore": {
    "color": "red",
    "size": "medium"
  },
  "fieldValueAfter": {
    "color": "blue", 
    "size": "large",
    "material": "cotton"
  },
  "createdById": "admin_001",
  "createdByName": "System Admin",
  "action": "PUT"
}
```

## Validation Decorators Reference

| Decorator | Purpose | Usage |
|-----------|---------|-------|
| `@IsNotEmpty()` | Requires non-empty value | Required fields |
| `@IsString()` | Validates string type | String fields |
| `@IsEnum(ActionType)` | Validates enum values | Action field |
| `@IsOptional()` | Allows undefined/null | Optional fields |

## Future Enhancements

1. **Custom Validators**: Create domain-specific validation rules
2. **Nested Object Validation**: Add validation for complex fieldKey structures
3. **Conditional Validation**: Validate fieldValueBefore/After based on action type
4. **Transform Decorators**: Add data transformation rules
5. **Validation Groups**: Create different validation rules for different scenarios
