import 'reflect-metadata';
import 'dotenv/config';
import './infrastructure/config/container-setup';
import express from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './infrastructure/config/data-source-config';
import orderRoutes from './api/routes/OrderRoutes';
import productRoutes from './api/routes/ProductRoutes';
import recommendationRoutes from './api/routes/RecommendationRoutes';
import logger from './infrastructure/config/logger-config';
import OrderCreatedConsumer from './infrastructure/messaging/OrderCreatedConsumer'; 
import { MongoConfig } from './infrastructure/config/mongo-db-config';

const app = express();
app.use(bodyParser.json());
app.use("/api", orderRoutes);
app.use("/api", productRoutes);
app.use("/api", recommendationRoutes)

const PORT = process.env.PORT || 3000;

let server: any;
AppDataSource.initialize()
  .then(() =>  {
    logger.info('Initializing mongo db...')
    MongoConfig.initialize()
  }) 
  .then(() => {
    logger.info('Initializing consumers...')
    const sqsConsumer = new OrderCreatedConsumer();
    sqsConsumer.start();
  })
  .then(() => {
    logger.info('Initializing server...')
    server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Error during Data Source initialization', err);
  });

export { app, server, AppDataSource };
