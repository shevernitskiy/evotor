import { expect, test } from "bun:test";

import { ApiError, AuthError, Evotor, HttpError } from "../index.ts";
import { json, mockFetch } from "./mock-fetch.ts";

test("401 и 403 выбрасывают AuthError", async () => {
  const { fetcher } = mockFetch(
    json({ message: "unauthorized" }, { status: 401, statusText: "Unauthorized" }),
    json({ message: "forbidden" }, { status: 403, statusText: "Forbidden" }),
  );
  const evotor = new Evotor("test-token", { fetch: fetcher });

  try {
    await evotor.account.getStores();
    throw new Error("Expected AuthError");
  } catch (error) {
    expect(error).toBeInstanceOf(AuthError);
    expect((error as AuthError).response).toEqual({ message: "unauthorized" });
  }

  try {
    await evotor.account.getStores();
    throw new Error("Expected AuthError");
  } catch (error) {
    expect(error).toBeInstanceOf(AuthError);
    expect((error as AuthError).response).toEqual({ message: "forbidden" });
  }
});

test("ответ с errors выбрасывает ApiError", async () => {
  const body = { errors: [{ code: 2001, reason: "Ошибка в запросе" }] };
  const { fetcher } = mockFetch(json(body, { status: 400, statusText: "Bad Request" }));
  const evotor = new Evotor("test-token", { fetch: fetcher });

  try {
    await evotor.account.getStores();
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
    await evotor.account.getStores();
    throw new Error("Expected HttpError");
  } catch (error) {
    expect(error).toBeInstanceOf(HttpError);
    expect((error as HttpError).message).toBe("Internal Server Error");
  }
});

test("пустой ответ без содержимого возвращает undefined", async () => {
  const { fetcher } = mockFetch(new Response(null, { status: 204 }));
  const evotor = new Evotor("test-token", { fetch: fetcher });

  expect(await evotor.products.uploadProducts("s-1", [])).toBeUndefined();
});

test("пустой токен не принимается", () => {
  expect(() => new Evotor("   ")).toThrow(TypeError);
});
