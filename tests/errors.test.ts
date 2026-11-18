import { expect, test } from "bun:test";

import { ApiError, AuthError, Evotor, HttpError } from "../index.ts";
import { header, json, mockFetch } from "./mock-fetch.ts";

test("401 и 403 выбрасывают AuthError", async () => {
  const { fetcher } = mockFetch(
    json({ message: "unauthorized" }, { status: 401, statusText: "Unauthorized" }),
    json({ message: "forbidden" }, { status: 403, statusText: "Forbidden" }),
  );
  const evotor = new Evotor("test-token", { fetch: fetcher });

  try {
    await evotor.v1.account.getStores();
    throw new Error("Expected AuthError");
  } catch (error) {
    expect(error).toBeInstanceOf(AuthError);
    expect((error as AuthError).status).toBe(401);
    expect((error as AuthError).response).toEqual({ message: "unauthorized" });
  }

  try {
    await evotor.v1.account.getStores();
    throw new Error("Expected AuthError");
  } catch (error) {
    expect(error).toBeInstanceOf(AuthError);
    expect((error as AuthError).status).toBe(403);
    expect((error as AuthError).response).toEqual({ message: "forbidden" });
  }
});

test("ответ с errors выбрасывает ApiError", async () => {
  const body = { errors: [{ code: 2001, reason: "Ошибка в запросе" }] };
  const { fetcher } = mockFetch(json(body, { status: 400, statusText: "Bad Request" }));
  const evotor = new Evotor("test-token", { fetch: fetcher });

  try {
    await evotor.v1.account.getStores();
    throw new Error("Expected ApiError");
  } catch (error) {
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).response).toEqual(body);
  }
});

test("ошибка без json выбрасывает HttpError", async () => {
  const { fetcher } = mockFetch(new Response("Internal Server Error", { status: 500 }));
  const evotor = new Evotor("test-token", { fetch: fetcher });

  try {
    await evotor.v1.account.getStores();
    throw new Error("Expected HttpError");
  } catch (error) {
    expect(error).toBeInstanceOf(HttpError);
    expect((error as HttpError).status).toBe(500);
    expect((error as HttpError).response).toBe("Internal Server Error");
    expect((error as HttpError).message).toBe("Internal Server Error");
  }
});

test("не-JSON ответ на успешный запрос выбрасывает HttpError", async () => {
  const { fetcher } = mockFetch(new Response("<html></html>", { status: 200 }));
  const evotor = new Evotor("test-token", { fetch: fetcher });

  await expect(evotor.v1.account.getStores()).rejects.toBeInstanceOf(HttpError);
});

test("базовый адрес можно переопределить", async () => {
  const { fetcher, calls } = mockFetch(json([]));
  const evotor = new Evotor("test-token", { fetch: fetcher, base_url: "https://proxy.local/" });

  await evotor.v1.account.getStores();

  expect(calls[0]!.url).toBe("https://proxy.local/api/v1/inventories/stores/search");
});

test("заголовки из опций переопределяют заголовки по умолчанию", async () => {
  const { fetcher, calls } = mockFetch(json([]));
  const evotor = new Evotor("test-token", {
    fetch: fetcher,
    headers: { "X-Custom": "1", "X-Authorization": "override" },
  });

  await evotor.v1.account.getStores();

  expect(header(calls[0]!.init, "X-Custom")).toBe("1");
  expect(header(calls[0]!.init, "X-Authorization")).toBe("override");
});

test("таймаут и сигнал передаются в fetch", async () => {
  const { fetcher, calls } = mockFetch(json([]));
  const controller = new AbortController();
  const evotor = new Evotor("test-token", { fetch: fetcher, timeout: 1000, signal: controller.signal });

  await evotor.v1.account.getStores();

  expect(calls[0]!.init?.signal).toBeInstanceOf(AbortSignal);
});

test("некорректный таймаут не принимается", () => {
  expect(() => new Evotor("test-token", { timeout: 0 })).toThrow(TypeError);
  expect(() => new Evotor("test-token", { timeout: Number.NaN })).toThrow(TypeError);
});

test("пустой ответ без содержимого возвращает undefined", async () => {
  const { fetcher } = mockFetch(new Response(null, { status: 204 }));
  const evotor = new Evotor("test-token", { fetch: fetcher });

  expect(await evotor.v1.products.uploadProducts("s-1", [])).toBeUndefined();
});

test("пустой токен не принимается", () => {
  expect(() => new Evotor("   ")).toThrow(TypeError);
});
