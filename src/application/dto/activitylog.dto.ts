export class CreateActivityLogInput {
  entityType: string;
  entityId: string;
  fieldKey?: any;
  fieldValueBefore?: any;
  fieldValueAfter?: any;
  createdById: string;
  createdByName: string;
  action: string;
}
