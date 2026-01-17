import type {
  LogLevel,
  LogContext,
  LogEntry,
  LogTransport,
  LoggerConfig,
} from "./types";
import { ConsoleTransport } from "./transports/console";
import { JsonTransport } from "./transports/json";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

function detectEnvironment(): "production" | "development" {
  // Check multiple environment indicators
  if (typeof process !== "undefined") {
    if (process.env.NODE_ENV === "production") return "production";
    if (process.env.VERCEL_ENV === "production") return "production";
  }
  return "development";
}

function getDefaultTransport(): LogTransport {
  const env = detectEnvironment();
  return env === "production" ? new JsonTransport() : new ConsoleTransport();
}

/**
 * Structured logger with environment-aware output
 */
export class Logger {
  private readonly minLevel: number;
  private readonly transports: LogTransport[];
  private readonly defaultContext: LogContext;

  constructor(config: LoggerConfig = {}) {
    const env = detectEnvironment();
    const defaultMinLevel: LogLevel = env === "production" ? "info" : "debug";

    this.minLevel = LOG_LEVELS[config.minLevel ?? defaultMinLevel];
    this.transports = config.transports ?? [getDefaultTransport()];
    this.defaultContext = config.defaultContext ?? {};
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (LOG_LEVELS[level] < this.minLevel) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: { ...this.defaultContext, ...context },
    };

    for (const transport of this.transports) {
      try {
        transport.log(entry);
      } catch {
        // Silently fail - logging should never crash the app
      }
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log("debug", message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log("error", message, context);
  }

  /**
   * Create a child logger with additional default context
   */
  child(context: LogContext): Logger {
    return new Logger({
      minLevel: Object.entries(LOG_LEVELS).find(
        ([, v]) => v === this.minLevel
      )?.[0] as LogLevel,
      transports: this.transports,
      defaultContext: { ...this.defaultContext, ...context },
    });
  }
}

/** Default logger instance */
export const logger = new Logger();

/** Create a new logger with custom configuration */
export function createLogger(config?: LoggerConfig): Logger {
  return new Logger(config);
}
