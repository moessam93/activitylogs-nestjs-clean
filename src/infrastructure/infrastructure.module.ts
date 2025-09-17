import { Module } from '@nestjs/common';
import { DatabaseModule } from './orm/mongoose/mongoose.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [DatabaseModule, MessagingModule],
  exports: [DatabaseModule, MessagingModule],
})
export class InfrastructureModule {}
