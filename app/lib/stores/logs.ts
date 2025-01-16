import { atom, map } from 'nanostores';
import Cookies from 'js-cookie';
import { createScopedLogger } from '~/utils/logger';

const logger = createScopedLogger('LogStore');

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  details?: Record<string, any>;
  category: 'system' | 'provider' | 'user' | 'error';
}

const MAX_LOGS = 1000; // Maximum number of logs to keep in memory

export class LogStore {
  logs: LogEntry[] = [];

  logSystem(message: string, data?: any) {
    console.log(`[System] ${message}`, data); // This will show in console
    this.logs.push({
      type: 'system',
      message,
      data,
      timestamp: new Date(),
    });
  }

  logError(message: string, error: any) {
    console.error(`[Error] ${message}`, error); // This will show in console
    this.logs.push({
      type: 'error',
      message,
      error,
      timestamp: new Date(),
    });
  }
}

export const logStore = new LogStore();
