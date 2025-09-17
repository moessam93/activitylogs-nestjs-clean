import { Injectable } from '@nestjs/common';
import {
  ActivityLog,
  ActionType,
} from '../../../../domain/entities/activityLog';
import { ActivityLogDocument } from '../schemas/activitylog.schema';
import { IBaseMapper } from './base.mapper.interface';

@Injectable()
export class ActivityLogMapper
  implements IBaseMapper<ActivityLog, ActivityLogDocument>
{
  toEntity(document: ActivityLogDocument): ActivityLog {
    return {
      id: document._id.toString(),
      action: document.action as ActionType,
      entityType: document.entityType,
      entityId: document.entityId,
      fieldKey: document.fieldKey,
      fieldValueBefore: document.fieldValueBefore,
      fieldValueAfter: document.fieldValueAfter,
      createdById: document.createdById,
      createdByName: document.createdByName,
      createdAt: document.createdAt,
    };
  }

  toDocument(entity: ActivityLog): Partial<ActivityLogDocument> {
    const { id, ...entityWithoutId } = entity;
    return entityWithoutId;
  }

  extractId(entity: ActivityLog): string {
    return entity.id;
  }
}
