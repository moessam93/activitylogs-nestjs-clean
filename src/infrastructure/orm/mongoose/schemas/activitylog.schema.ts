import { Schema, Document } from 'mongoose';

export interface ActivityLogDocument extends Document {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  fieldKey?: any;
  fieldValueBefore?: any;
  fieldValueAfter?: any;
  createdById: string;
  createdByName: string;
  createdAt: Date;
}

export const ActivityLogSchema = new Schema<ActivityLogDocument>({
  action: {
    type: String,
    required: true,
    enum: ['POST', 'PUT', 'DELETE'],
  },
  entityType: {
    type: String,
    required: true,
  },
  entityId: {
    type: String,
    required: true,
  },
  fieldKey: {
    type: Schema.Types.Mixed,
    required: false,
  },
  fieldValueBefore: {
    type: Schema.Types.Mixed,
    required: false,
  },
  fieldValueAfter: {
    type: Schema.Types.Mixed,
    required: false,
  },
  createdById: {
    type: String,
    required: true,
  },
  createdByName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'activity_logs',
  timestamps: true,
});

// Index for better query performance
ActivityLogSchema.index({ entityType: 1, entityId: 1 });
ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ createdById: 1 });
