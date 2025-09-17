# Validation Fixes Documentation

## Issues Found and Fixed

### 1. **Field Naming Inconsistency**

**Problem**: DTO used camelCase (`fieldKey`) while entity/schema used PascalCase (`FieldKey`)

**Before**:

```typescript
// DTO
fieldKey: string;
fieldValueBefore: string;
fieldValueAfter: string;

// Entity
FieldKey: any;
FieldValueBefore: any;
FieldValueAfter: any;
```

**After**: ✅ **Fixed** - Aligned all to use PascalCase matching domain entity

```typescript
// DTO
FieldKey?: any;
FieldValueBefore?: any;
FieldValueAfter?: any;

// Entity (unchanged)
FieldKey?: any;
FieldValueBefore?: any;
FieldValueAfter?: any;
```

### 2. **Action Type Validation**

**Problem**: Action was validated as any string, but schema had enum constraint

**Before**:

```typescript
@IsString()
action: string; // Any string allowed
```

**After**: ✅ **Fixed** - Added proper enum validation

```typescript
export enum ActionType {
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

@IsEnum(ActionType)
action: ActionType; // Only POST, PUT, DELETE allowed
```

### 3. **Field Type Validation**

**Problem**: `Field*` properties were validated as required strings but should be optional any type

**Before**:

```typescript
@IsNotEmpty()
@IsString()
fieldKey: string; // Required string
```

**After**: ✅ **Fixed** - Made optional with any type

```typescript
@IsOptional()
FieldKey?: any; // Optional, any type
```

### 4. **Required Fields Mismatch**

**Problem**: DTO made all fields required but schema allowed some to be optional

**Before**:

```typescript
// All fields marked as @IsNotEmpty()
```

**After**: ✅ **Fixed** - Made Field\* properties optional to match schema

```typescript
// Required fields
@IsNotEmpty() entityType: string;
@IsNotEmpty() entityId: string;
@IsNotEmpty() createdById: string;
@IsNotEmpty() createdByName: string;
@IsNotEmpty() action: ActionType;

// Optional fields
@IsOptional() FieldKey?: any;
@IsOptional() FieldValueBefore?: any;
@IsOptional() FieldValueAfter?: any;
```

### 5. **Controller Field Mapping**

**Problem**: Controller was mapping camelCase DTO fields to camelCase input fields

**Before**:

```typescript
createActivityLogInput.fieldKey = activityLog.fieldKey; // Wrong field names
```

**After**: ✅ **Fixed** - Updated to use correct PascalCase fields

```typescript
createActivityLogInput.FieldKey = activityLog.FieldKey; // Correct field names
```

### 6. **Use Case Field Assignment**

**Problem**: Use case was trying to access non-existent camelCase fields

**Before**:

```typescript
activityLog.FieldKey = CreateActivityLogInput.fieldKey; // fieldKey doesn't exist
```

**After**: ✅ **Fixed** - Updated to use correct PascalCase fields

```typescript
activityLog.FieldKey = CreateActivityLogInput.FieldKey; // Correct field access
```

### 7. **Type Casting for ActionType**

**Problem**: String to ActionType conversion wasn't handled

**Before**:

```typescript
action: document.action, // string to ActionType error
```

**After**: ✅ **Fixed** - Added proper type casting

```typescript
action: document.action as ActionType, // Explicit casting
```

### 8. **Global Validation Setup**

**Problem**: Validation wasn't enabled globally

**Before**: No global validation

```typescript
// main.ts - No validation setup
```

**After**: ✅ **Fixed** - Added global validation pipes

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);
```

## Current Validation Rules

### CreateActivityLogDto Validation

```typescript
export class CreateActivityLogDto {
  @IsNotEmpty()
  @IsString()
  entityType: string; // Required string

  @IsNotEmpty()
  @IsString()
  entityId: string; // Required string

  @IsOptional()
  FieldKey?: any; // Optional, any type

  @IsOptional()
  FieldValueBefore?: any; // Optional, any type

  @IsOptional()
  FieldValueAfter?: any; // Optional, any type

  @IsNotEmpty()
  @IsString()
  createdById: string; // Required string

  @IsNotEmpty()
  @IsString()
  createdByName: string; // Required string

  @IsNotEmpty()
  @IsEnum(ActionType)
  action: ActionType; // Required enum (POST, PUT, DELETE)
}
```

## Validation Benefits

1. **Type Safety**: Proper TypeScript typing throughout the stack
2. **Data Integrity**: Only valid action types accepted
3. **Flexible Field Types**: Field\* properties can be any JSON-serializable type
4. **Proper Optionality**: Optional fields match database schema
5. **Global Validation**: Automatic validation on all endpoints
6. **Request Sanitization**: `whitelist: true` removes unknown properties
7. **Strict Mode**: `forbidNonWhitelisted: true` rejects invalid properties

## Example Valid Requests

### Minimal Request (Optional fields omitted)

```json
{
  "entityType": "user",
  "entityId": "123",
  "createdById": "admin",
  "createdByName": "Administrator",
  "action": "POST"
}
```

### Full Request (All fields included)

```json
{
  "entityType": "user",
  "entityId": "123",
  "FieldKey": "user.email",
  "FieldValueBefore": "old@example.com",
  "FieldValueAfter": "new@example.com",
  "createdById": "admin",
  "createdByName": "Administrator",
  "action": "PUT"
}
```

### Complex Field Values

```json
{
  "entityType": "product",
  "entityId": "456",
  "FieldKey": "product.metadata",
  "FieldValueBefore": { "price": 100, "category": "electronics" },
  "FieldValueAfter": { "price": 120, "category": "electronics", "sale": true },
  "createdById": "system",
  "createdByName": "System Process",
  "action": "PUT"
}
```

## Error Responses

Invalid requests now return proper validation errors:

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
