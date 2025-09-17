import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { ActionType } from '../../domain/entities/activityLog';

export class CreateActivityLogDto {
  @IsNotEmpty()
  @IsString()
  entityType: string;

  @IsNotEmpty()
  @IsString()
  entityId: string;

  @IsOptional()
  fieldKey?: any;

  @IsOptional()
  fieldValueBefore?: any;

  @IsOptional()
  fieldValueAfter?: any;

  @IsNotEmpty()
  @IsString()
  createdById: string;

  @IsNotEmpty()
  @IsString()
  createdByName: string;

  @IsNotEmpty()
  @IsEnum(ActionType)
  action: ActionType;
}
