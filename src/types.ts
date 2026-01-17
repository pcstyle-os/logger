/** Log levels in order of severity */
export type LogLevel = "debug" | "info" | "warn" | "error";

/** Contextual metadata for log entries */
export type LogContext = Record<string, unknown>;

/** A single log entry */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
}

/** Transport interface for log output */
export interface LogTransport {
  log(entry: LogEntry): void;
}

/** Logger configuration options */
export interface LoggerConfig {
  /** Minimum level to log (default: "info" in production, "debug" in dev) */
  minLevel?: LogLevel;
  /** Custom transports (defaults to console transport) */
  transports?: LogTransport[];
  /** Default context added to every log entry */
  defaultContext?: LogContext;
}
