import type { LogEntry, LogTransport } from "../types";

/**
 * JSON transport for production - outputs structured JSON logs
 */
export class JsonTransport implements LogTransport {
  log(entry: LogEntry): void {
    const output = JSON.stringify({
      level: entry.level,
      message: entry.message,
      timestamp: entry.timestamp,
      ...entry.context,
    });

    switch (entry.level) {
      case "error":
        console.error(output);
        break;
      case "warn":
        console.warn(output);
        break;
      default:
        console.log(output);
    }
  }
}
