type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  [key: string]: unknown;
}

class Logger {
  private logLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || "info";

  private levelOrder: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private shouldLog(level: LogLevel): boolean {
    return this.levelOrder[level] >= this.levelOrder[this.logLevel];
  }

  private format(level: LogLevel, data: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      ...data,
    };
  }

  debug(data: Record<string, unknown>) {
    if (this.shouldLog("debug")) {
      console.log(JSON.stringify(this.format("debug", data)));
    }
  }

  info(data: Record<string, unknown>) {
    if (this.shouldLog("info")) {
      console.log(JSON.stringify(this.format("info", data)));
    }
  }

  warn(data: Record<string, unknown>) {
    if (this.shouldLog("warn")) {
      console.warn(JSON.stringify(this.format("warn", data)));
    }
  }

  error(data: Record<string, unknown>) {
    if (this.shouldLog("error")) {
      console.error(JSON.stringify(this.format("error", data)));
    }
  }
}

export const logger = new Logger();
