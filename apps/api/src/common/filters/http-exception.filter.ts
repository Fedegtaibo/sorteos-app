import {
  ExceptionFilter, Catch, ArgumentsHost,
  HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Error interno del servidor';

    // No loguear errores esperados (401, 403, 404)
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} → ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      success: false,
      error: {
        code: this.getErrorCode(status, message),
        message: this.getMessage(message),
        statusCode: status,
      },
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private getErrorCode(status: number, message: unknown): string {
    if (typeof message === 'object' && message !== null && 'code' in message) {
      return (message as any).code;
    }
    const codes: Record<number, string> = {
      400: 'BAD_REQUEST', 401: 'UNAUTHORIZED', 403: 'FORBIDDEN',
      404: 'NOT_FOUND', 409: 'CONFLICT', 422: 'UNPROCESSABLE',
      429: 'TOO_MANY_REQUESTS', 500: 'INTERNAL_ERROR',
    };
    return codes[status] || 'ERROR';
  }

  private getMessage(message: unknown): string {
    if (typeof message === 'string') return message;
    if (typeof message === 'object' && message !== null && 'message' in message) {
      const m = (message as any).message;
      return Array.isArray(m) ? m.join(', ') : String(m);
    }
    return 'Error inesperado';
  }
}
