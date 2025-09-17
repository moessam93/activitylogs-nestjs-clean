import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PubSubConfig {
  constructor(private configService: ConfigService) {}

  get projectId(): string {
    return this.configService.get<string>('PUBSUB_PROJECT_ID', 'ca-ads-dev');
  }

  get topicId(): string {
    return this.configService.get<string>(
      'PUBSUB_TOPIC_ID',
      'Activity_Logs_Dev',
    );
  }

  get subscriptionId(): string {
    return this.configService.get<string>(
      'PUBSUB_SUBSCRIPTION_ID',
      'Activity_Logs_Dev-sub',
    );
  }

  get credentialsPath(): string | undefined {
    return this.configService.get<string>('GOOGLE_APPLICATION_CREDENTIALS');
  }

  get ackDeadlineSeconds(): number {
    return this.configService.get<number>('PUBSUB_ACK_DEADLINE_SECONDS', 60);
  }

  get maxMessages(): number {
    return this.configService.get<number>('PUBSUB_MAX_MESSAGES', 100);
  }
}
