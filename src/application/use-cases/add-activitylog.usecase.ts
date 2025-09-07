import { Injectable, Inject } from '@nestjs/common';
import { ActivityLog, ActionType } from "../../domain/entities/activityLog";
import type { IBaseRepository } from "../../domain/repos/base-repo.interface";
import { CreateActivityLogInput } from "../dto/activitylog.dto";

@Injectable()
export class AddActivityLogUseCase {
    constructor(
        @Inject('IActivityLogRepository')
        private readonly activityLogRepository: IBaseRepository<ActivityLog, string>
    ) {}

    async execute(CreateActivityLogInput: CreateActivityLogInput): Promise<ActivityLog> {
        const activityLog = new ActivityLog();
        activityLog.createdByName = CreateActivityLogInput.createdByName;
        activityLog.createdById = CreateActivityLogInput.createdById;
        activityLog.entityType = CreateActivityLogInput.entityType;
        activityLog.entityId = CreateActivityLogInput.entityId;
        activityLog.fieldKey = CreateActivityLogInput.fieldKey;
        activityLog.fieldValueBefore = CreateActivityLogInput.fieldValueBefore;
        activityLog.fieldValueAfter = CreateActivityLogInput.fieldValueAfter;
        activityLog.action = CreateActivityLogInput.action as ActionType;
        activityLog.createdAt = new Date();
        
        return this.activityLogRepository.create(activityLog);
    }
}