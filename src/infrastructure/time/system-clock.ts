import type { Clock } from '../../application/services/clock.ts';

export class SystemClock implements Clock {
    now(): string {
        return new Date().toISOString();
    }
}
