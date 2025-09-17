export enum ActionType {
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export class ActivityLog {
  id: string;
  action: ActionType; // POST, PUT, DELETE
  entityType: string; // user, beat, influencer, brand
  entityId: string;
  fieldKey?: any; // "beat.influencer.id"
  fieldValueBefore?: any; // "123"
  fieldValueAfter?: any; // "456"
  createdById: string;
  createdByName: string;
  createdAt: Date;
}
