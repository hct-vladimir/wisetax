export type ErrorCode = 'INVALID_INPUT' | 'NOT_FOUND' | 'CONFLICT' | 'REVIEW_INCOMPLETE';

export type Result<T> =
    | { readonly ok: true; readonly value: T }
    | {
          readonly ok: false;
          readonly error: { readonly code: ErrorCode; readonly message: string };
      };

export function success<T>(value: T): Result<T> {
    return { ok: true, value };
}

export function failure(code: ErrorCode, message: string): Result<never> {
    return { ok: false, error: { code, message } };
}
