import { Request, Response, NextFunction } from 'express';
import pinoHttp from 'pino-http';
import { logger } from '../config/logger';

/**
 * Middleware de logging para registrar requisições HTTP.
 */
export const loggingMiddleware = pinoHttp({
  logger,
  genReqId: (req) => req.id,
  
  // Define nível de log baseado no status da resposta
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  },
  
  // Mensagem para requisições bem-sucedidas
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} - ${res.statusCode}`;
  },
  
  // Mensagem para requisições com erro
  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url} - ${res.statusCode} - ${err?.message}`;
  },
});
