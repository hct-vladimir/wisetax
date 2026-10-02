import { failure, success, type Result } from '../common/result.ts';

export interface PurchaseContext {
    readonly clientId: string;
    readonly period: string;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isText(value: unknown, maxLength: number): value is string {
    return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

export function validateContext(value: unknown): Result<PurchaseContext> {
    if (
        !isRecord(value) ||
        !isText(value.clientId, 100) ||
        value.clientId !== value.clientId.trim() ||
        typeof value.period !== 'string' ||
        !/^\d{4}-(0[1-9]|1[0-2])$/.test(value.period)
    ) {
        return failure('INVALID_INPUT', 'Select a valid client and period (YYYY-MM).');
    }
    return success({ clientId: value.clientId, period: value.period });
}

export function isRevision(value: unknown): value is number {
    return Number.isSafeInteger(value) && (value as number) >= 1;
}
