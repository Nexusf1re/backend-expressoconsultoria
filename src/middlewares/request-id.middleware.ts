import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware para gerar IDs únicos para cada requisição.
 */
export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Gera ou recupera ID da requisição
  const requestId = req.headers['x-request-id'] as string || uuidv4();
  
  // Adiciona ID à requisição
  req.id = requestId;
  
  // Retorna ID no header da resposta
  res.setHeader('X-Request-ID', requestId);
  
  next();
}
