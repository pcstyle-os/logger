import type { LogEntry, LogTransport } from "../types";

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
} as const;

const levelColors: Record<string, string> = {
  debug: colors.dim,
  info: colors.cyan,
  warn: colors.yellow,
  error: colors.red,
};

const levelSymbols: Record<string, string> = {
  debug: "[DEBUG]",
  info: "[INFO] ",
  warn: "[WARN] ",
  error: "[ERROR]",
};

/**
 * Console transport with colorized output for development
 */
export class ConsoleTransport implements LogTransport {
  log(entry: LogEntry): void {
    const color = levelColors[entry.level] || "";
    const symbol = levelSymbols[entry.level] || "";
    const time = colors.dim + entry.timestamp + colors.reset;
    const level = color + symbol + colors.reset;
    const message = entry.message;

    let output = `${time} ${level} ${message}`;

    if (entry.context && Object.keys(entry.context).length > 0) {
      const contextStr = Object.entries(entry.context)
        .map(([k, v]) => `${colors.magenta}${k}${colors.reset}=${formatValue(v)}`)
        .join(" ");
      output += ` ${contextStr}`;
    }

    switch (entry.level) {
      case "error":
        console.error(output);
        break;
      case "warn":
        console.warn(output);
        break;
      case "debug":
        console.debug(output);
        break;
      default:
        console.log(output);
    }
  }
}

function formatValue(value: unknown): string {
  if (typeof value === "string") {
    return `"${value}"`;
  }
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }
  return String(value);
}
