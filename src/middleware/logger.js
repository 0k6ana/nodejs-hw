// src/middleware/logger.js
import pino from 'pino';
import pinoHttp from 'pino-http';

const loggerInstance = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    },
  },
});

export const httpLogger = pinoHttp({ logger: loggerInstance });
