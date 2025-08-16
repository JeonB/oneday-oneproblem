interface LogContext {
  requestId?: string
  userId?: string
  endpoint?: string
  [key: string]: any
}

class Logger {
  private generateRequestId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private formatMessage(
    level: string,
    message: string,
    context: LogContext = {},
  ) {
    const timestamp = new Date().toISOString()
    const requestId = context.requestId || this.generateRequestId()

    return JSON.stringify({
      timestamp,
      level,
      message,
      requestId,
      ...context,
    })
  }

  info(message: string, context: LogContext = {}) {
    console.log(this.formatMessage('INFO', message, context))
  }

  warn(message: string, context: LogContext = {}) {
    console.warn(this.formatMessage('WARN', message, context))
  }

  error(message: string, error?: Error, context: LogContext = {}) {
    const errorContext = error
      ? {
          errorName: error.name,
          errorMessage: error.message,
          errorStack: error.stack,
          ...context,
        }
      : context

    console.error(this.formatMessage('ERROR', message, errorContext))
  }

  debug(message: string, context: LogContext = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('DEBUG', message, context))
    }
  }
}

export const logger = new Logger()

// Middleware helper to add request ID to context
export function createRequestContext(req: Request): LogContext {
  const requestId =
    req.headers.get('x-request-id') ||
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  return {
    requestId,
    endpoint: new URL(req.url).pathname,
    method: req.method,
  }
}
