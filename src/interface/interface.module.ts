import { Module } from '@nestjs/common';
import { ActivityLogsController } from './http/controllers/activitylogs.controller';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [ActivityLogsController],
})
export class InterfaceModule {}
