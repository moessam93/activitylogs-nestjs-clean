# Field Naming Standards

## Overview

This document establishes the field naming conventions used across all layers of the application.

## Current Standard: camelCase

All field names use **camelCase** convention consistently across:

- Domain entities
- Database schemas
- DTOs and validation
- API requests/responses

## ActivityLog Field Names

| Field              | Type       | Required | Description                        |
| ------------------ | ---------- | -------- | ---------------------------------- |
| `id`               | string     | Yes      | Entity identifier (domain only)    |
| `entityType`       | string     | Yes      | Type of entity being tracked       |
| `entityId`         | string     | Yes      | Unique ID of the tracked entity    |
| `fieldKey`         | any        | No       | The field that was changed         |
| `fieldValueBefore` | any        | No       | Previous field value               |
| `fieldValueAfter`  | any        | No       | New field value                    |
| `createdById`      | string     | Yes      | ID of person who made the change   |
| `createdByName`    | string     | Yes      | Name of person who made the change |
| `action`           | ActionType | Yes      | Action performed (POST/PUT/DELETE) |
| `createdAt`        | Date       | Yes      | Timestamp of change                |

## Layer Consistency

### Domain Entity (`ActivityLog`)

```typescript
export class ActivityLog {
  id: string;
  fieldKey?: any;
  fieldValueBefore?: any;
  fieldValueAfter?: any;
  // ... other fields
}
```

### Database Schema (`ActivityLogSchema`)

```typescript
export const ActivityLogSchema = new Schema({
  fieldKey: { type: Schema.Types.Mixed, required: false },
  fieldValueBefore: { type: Schema.Types.Mixed, required: false },
  fieldValueAfter: { type: Schema.Types.Mixed, required: false },
  // ... other fields
});
```

### DTO Validation (`CreateActivityLogDto`)

```typescript
export class CreateActivityLogDto {
  @IsOptional()
  fieldKey?: any;

  @IsOptional()
  fieldValueBefore?: any;

  @IsOptional()
  fieldValueAfter?: any;
  // ... other fields
}
```

### API Examples

```json
{
  "entityType": "user",
  "entityId": "123",
  "fieldKey": "username",
  "fieldValueBefore": "old_name",
  "fieldValueAfter": "new_name",
  "action": "PUT"
}
```

## Migration Notes

If you encounter any legacy references to PascalCase field names:

- `FieldKey` → `fieldKey`
- `FieldValueBefore` → `fieldValueBefore`
- `FieldValueAfter` → `fieldValueAfter`

These should be updated to maintain consistency across the codebase.
