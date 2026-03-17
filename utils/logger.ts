"use client";

/**
 * Standard Application Logger for SaberPro 2026.
 * Provides consistent logging levels and allows for easy suppression in production.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const IS_PROD = process.env.NODE_ENV === 'production';

class Logger {
    private static formatMessage(level: LogLevel, message: string, ...args: any[]) {
        const timestamp = new Date().toISOString();
        const prefix = `[SaberPro][${timestamp}][${level.toUpperCase()}]:`;
        return { prefix, message, args };
    }

    static info(message: string, ...args: any[]) {
        if (IS_PROD) return;
        const { prefix } = this.formatMessage('info', message);
        console.log(prefix, message, ...args);
    }

    static warn(message: string, ...args: any[]) {
        const { prefix } = this.formatMessage('warn', message);
        console.warn(prefix, message, ...args);
    }

    static error(message: string, ...args: any[]) {
        const { prefix } = this.formatMessage('error', message);
        console.error(prefix, message, ...args);
    }

    static debug(message: string, ...args: any[]) {
        if (IS_PROD) return;
        const { prefix } = this.formatMessage('debug', message);
        console.debug(prefix, message, ...args);
    }
}

export default Logger;
