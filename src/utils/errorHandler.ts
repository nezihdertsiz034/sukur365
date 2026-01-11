/**
 * Merkezi Error Handler Utility
 * 
 * Hataları yakalayıp kullanıcıya anlamlı mesajlar gösterir.
 * Hata tipine göre farklı mesajlar döndürür.
 */

import { logger } from './logger';

export enum ErrorType {
    NETWORK = 'NETWORK',
    STORAGE = 'STORAGE',
    PERMISSION = 'PERMISSION',
    VALIDATION = 'VALIDATION',
    UNKNOWN = 'UNKNOWN',
}

export interface AppError {
    type: ErrorType;
    message: string;
    userMessage: string;
    originalError?: unknown;
    timestamp: number;
}

/**
 * Hata tipini belirler
 */
function determineErrorType(error: unknown): ErrorType {
    if (error instanceof TypeError && error.message.includes('fetch')) {
        return ErrorType.NETWORK;
    }

    if (error instanceof Error) {
        const message = error.message.toLowerCase();

        if (message.includes('network') || message.includes('internet')) {
            return ErrorType.NETWORK;
        }

        if (message.includes('storage') || message.includes('asyncstorage')) {
            return ErrorType.STORAGE;
        }

        if (message.includes('permission') || message.includes('denied')) {
            return ErrorType.PERMISSION;
        }

        if (message.includes('validation') || message.includes('invalid')) {
            return ErrorType.VALIDATION;
        }
    }

    return ErrorType.UNKNOWN;
}

/**
 * Kullanıcıya gösterilecek mesajı oluşturur
 */
function getUserMessage(type: ErrorType, originalMessage?: string): string {
    switch (type) {
        case ErrorType.NETWORK:
            return 'İnternet bağlantısı kurulamadı. Lütfen bağlantınızı kontrol edin.';

        case ErrorType.STORAGE:
            return 'Veri kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.';

        case ErrorType.PERMISSION:
            return 'Bu işlem için gerekli izin verilmedi. Lütfen ayarlardan izinleri kontrol edin.';

        case ErrorType.VALIDATION:
            return originalMessage || 'Girilen bilgiler geçersiz. Lütfen kontrol edin.';

        case ErrorType.UNKNOWN:
        default:
            return 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.';
    }
}

/**
 * Hatayı işler ve AppError döndürür
 */
export function handleError(error: unknown, context?: string): AppError {
    const type = determineErrorType(error);
    const originalMessage = error instanceof Error ? error.message : String(error);
    const userMessage = getUserMessage(type, originalMessage);

    const appError: AppError = {
        type,
        message: originalMessage,
        userMessage,
        originalError: error,
        timestamp: Date.now(),
    };

    // Log the error
    logger.error(
        `Error in ${context || 'unknown context'}`,
        {
            type,
            message: originalMessage,
            userMessage,
        },
        context
    );

    return appError;
}

/**
 * Async fonksiyonları wrap eder ve hataları yakalar
 */
export async function withErrorHandling<T>(
    fn: () => Promise<T>,
    context: string,
    fallbackValue?: T
): Promise<{ data: T | undefined; error: AppError | null }> {
    try {
        const data = await fn();
        return { data, error: null };
    } catch (error) {
        const appError = handleError(error, context);
        return { data: fallbackValue, error: appError };
    }
}

/**
 * Sync fonksiyonları wrap eder ve hataları yakalar
 */
export function withErrorHandlingSync<T>(
    fn: () => T,
    context: string,
    fallbackValue?: T
): { data: T | undefined; error: AppError | null } {
    try {
        const data = fn();
        return { data, error: null };
    } catch (error) {
        const appError = handleError(error, context);
        return { data: fallbackValue, error: appError };
    }
}
