import { Controller, Post, Body, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AddActivityLogUseCase } from '../../../application/use-cases/add-activitylog.usecase';
import { ActivityLog } from '../../../domain/entities/activityLog';
import { CreateActivityLogDto } from '../../validation/activitylog.dto';
import { CreateActivityLogInput } from '../../../application/dto/activitylog.dto';

@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly addActivityLogUseCase: AddActivityLogUseCase) {}

  @Post()
  async create(@Body() activityLog: CreateActivityLogDto): Promise<ActivityLog> {
    const createActivityLogInput = new CreateActivityLogInput();
    createActivityLogInput.entityType = activityLog.entityType;
    createActivityLogInput.entityId = activityLog.entityId;
    createActivityLogInput.fieldKey = activityLog.fieldKey;
    createActivityLogInput.fieldValueBefore = activityLog.fieldValueBefore;
    createActivityLogInput.fieldValueAfter = activityLog.fieldValueAfter;
    createActivityLogInput.createdById = activityLog.createdById;
    createActivityLogInput.createdByName = activityLog.createdByName;
    createActivityLogInput.action = activityLog.action;
    
    return this.addActivityLogUseCase.execute(createActivityLogInput);
  }

  @Get()
  async findAll(@Query() query: any): Promise<ActivityLog[]> {
    // This is a simple implementation - you can extend this to use specifications
    // and pagination based on your requirements
    return [];
  }
}
