/**
 * Merkezi Logger Utility
 * 
 * Development ortamında console'a log yazdırır.
 * Production ortamında logları devre dışı bırakır veya analytics'e gönderir.
 */

const __DEV__ = process.env.NODE_ENV !== 'production';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private enabled: boolean;

  constructor() {
    this.enabled = __DEV__;
  }

  /**
   * Debug seviyesinde log
   */
  debug(message: string, data?: unknown, location?: string): void {
    this.log(LogLevel.DEBUG, message, data, location);
  }

  /**
   * Info seviyesinde log
   */
  info(message: string, data?: unknown, location?: string): void {
    this.log(LogLevel.INFO, message, data, location);
  }

  /**
   * Warning seviyesinde log
   */
  warn(message: string, data?: unknown, location?: string): void {
    this.log(LogLevel.WARN, message, data, location);
  }

  /**
   * Error seviyesinde log
   */
  error(message: string, error?: unknown, location?: string): void {
    this.log(LogLevel.ERROR, message, error, location);
  }

  /**
   * Ana log fonksiyonu
   */
  private log(level: LogLevel, message: string, data?: unknown, location?: string): void {
    if (!this.enabled && level !== LogLevel.ERROR) {
      return;
    }

    // Development'ta console'a yazdır
    if (__DEV__) {
      const prefix = location ? `[${location}]` : '';
      const logMessage = `${prefix} ${message}`;

      // Error objelerini düzgün göster
      let displayData = data;
      if (data instanceof Error) {
        displayData = {
          name: data.name,
          message: data.message,
          stack: data.stack,
        };
      }

      switch (level) {
        case LogLevel.DEBUG:
          console.log(`🔍 ${logMessage}`, displayData || '');
          break;
        case LogLevel.INFO:
          console.info(`ℹ️ ${logMessage}`, displayData || '');
          break;
        case LogLevel.WARN:
          console.warn(`⚠️ ${logMessage}`, displayData || '');
          break;
        case LogLevel.ERROR:
          console.error(`❌ ${logMessage}`, displayData || '');
          break;
      }
    }

    // Production'da analytics'e gönder (opsiyonel)
    if (!__DEV__ && level === LogLevel.ERROR) {
      // TODO: Analytics servisine gönder
      // analytics.logError(entry);
    }
  }

  /**
   * Logger'ı etkinleştir/devre dışı bırak
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Singleton instance
export const logger = new Logger();
