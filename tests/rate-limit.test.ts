import { expect, test } from "bun:test";

import { Evotor } from "../index.ts";
import { RateLimiter } from "../src/core/rate-limiter.ts";
import { json, mockFetch } from "./mock-fetch.ts";

test("клиент ждёт до reset, когда предыдущий ответ исчерпал лимит", async () => {
  const { fetcher, calls } = mockFetch(
    json([], { headers: { "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": "0.05" } }),
    json([]),
  );
  const evotor = new Evotor("test-token", { fetch: fetcher });

  const started = Date.now();
  await evotor.account.getStores();
  await evotor.account.getStores();

  expect(calls.length).toBe(2);
  expect(Date.now() - started).toBeGreaterThanOrEqual(40);
});

test("лимитер ждёт до reset, когда запросов не осталось", async () => {
  const sleeps: number[] = [];
  let now = 1_700_000_000_000;
  const limiter = new RateLimiter({
    now: () => now,
    sleep: async (milliseconds) => {
      sleeps.push(milliseconds);
      now += milliseconds;
    },
  });
  limiter.update(
    new Headers({
      "X-RateLimit-Limit": "100",
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": "2",
    }),
  );

  expect(limiter.state).toEqual({ limit: 100, remaining: 0, reset: 2 });

  await limiter.wait();

  expect(sleeps).toEqual([2000]);
  expect(limiter.state.remaining).toBeUndefined();
});

test("параллельные ожидания используют один таймер", async () => {
  const sleeps: number[] = [];
  let now = 1_700_000_000_000;
  const limiter = new RateLimiter({
    now: () => now,
    sleep: async (milliseconds) => {
      sleeps.push(milliseconds);
      now += milliseconds;
    },
  });
  limiter.update(new Headers({ "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": "2" }));

  const first = limiter.wait();
  const second = limiter.wait();

  expect(first).toBe(second);
  await Promise.all([first, second]);
  expect(sleeps).toEqual([2000]);
});

test("лимитер не ждёт и не создаёт promise, когда запросы доступны", async () => {
  const sleeps: number[] = [];
  const limiter = new RateLimiter({
    now: () => 1_700_000_000_000,
    sleep: async (milliseconds) => {
      sleeps.push(milliseconds);
    },
  });
  limiter.update(new Headers({ "X-RateLimit-Remaining": "10", "X-RateLimit-Reset": "2" }));

  expect(limiter.wait()).toBeUndefined();
  expect(sleeps).toEqual([]);
});

test("пустые заголовки rate limit игнорируются", () => {
  const limiter = new RateLimiter({ now: () => 0, sleep: async () => {} });
  limiter.update(
    new Headers({
      "X-RateLimit-Limit": "",
      "X-RateLimit-Remaining": "",
      "X-RateLimit-Reset": "",
    }),
  );

  expect(limiter.state).toEqual({ limit: undefined, remaining: undefined, reset: undefined });
  expect(limiter.wait()).toBeUndefined();
});

test("state отдаёт одну и ту же ссылку", () => {
  const limiter = new RateLimiter();

  expect(limiter.state).toBe(limiter.state);
});

test("лимитер понимает reset как unix timestamp в секундах", async () => {
  const sleeps: number[] = [];
  const now = 1_700_000_000_000;
  const limiter = new RateLimiter({
    now: () => now,
    sleep: async (milliseconds) => {
      sleeps.push(milliseconds);
    },
  });
  limiter.update(
    new Headers({
      "X-RateLimit-Remaining": "0",
      "X-RateLimit-Reset": String(now / 1000 + 60),
    }),
  );

  await limiter.wait();

  expect(sleeps).toEqual([60_000]);
});
