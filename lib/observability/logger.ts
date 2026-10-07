// lib/observability/logger.ts
// Buró Cibernético de Investigación (CIB) - República de Panamá
// Logger Estructurado con Sanitización Automática de Secretos y Trazabilidad

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogContext {
  correlationId?: string;
  actorId?: string;
  actorRole?: string;
  action?: string;
  resource?: string;
  caseId?: string;
  [key: string]: unknown;
}

const REDACTED_KEYS = new Set([
  'password',
  'token',
  'secret',
  'authorization',
  'cookie',
  'credential',
  'privatekey',
  'accesstoken',
  'idtoken',
]);

function sanitizeValue(key: string, value: unknown): unknown {
  if (typeof key === 'string' && REDACTED_KEYS.has(key.toLowerCase())) {
    return '[REDACTED_CONFIDENTIAL]';
  }
  if (value && typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.map((item) => (typeof item === 'object' ? sanitizeObject(item as Record<string, unknown>) : item));
    }
    return sanitizeObject(value as Record<string, unknown>);
  }
  return value;
}

function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    result[k] = sanitizeValue(k, v);
  }
  return result;
}

export class StructuredLogger {
  private serviceName: string;

  constructor(serviceName = 'CIB-IMS') {
    this.serviceName = serviceName;
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: unknown): void {
    const entry = {
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      level,
      message,
      context: context ? sanitizeObject(context as Record<string, unknown>) : undefined,
      error:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
            }
          : error
          ? String(error)
          : undefined,
    };

    const serialized = JSON.stringify(entry);

    if (level === 'ERROR') {
      console.error(serialized);
    } else if (level === 'WARN') {
      console.warn(serialized);
    } else {
      console.log(serialized);
    }
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.NODE_ENV !== 'production') {
      this.log('DEBUG', message, context);
    }
  }

  info(message: string, context?: LogContext): void {
    this.log('INFO', message, context);
  }

  warn(message: string, context?: LogContext, error?: unknown): void {
    this.log('WARN', message, context, error);
  }

  error(message: string, context?: LogContext, error?: unknown): void {
    this.log('ERROR', message, context, error);
  }
}

export const logger = new StructuredLogger('CIB-IMS-Core');
