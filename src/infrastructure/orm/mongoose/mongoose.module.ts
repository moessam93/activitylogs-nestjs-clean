import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import databaseConfig from './database.config';
import {
  ActivityLogSchema,
  ActivityLogDocument,
} from './schemas/activitylog.schema';
import { BaseMongooseRepository } from './base-mongoose.repository';
import { ActivityLogMapper } from './mappers/activitylog.mapper';
import { ActivityLog } from '../../../domain/entities/activityLog';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        ...configService.get('database.options'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: 'ActivityLog', schema: ActivityLogSchema },
    ]),
  ],
  providers: [
    ActivityLogMapper,
    {
      provide: 'IActivityLogRepository',
      useFactory: (
        activityLogModel: Model<ActivityLogDocument>,
        activityLogMapper: ActivityLogMapper,
      ) => {
        return new BaseMongooseRepository<
          ActivityLog,
          string,
          ActivityLogDocument
        >(activityLogModel, activityLogMapper);
      },
      inject: [getModelToken('ActivityLog'), ActivityLogMapper],
    },
  ],
  exports: [MongooseModule, 'IActivityLogRepository'],
})
export class DatabaseModule {}
