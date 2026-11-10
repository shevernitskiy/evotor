export type RateLimitState = {
  limit?: number;
  remaining?: number;
  reset?: number;
};

type RateLimiterOptions = {
  now?: () => number;
  sleep?: (milliseconds: number) => Promise<void>;
};

const defaultSleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function readNumber(headers: Headers, name: string): number | undefined {
  const value = headers.get(name);
  if (value === null || value === "") return undefined;

  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

export class RateLimiter {
  private readonly limits: RateLimitState = { limit: undefined, remaining: undefined, reset: undefined };
  private readonly now: () => number;
  private readonly sleep: (milliseconds: number) => Promise<void>;
  private resetAt?: number;
  private pause?: Promise<void>;

  constructor(options: RateLimiterOptions = {}) {
    this.now = options.now ?? Date.now;
    this.sleep = options.sleep ?? defaultSleep;
  }

  get state(): Readonly<RateLimitState> {
    return this.limits;
  }

  wait(): Promise<void> | undefined {
    if (this.pause !== undefined) return this.pause;

    const remaining = this.limits.remaining;
    if (remaining === undefined || remaining > 0 || this.resetAt === undefined) return undefined;

    const delay = this.resetAt - this.now();
    if (delay <= 0) return undefined;

    return (this.pause = this.block(delay));
  }

  update(headers: Headers): void {
    const limit = readNumber(headers, "X-RateLimit-Limit");
    const remaining = readNumber(headers, "X-RateLimit-Remaining");
    const reset = readNumber(headers, "X-RateLimit-Reset");

    if (limit !== undefined) this.limits.limit = limit;
    if (remaining !== undefined) this.limits.remaining = remaining;
    if (reset !== undefined) {
      this.limits.reset = reset;
      this.resetAt = this.toResetAt(reset);
    }
  }

  private async block(delay: number): Promise<void> {
    try {
      await this.sleep(delay);
    } finally {
      this.pause = undefined;
      this.resetAt = undefined;
      this.limits.remaining = undefined;
    }
  }

  private toResetAt(reset: number): number {
    if (reset > 1_000_000_000_000) return reset;
    if (reset > 1_000_000_000) return reset * 1000;
    return this.now() + reset * 1000;
  }
}
