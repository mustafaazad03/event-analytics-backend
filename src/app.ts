import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from './config/database';
import { initializeSocketServer } from './utils/socket';
import { createServer } from 'http';
import routes from './routes';
import { PrismaClient } from '@prisma/client';
// import { errorHandler } from './middleware/error.middleware';

const app = express();
const httpServer = createServer(app);
const io = initializeSocketServer(httpServer);
const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();

// Middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach socket.io to request
app.use((req: any, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api', routes);

// Start server
const PORT = config.port;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, httpServer };