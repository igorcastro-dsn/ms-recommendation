import mongoose from 'mongoose';
import logger from './logger-config';

class MongoConfig {
  
  private static db: mongoose.Connection;

  static async initialize(): Promise<void> {
    if (MongoConfig.db) {
      logger.info('MongoDb already initialized!')
      return;
    }

    await mongoose.connect(process.env.MONGO_URI || '', {
      dbName: process.env.MONGO_DB_NAME,
    });

    MongoConfig.db = mongoose.connection;

    MongoConfig.db.on('connected', () => {
      logger.info('Mongoose connected to DB');
    });

    MongoConfig.db.on('error', (err) => {
      logger.info(`Mongoose connection error: ${err}`);
    });

    MongoConfig.db.on('disconnected', () => {
      logger.info('Mongoose disconnected');
    });
  }

  static getDb(): mongoose.Connection {
    if (!MongoConfig.db) {
      throw new Error("MongoDB not initialized. Call initialize() first.");
    }
    return MongoConfig.db;
  }

  static async close(): Promise<void> {
    if (MongoConfig.db) {
      await MongoConfig.db.close();
    }
  }

}

export { MongoConfig };
