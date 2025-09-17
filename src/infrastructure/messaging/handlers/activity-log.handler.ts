/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
import { Injectable, Logger } from '@nestjs/common';
import { Message } from '@google-cloud/pubsub';
import { PubSubMessageHandler } from '../pubsub.subscriber';

export interface ActivityLogMessage {
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class ActivityLogHandler implements PubSubMessageHandler {
  private readonly logger = new Logger(ActivityLogHandler.name);

  async handle(data: ActivityLogMessage, message: Message): Promise<void> {
    try {
      this.logger.log('Processing activity log message', {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        messageId: message.id,
      });

      // TODO: Call application use case to process the activity log
      // Example: await this.addActivityLogUseCase.execute(data);

      this.logger.debug('Successfully processed activity log message', {
        messageId: message.id,
      });
    } catch (error) {
      this.logger.error('Failed to process activity log message', {
        error: error.message,
        messageId: message.id,
        data,
      });
      throw error;
    }
  }
}
