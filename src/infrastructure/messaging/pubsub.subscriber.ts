/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { PubSub, Subscription, Message } from '@google-cloud/pubsub';
import { PubSubConfig } from './pubsub.config';
import { ActivityLogHandler } from './handlers/activity-log.handler';

export interface PubSubMessageHandler {
  handle(data: any, message: Message): Promise<void>;
}

@Injectable()
export class PubSubSubscriber implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PubSubSubscriber.name);
  private pubSubClient: PubSub;
  private subscription: Subscription;
  private messageHandlers: Map<string, PubSubMessageHandler> = new Map();

  constructor(
    private readonly config: PubSubConfig,
    private readonly activityLogHandler: ActivityLogHandler,
  ) {}

  async onModuleInit() {
    await this.initializePubSub();
    this.registerHandler('activity-log', this.activityLogHandler);
    await this.startListening();
  }

  async onModuleDestroy() {
    await this.closePubSub();
  }

  private async initializePubSub() {
    try {
      this.pubSubClient = new PubSub({
        projectId: this.config.projectId,
        ...(this.config.credentialsPath && {
          keyFilename: this.config.credentialsPath,
        }),
      });

      this.subscription = this.pubSubClient.subscription(
        this.config.subscriptionId,
      );

      // Configure subscription settings
      // Note: The 'options' property does not exist on the Subscription type.
      // Set ackDeadlineSeconds and maxMessages via flow control options when creating the subscription listener, not directly on the subscription object.

      this.logger.log(
        `PubSub subscriber initialized for project: ${this.config.projectId}, topic: ${this.config.topicId}`,
      );
    } catch (error) {
      this.logger.error('Failed to initialize PubSub:', error);
      throw error;
    }
  }

  registerHandler(messageType: string, handler: PubSubMessageHandler) {
    this.messageHandlers.set(messageType, handler);
    this.logger.log(`Registered handler for message type: ${messageType}`);
  }

  async startListening() {
    if (!this.subscription) {
      throw new Error('PubSub subscription not initialized');
    }

    this.subscription.on('message', async (message: Message) => {
      await this.handleMessage(message);
    });

    this.subscription.on('error', (error) => {
      this.logger.error('PubSub subscription error:', error);
    });

    this.logger.log('Started listening for PubSub messages');
  }

  async stopListening() {
    if (this.subscription) {
      this.subscription.removeAllListeners();
      this.logger.log('Stopped listening for PubSub messages');
    }
  }

  private async handleMessage(message: Message) {
    try {
      const data = JSON.parse(message.data.toString());
      const messageType = message.attributes?.type || 'default';

      this.logger.debug(`Received message of type: ${messageType}`, { data });

      const handler = this.messageHandlers.get(messageType);
      if (handler) {
        await handler.handle(data, message);
        message.ack();
        this.logger.debug(`Successfully processed message: ${message.id}`);
      } else {
        this.logger.warn(
          `No handler found for message type: ${messageType}. Acknowledging message.`,
        );
        message.ack();
      }
    } catch (error) {
      this.logger.error(`Error processing message: ${message.id}`, error);
      message.nack();
    }
  }

  private async closePubSub() {
    try {
      await this.stopListening();
      if (this.pubSubClient) {
        await this.pubSubClient.close();
        this.logger.log('PubSub client closed');
      }
    } catch (error) {
      this.logger.error('Error closing PubSub:', error);
    }
  }
}
