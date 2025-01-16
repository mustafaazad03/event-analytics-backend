import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'your-default-secret',
    expiresIn: '24h',
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  sentimentService: {
    url: process.env.SENTIMENT_SERVICE_URL || 'http://localhost:5000',
  },
  redis: {
    url: process.env.REDIS_URL,
  },
};