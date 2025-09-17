import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PubSubConfig } from './pubsub.config';
import { PubSubSubscriber } from './pubsub.subscriber';
import { ActivityLogHandler } from './handlers/activity-log.handler';

@Module({
  imports: [ConfigModule],
  providers: [PubSubConfig, PubSubSubscriber, ActivityLogHandler],
  exports: [PubSubConfig, PubSubSubscriber, ActivityLogHandler],
})
export class MessagingModule {}
