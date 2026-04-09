type LogLevel = "info" | "warn" | "error";

function writeLog(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta ?? {}),
  };

  const serialized = JSON.stringify(payload);

  if (level === "error") {
    console.error(serialized);
    return;
  }

  if (level === "warn") {
    console.warn(serialized);
    return;
  }

  console.info(serialized);
}

export function logInfo(message: string, meta?: Record<string, unknown>) {
  writeLog("info", message, meta);
}

export function logWarn(message: string, meta?: Record<string, unknown>) {
  writeLog("warn", message, meta);
}

export function logError(message: string, meta?: Record<string, unknown>) {
  writeLog("error", message, meta);
}