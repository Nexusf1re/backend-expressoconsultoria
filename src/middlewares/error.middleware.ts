import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';
import { ErrorResponse } from '../schemas/response';

/**
 * Middleware global de tratamento de erros.
 */
export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Registra o erro
  logger.error('Erro não tratado capturado', {
    erro: error.message,
    stack: error.stack,
    url: req.url,
    metodo: req.method,
    requestId: req.id
  });

  // Verifica se é erro de validação do Zod
  if (error instanceof ZodError) {
    const response: ErrorResponse = {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Parâmetros da requisição inválidos',
        details: error.errors.map((err) => ({
          campo: err.path.join('.'),
          mensagem: err.message,
        })),
      },
    };

    res.status(400).json(response);
    return;
  }

  // Erro interno não tratado
  const response: ErrorResponse = {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Ocorreu um erro interno no servidor',
    },
  };

  res.status(500).json(response);
}
