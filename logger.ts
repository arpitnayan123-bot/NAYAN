// ============================================
// STRUCTURED LOGGER — Production-grade observability
// JSON logs compatible with Vercel Log Drains,
// Datadog, Grafana Loki, or any log aggregator.
// ============================================

import { config } from '../config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  environment: string;
  message: string;
  traceId?: string;
  userId?: string;
  endpoint?: string;
  duration_ms?: number;
  metadata?: Record<string, any>;
  error?: { name: string; message: string; stack?: string };
}

const LEVEL_PRIORITY: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

function shouldLog(level: LogLevel): boolean {
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[config.observability.logLevel];
}

function emit(entry: LogEntry): void {
  const json = JSON.stringify(entry);
  switch (entry.level) {
    case 'error': console.error(json); break;
    case 'warn': console.warn(json); break;
    case 'debug': console.debug(json); break;
    default: console.log(json);
  }
}

export class Logger {
  private context: Partial<LogEntry>;

  constructor(context: { endpoint?: string; userId?: string; traceId?: string } = {}) {
    this.context = {
      service: config.observability.serviceName,
      environment: config.observability.environment,
      ...context,
    };
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, any>, error?: Error): void {
    if (!shouldLog(level)) return;
    emit({
      timestamp: new Date().toISOString(),
      level,
      message,
      ...this.context,
      metadata,
      error: error ? { name: error.name, message: error.message, stack: config.env !== 'production' ? error.stack : undefined } : undefined,
    });
  }

  debug(msg: string, meta?: Record<string, any>) { this.log('debug', msg, meta); }
  info(msg: string, meta?: Record<string, any>) { this.log('info', msg, meta); }
  warn(msg: string, meta?: Record<string, any>) { this.log('warn', msg, meta); }
  error(msg: string, error?: Error, meta?: Record<string, any>) { this.log('error', msg, meta, error || undefined); }

  // Child logger with additional context
  child(extra: Partial<LogEntry>): Logger {
    const child = new Logger();
    child.context = { ...this.context, ...extra };
    return child;
  }

  // Request timing helper
  startTimer(): () => number {
    const start = Date.now();
    return () => Date.now() - start;
  }
}

export const rootLogger = new Logger();
