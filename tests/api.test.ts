import { describe, expect, test } from "bun:test";

import { Evotor } from "../index.ts";
import type { v1 } from "../index.ts";
import { header, json, mockFetch } from "./mock-fetch.ts";

describe("Сущности пользователя Эвотор", () => {
  test("v1.account.getStores", async () => {
    const stores: v1.Store[] = [{ uuid: "s-1", name: "Магазин" }];
    const { fetcher, calls } = mockFetch(json(stores));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    expect(await evotor.v1.account.getStores()).toEqual(stores);
    expect(calls.length).toBe(1);
    expect(calls[0]!.url).toBe("https://api.evotor.ru/api/v1/inventories/stores/search");
    expect(calls[0]!.init?.method).toBe("GET");
    expect(header(calls[0]!.init, "X-Authorization")).toBe("test-token");
    expect(calls[0]!.init?.body).toBeUndefined();
  });

  test("v1.account.getEmployees", async () => {
    const employees: v1.Employee[] = [{ uuid: "e-1", name: "Иван", role: "ADMIN", stores: ["s-1"] }];
    const { fetcher, calls } = mockFetch(json(employees));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    expect(await evotor.v1.account.getEmployees()).toEqual(employees);
    expect(calls[0]!.url).toBe("https://api.evotor.ru/api/v1/inventories/employees/search");
    expect(calls[0]!.init?.method).toBe("GET");
  });

  test("v1.account.getDevices", async () => {
    const devices: v1.Device[] = [{ uuid: "d-1", code: "01", name: "Смарт-терминал", storeUuid: "s-1" }];
    const { fetcher, calls } = mockFetch(json(devices));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    expect(await evotor.v1.account.getDevices()).toEqual(devices);
    expect(calls[0]!.url).toBe("https://api.evotor.ru/api/v1/inventories/devices/search");
    expect(calls[0]!.init?.method).toBe("GET");
  });
});

describe("Товары и документы", () => {
  test("v1.products.getProducts кодирует storeUuid", async () => {
    const products: v1.Product[] = [{ uuid: "p-1", name: "Товар", group: false }];
    const { fetcher, calls } = mockFetch(json(products));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    expect(await evotor.v1.products.getProducts("store/1")).toEqual(products);
    expect(calls[0]!.url).toBe("https://api.evotor.ru/api/v1/inventories/stores/store%2F1/products");
    expect(calls[0]!.init?.method).toBe("GET");
  });

  test("v1.products.uploadProducts отправляет массив товаров", async () => {
    const products: v1.Product[] = [{ uuid: "p-1", name: "Товар", group: false }];
    const { fetcher, calls } = mockFetch(new Response(null, { status: 204 }));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    expect(await evotor.v1.products.uploadProducts("s-1", products)).toBeUndefined();
    expect(calls[0]!.url).toBe("https://api.evotor.ru/api/v1/inventories/stores/s-1/products");
    expect(calls[0]!.init?.method).toBe("POST");
    expect(header(calls[0]!.init, "Content-Type")).toBe("application/json");
    expect(calls[0]!.init?.body).toBe(JSON.stringify(products));
  });

  test("v1.products.deleteProducts использует POST /products/delete", async () => {
    const products = [{ uuid: "p-1" }];
    const { fetcher, calls } = mockFetch(new Response(null, { status: 204 }));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    expect(await evotor.v1.products.deleteProducts("s-1", products)).toBeUndefined();
    expect(calls[0]!.url).toBe("https://api.evotor.ru/api/v1/inventories/stores/s-1/products/delete");
    expect(calls[0]!.init?.method).toBe("POST");
    expect(calls[0]!.init?.body).toBe(JSON.stringify(products));
  });

  test("v1.products.getDocuments передаёт фильтры", async () => {
    const { fetcher, calls } = mockFetch(json([{ uuid: "doc-1" }]));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    await evotor.v1.products.getDocuments("s-1", {
      deviceUuid: "device-1",
      ltCloseDate: "2024-02-01T00:00:00Z",
      gtCloseDate: "2024-01-01T00:00:00Z",
      types: ["SELL", "RETURN"],
    });

    const url = new URL(calls[0]!.url);
    expect(url.pathname).toBe("/api/v1/inventories/stores/s-1/documents");
    expect(url.searchParams.get("deviceUuid")).toBe("device-1");
    expect(url.searchParams.get("ltCloseDate")).toBe("2024-02-01T00:00:00Z");
    expect(url.searchParams.get("gtCloseDate")).toBe("2024-01-01T00:00:00Z");
    expect(url.searchParams.get("types")).toBe("SELL,RETURN");
    expect(calls[0]!.init?.method).toBe("GET");
  });

  test("v1.products.getDocuments без параметров не добавляет query", async () => {
    const { fetcher, calls } = mockFetch(json([]));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    await evotor.v1.products.getDocuments("s-1");

    expect(calls[0]!.url).toBe("https://api.evotor.ru/api/v1/inventories/stores/s-1/documents");
  });
});

describe("Схемы и дополнительные поля товаров", () => {
  test("v1.products.getSchemes", async () => {
    const { fetcher, calls } = mockFetch(json([{ uuid: "schema-1", appId: "app-1", items: [] }]));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    expect(await evotor.v1.products.getSchemes("s-1")).toEqual([{ uuid: "schema-1", appId: "app-1", items: [] }]);
    expect(calls[0]!.url).toBe("https://api.evotor.ru/api/v1/inventories/stores/s-1/products/schemes");
    expect(calls[0]!.init?.method).toBe("GET");
  });

  test("v1.products.uploadSchemes", async () => {
    const schemes = [{ uuid: "schema-1", appId: "app-1", items: [] }];
    const { fetcher, calls } = mockFetch(new Response(null, { status: 204 }));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    expect(await evotor.v1.products.uploadSchemes("s-1", schemes)).toBeUndefined();
    expect(calls[0]!.url).toBe("https://api.evotor.ru/api/v1/inventories/stores/s-1/products/schemes");
    expect(calls[0]!.init?.method).toBe("POST");
    expect(calls[0]!.init?.body).toBe(JSON.stringify(schemes));
  });

  test("v1.products.deleteSchemes", async () => {
    const { fetcher, calls } = mockFetch(new Response(null, { status: 204 }));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    expect(await evotor.v1.products.deleteSchemes("s-1", ["schema-1"])).toBeUndefined();
    expect(calls[0]!.url).toBe("https://api.evotor.ru/api/v1/inventories/stores/s-1/products/schemes/delete");
    expect(calls[0]!.init?.method).toBe("POST");
    expect(calls[0]!.init?.body).toBe(JSON.stringify(["schema-1"]));
  });

  test("v1.products.getExtras", async () => {
    const { fetcher, calls } = mockFetch(json([{ uuid: "extra-1" }]));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    expect(await evotor.v1.products.getExtras("s-1")).toEqual([{ uuid: "extra-1" }]);
    expect(calls[0]!.url).toBe("https://api.evotor.ru/api/v1/inventories/stores/s-1/products/extras");
    expect(calls[0]!.init?.method).toBe("GET");
  });

  test("v1.products.uploadExtras", async () => {
    const extras = [{ uuid: "extra-1" }];
    const { fetcher, calls } = mockFetch(new Response(null, { status: 204 }));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    expect(await evotor.v1.products.uploadExtras("s-1", extras)).toBeUndefined();
    expect(calls[0]!.url).toBe("https://api.evotor.ru/api/v1/inventories/stores/s-1/products/extras");
    expect(calls[0]!.init?.method).toBe("POST");
    expect(calls[0]!.init?.body).toBe(JSON.stringify(extras));
  });

  test("v1.products.deleteExtras", async () => {
    const { fetcher, calls } = mockFetch(new Response(null, { status: 204 }));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    expect(await evotor.v1.products.deleteExtras("s-1", ["extra-1"])).toBeUndefined();
    expect(calls[0]!.url).toBe("https://api.evotor.ru/api/v1/inventories/stores/s-1/products/extras/delete");
    expect(calls[0]!.init?.method).toBe("POST");
    expect(calls[0]!.init?.body).toBe(JSON.stringify(["extra-1"]));
  });
});

describe("Данные ОФД", () => {
  test("v1.ofd.getStores", async () => {
    const data = { version: 2, provider: "OFD", data: [{ id: 1, parentId: 2, name: "Шаркон" }] };
    const { fetcher, calls } = mockFetch(json(data));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    expect(await evotor.v1.ofd.getStores()).toEqual(data);
    expect(calls[0]!.url).toBe("https://api.evotor.ru/api/v1/ofd/stores");
    expect(calls[0]!.init?.method).toBe("GET");
  });

  test("v1.ofd.getDevices", async () => {
    const data = { version: 2, provider: "OFD", data: [{ id: 1, storeId: 2, name: "Касса" }] };
    const { fetcher, calls } = mockFetch(json(data));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    expect(await evotor.v1.ofd.getDevices()).toEqual(data);
    expect(calls[0]!.url).toBe("https://api.evotor.ru/api/v1/ofd/devices");
    expect(calls[0]!.init?.method).toBe("GET");
  });

  test("v1.ofd.getDocuments передаёт storeId и параметры выборки", async () => {
    const { fetcher, calls } = mockFetch(json({ version: 2, provider: "OFD", data: [] }));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    await evotor.v1.ofd.getDocuments("1111", {
      deviceId: "2222",
      from: "2000-01-01T00:00:00.000+03:00",
      to: "2000-01-02T00:00:00.000+03:00",
      type: "SELL",
    });

    const url = new URL(calls[0]!.url);
    expect(url.pathname).toBe("/api/v1/ofd/documents/1111");
    expect(url.searchParams.get("deviceId")).toBe("2222");
    expect(url.searchParams.get("from")).toBe("2000-01-01T00:00:00.000+03:00");
    expect(url.searchParams.get("to")).toBe("2000-01-02T00:00:00.000+03:00");
    expect(url.searchParams.get("type")).toBe("SELL");
  });

  test("v1.ofd использует отдельный токен ОФД", async () => {
    const { fetcher, calls } = mockFetch(json({ version: 2, provider: "OFD", data: [] }));
    const evotor = new Evotor("test-token", { fetch: fetcher, ofd_token: "ofd-token" });

    await evotor.v1.ofd.getStores();

    expect(header(calls[0]!.init, "X-Authorization")).toBe("ofd-token");
  });
});
