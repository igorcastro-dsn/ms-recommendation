import { Consumer } from 'sqs-consumer';
import AWS from 'aws-sdk';
import logger from '../../infrastructure/config/logger-config';
import { RecommendationService } from '../../application/services/RecommendationService';
import { container } from 'tsyringe';

class OrderCreatedConsumer {

  private readonly queueName: string;
  private readonly queueHost: string;
  private readonly queueUrl: string;

  private sqs: AWS.SQS;
  private recommendationService: RecommendationService;
  private consumer: Consumer;

  constructor() {
    this.queueName = process.env.SQS_ORDER_CREATED_QUEUE || 'ms-recommendation-order-created-queue';
    this.queueHost = process.env.AWS_HOST || 'http://localhost:4566';
    this.queueUrl = `${this.queueHost}/000000000000/${this.queueName}`;

    this.sqs = new AWS.SQS({
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_HOST
    });
    
    this.recommendationService = container.resolve(RecommendationService);

    this.consumer = this.createConsumer();
    this.registerEventHandlers();
  }

  private createConsumer(): Consumer {
    return Consumer.create({
      queueUrl: this.queueUrl,
      handleMessage: this.handleMessage.bind(this),
      sqs: this.sqs
    });
  }

  private async handleMessage(message: AWS.SQS.Message): Promise<void> {
    let attempts = 0;
    const maxAttempts = 3;
    const retryInterval = 3000; // 3 segundos
    
    const processMessage = async () => {
      try {
        const body = JSON.parse(message.Body || '{}');
        await this.recommendationService.create(body.orderId, body.items, body.createdAt);
      } catch (error: any) {
        attempts++;
        logger.error(`Error processing message attempt ${attempts}:`, error.message);
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, retryInterval));
          await processMessage();
        } else {
          logger.error(`Error consuming message:`, error.message);
          //throw error; Para não represar mensagens no exercício, os erros só serão logados.
    }
      }
    };

    await processMessage();
  }

  private registerEventHandlers(): void {
    this.consumer.on('error', (err) => {
      logger.error('Consumer Error:', err.message);
    });

    this.consumer.on('processing_error', (err) => {
      logger.error('Consumer Processing Error:', err.message);
    });
  }

  public start(): void {
    this.consumer.start();
    logger.info(`Consumer started for queue: ${this.queueName}`);
  }

}

export default OrderCreatedConsumer;
