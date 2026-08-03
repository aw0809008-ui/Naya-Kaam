/**
 * Naya Kaam — Production Logger & Diagnostics Module
 */

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  scope: string;
  action: string;
  message: string;
  details?: any;
}

const LOG_STORAGE_KEY = 'nayakaam_system_logs_v1';

export const logger = {
  info: (scope: string, action: string, message: string, details?: any) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      scope,
      action,
      message,
      details,
    };
    console.info(`[INFO] [${scope}:${action}] ${message}`, details || '');
    saveLog(entry);
  },

  warn: (scope: string, action: string, message: string, details?: any) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      scope,
      action,
      message,
      details,
    };
    console.warn(`[WARN] [${scope}:${action}] ${message}`, details || '');
    saveLog(entry);
  },

  error: (scope: string, action: string, message: string, error?: any) => {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      scope,
      action,
      message,
      details: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
    };
    console.error(`[ERROR] [${scope}:${action}] ${message}`, error || '');
    saveLog(entry);
  },

  getLogs: (): LogEntry[] => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(LOG_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  clearLogs: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LOG_STORAGE_KEY);
  },
};

function saveLog(entry: LogEntry) {
  if (typeof window === 'undefined') return;
  try {
    const logs = logger.getLogs();
    const updated = [entry, ...logs.slice(0, 99)];
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}
