import { describe, expect, test } from "bun:test";

import { ApiError, Evotor, NotInstalledError } from "../index.ts";
import type { v2 } from "../index.ts";
import { header, json, mockFetch } from "./mock-fetch.ts";

describe("API Облака V2 — заголовки и авторизация", () => {
  test("v2 отправляет Bearer-токен и тип содержимого vnd.evotor.v2", async () => {
    const { fetcher, calls } = mockFetch(json({ items: [], paging: {} }));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    await evotor.v2.stores.getStores();

    expect(header(calls[0]!.init, "Authorization")).toBe("Bearer test-token");
    expect(header(calls[0]!.init, "Accept")).toBe("application/vnd.evotor.v2+json");
    expect(header(calls[0]!.init, "Content-Type")).toBe("application/vnd.evotor.v2+json");
    expect(header(calls[0]!.init, "X-Authorization")).toBeNull();
  });

  test("v2 использует отдельный токен из опций", async () => {
    const { fetcher, calls } = mockFetch(json({ items: [], paging: {} }));
    const evotor = new Evotor("test-token", { fetch: fetcher, v2_token: "v2-token" });

    await evotor.v2.stores.getStores();

    expect(header(calls[0]!.init, "Authorization")).toBe("Bearer v2-token");
  });

  test("v1 продолжает работать с X-Authorization", async () => {
    const { fetcher, calls } = mockFetch(json([]));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    await evotor.v1.account.getStores();

    expect(header(calls[0]!.init, "X-Authorization")).toBe("test-token");
    expect(header(calls[0]!.init, "Content-Type")).toBe("application/json");
  });

  test("raw-клиенты доступны в обеих версиях", async () => {
    const { fetcher, calls } = mockFetch(json({ items: [], paging: {} }));
    const evotor = new Evotor("test-token", { fetch: fetcher });

    await evotor.v2.raw.get({ url: "/stores" });

    expect(calls[0]!.url).toBe("https://api.evotor.ru/stores");
    expect(header(calls[0]!.init, "Authorization")).toBe("Bearer test-token");
  });
});

describe("API Облака V2 — магазины и смарт-терминалы", () => {
  test("v2.stores.getStores возвращает items и paging", async () => {
    const stores: v2.Store[] = [
      {
        id: "20170228-F4F1-401B-80FA-9ECCA8451FFB",
        name: "Мой магазин",
        user_id: "00-000000000000000",
        created_at: "2018-04-17T10:11:49.393+0000",
        updated_at: "2018-07-16T16:00:10.663+0000",
      },
    ];
    const { fetcher, calls } = mockFetch(json({ items: stores, paging: { next_cursor: "next" } }));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    const result = await evotor.v2.stores.getStores({ cursor: "prev" });

    expect(result.items).toEqual(stores);
    expect(result.paging.next_cursor).toBe("next");
    expect(calls[0]!.url).toBe("https://api.evotor.ru/stores?cursor=prev");
  });

  test("v2.devices.getDevices запрашивает /devices", async () => {
    const { fetcher, calls } = mockFetch(json({ items: [], paging: {} }));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    await evotor.v2.devices.getDevices();

    expect(calls[0]!.url).toBe("https://api.evotor.ru/devices");
  });
});

describe("API Облака V2 — сотрудники", () => {
  test("v2.employees.getRoles", async () => {
    const { fetcher, calls } = mockFetch(json({ items: [{ id: "r-1", name: "Кассир" }], paging: {} }));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    const result = await evotor.v2.employees.getRoles();

    expect(result.items[0]!.name).toBe("Кассир");
    expect(calls[0]!.url).toBe("https://api.evotor.ru/employees/roles");
  });

  test("v2.employees.createEmployee отправляет тело запроса", async () => {
    const { fetcher, calls } = mockFetch(new Response(null, { status: 200 }));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    await evotor.v2.employees.createEmployee({
      phone: 79162869949,
      role_id: "role-1",
      name: "Иван",
      last_name: "Иванов",
      stores: ["store-1"],
    });

    expect(calls[0]!.url).toBe("https://api.evotor.ru/employees");
    expect(calls[0]!.init?.method).toBe("POST");
    expect(calls[0]!.init?.body).toBe(
      JSON.stringify({
        phone: 79162869949,
        role_id: "role-1",
        name: "Иван",
        last_name: "Иванов",
        stores: ["store-1"],
      }),
    );
  });

  test("v2.employees.updateEmployee кодирует идентификатор", async () => {
    const { fetcher, calls } = mockFetch(json({ name: "Иван", role_id: "role-1", stores: [] }));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    await evotor.v2.employees.updateEmployee("e/1", {
      name: "Иван",
      role_id: "role-1",
      stores: [],
    });

    expect(calls[0]!.url).toBe("https://api.evotor.ru/employees/e%2F1");
    expect(calls[0]!.init?.method).toBe("PUT");
  });
});

describe("API Облака V2 — документы", () => {
  test("v2.documents.getDocuments передаёт фильтры", async () => {
    const { fetcher, calls } = mockFetch(json({ items: [], paging: {} }));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    await evotor.v2.documents.getDocuments("s-1", {
      since: 1580202989617,
      until: 1580202989618,
      type: ["SELL", "RETURN"],
      cursor: "cur",
    });

    const url = new URL(calls[0]!.url);
    expect(url.pathname).toBe("/stores/s-1/documents");
    expect(url.searchParams.get("since")).toBe("1580202989617");
    expect(url.searchParams.get("until")).toBe("1580202989618");
    expect(url.searchParams.get("type")).toBe("SELL,RETURN");
    expect(url.searchParams.get("cursor")).toBe("cur");
  });

  test("v2.documents.getDeviceDocuments", async () => {
    const { fetcher, calls } = mockFetch(json({ items: [], paging: {} }));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    await evotor.v2.documents.getDeviceDocuments("s-1", "d-1");

    expect(calls[0]!.url).toBe("https://api.evotor.ru/stores/s-1/devices/d-1/documents");
  });
});

describe("API Облака V2 — товары и группы товаров", () => {
  test("v2.products.getProducts", async () => {
    const { fetcher, calls } = mockFetch(json({ items: [], paging: {} }));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    await evotor.v2.products.getProducts("s-1", {
      since: 1,
      isRemoved: true,
      fields: ["name", "price"],
    });

    const url = new URL(calls[0]!.url);
    expect(url.pathname).toBe("/stores/s-1/products");
    expect(url.searchParams.get("since")).toBe("1");
    expect(url.searchParams.get("isRemoved")).toBe("true");
    expect(url.searchParams.get("fields")).toBe("name,price");
  });

  test("v2.products.putProducts отправляет запрос как массовую операцию", async () => {
    const { fetcher, calls } = mockFetch(json({ id: "b-1", type: "product", status: "ACCEPTED" }));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    const task = await evotor.v2.products.putProducts("s-1", [
      { name: "Сидр", price: 123.12, measure_name: "шт", tax: "VAT_18", allow_to_sell: true, type: "NORMAL" },
    ]);

    expect(task.id).toBe("b-1");
    expect(calls[0]!.url).toBe("https://api.evotor.ru/stores/s-1/products");
    expect(calls[0]!.init?.method).toBe("PUT");
    expect(header(calls[0]!.init, "Content-Type")).toBe("application/vnd.evotor.v2+bulk+json");
  });

  test("v2.products.createProducts создаёт несколько товаров массовой операцией", async () => {
    const { fetcher, calls } = mockFetch(json({ id: "b-3", type: "product", status: "ACCEPTED" }));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    await evotor.v2.products.createProducts("s-1", [
      { name: "Сидр", price: 123.12, measure_name: "шт", tax: "VAT_18", allow_to_sell: true, type: "NORMAL" },
    ]);

    expect(calls[0]!.url).toBe("https://api.evotor.ru/stores/s-1/products");
    expect(calls[0]!.init?.method).toBe("POST");
    expect(header(calls[0]!.init, "Content-Type")).toBe("application/vnd.evotor.v2+bulk+json");
  });

  test("v2.products.patchProduct отправляет только изменяемые поля", async () => {
    const { fetcher, calls } = mockFetch(json({ id: "p-1", name: "Сидр" }));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    await evotor.v2.products.patchProduct("s-1", "p-1", { quantity: 12 });

    expect(calls[0]!.url).toBe("https://api.evotor.ru/stores/s-1/products/p-1");
    expect(calls[0]!.init?.method).toBe("PATCH");
    expect(calls[0]!.init?.body).toBe(JSON.stringify({ quantity: 12 }));
    expect(header(calls[0]!.init, "Content-Type")).toBe("application/vnd.evotor.v2+json");
  });

  test("v2.products.deleteProducts передаёт идентификаторы в query", async () => {
    const { fetcher, calls } = mockFetch(new Response(null, { status: 204 }));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    await evotor.v2.products.deleteProducts("s-1", ["p-1", "p-2"]);

    expect(calls[0]!.url).toBe("https://api.evotor.ru/stores/s-1/products?id=p-1%2Cp-2");
    expect(calls[0]!.init?.method).toBe("DELETE");
  });

  test("v2.product_groups.putProductGroups отправляет запрос как массовую операцию", async () => {
    const { fetcher, calls } = mockFetch(json({ id: "b-2", type: "product-group", status: "ACCEPTED" }));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    await evotor.v2.product_groups.putProductGroups("s-1", [{ name: "Группа" }]);

    expect(calls[0]!.url).toBe("https://api.evotor.ru/stores/s-1/product-groups");
    expect(header(calls[0]!.init, "Content-Type")).toBe("application/vnd.evotor.v2+bulk+json");
  });
});

describe("API Облака V2 — задачи, push-уведомления и события", () => {
  test("v2.bulks.getBulks передаёт фильтры", async () => {
    const { fetcher, calls } = mockFetch(json({ items: [], paging: {} }));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    await evotor.v2.bulks.getBulks({ type: ["product", "product-group"], status: "RUNNING" });

    const url = new URL(calls[0]!.url);
    expect(url.pathname).toBe("/bulks");
    expect(url.searchParams.get("type")).toBe("product,product-group");
    expect(url.searchParams.get("status")).toBe("RUNNING");
  });

  test("v2.push.sendPushToDevice", async () => {
    const { fetcher, calls } = mockFetch(json({ id: "p-1", status: "ACCEPTED", details: [] }));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    await evotor.v2.push.sendPushToDevice("app-1", "d-1", { payload: { type: "open" } });

    expect(calls[0]!.url).toBe("https://api.evotor.ru/api/apps/app-1/devices/d-1/push-notifications");
    expect(calls[0]!.init?.method).toBe("POST");
  });

  test("v2.events.getEvents передаёт тип и границы выборки", async () => {
    const { fetcher, calls } = mockFetch(json({ items: [], paging: {} }));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    await evotor.v2.events.getEvents("app-1", { type: "Document", since: 1, until: 2, limit: 10 });

    const url = new URL(calls[0]!.url);
    expect(url.pathname).toBe("/apps/app-1/events");
    expect(url.searchParams.get("type")).toBe("Document");
    expect(url.searchParams.get("since")).toBe("1");
    expect(url.searchParams.get("until")).toBe("2");
    expect(url.searchParams.get("limit")).toBe("10");
  });
});

describe("API Облака V2 — остальные методы", () => {
  const product: v2.Product = {
    type: "NORMAL",
    name: "Сидр",
    price: 123.12,
    measure_name: "шт",
    tax: "VAT_18",
    allow_to_sell: true,
  };

  test("v2.employees.getEmployees и getEmployee", async () => {
    const employee: v2.Employee = {
      id: "e-1",
      name: "Иван",
      stores: [],
      role: "ADMIN",
      role_id: "r-1",
      user_id: "u-1",
      created_at: "2024-01-01T00:00:00.000+0000",
      updated_at: "2024-01-01T00:00:00.000+0000",
    };
    const { fetcher, calls } = mockFetch(json({ items: [employee], paging: {} }), json(employee));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    expect((await evotor.v2.employees.getEmployees()).items).toEqual([employee]);
    expect((await evotor.v2.employees.getEmployee("e/1")).id).toBe("e-1");

    expect(calls[0]!.url).toBe("https://api.evotor.ru/employees");
    expect(calls[1]!.url).toBe("https://api.evotor.ru/employees/e%2F1");
  });

  test("v2.documents.getDocument", async () => {
    const { fetcher, calls } = mockFetch(json({ id: "d-1", type: "SELL" }));

    const evotor = new Evotor("test-token", { fetch: fetcher });
    await evotor.v2.documents.getDocument("s-1", "d-1");

    expect(calls[0]!.url).toBe("https://api.evotor.ru/stores/s-1/documents/d-1");
    expect(calls[0]!.init?.method).toBe("GET");
  });

  test("v2.products.getProduct, createProduct, putProduct и deleteProduct", async () => {
    const { fetcher, calls } = mockFetch(
      json(product),
      json(product),
      json(product),
      new Response(null, { status: 204 }),
    );

    const evotor = new Evotor("test-token", { fetch: fetcher });
    await evotor.v2.products.getProduct("s-1", "p-1");
    await evotor.v2.products.createProduct("s-1", product);
    await evotor.v2.products.putProduct("s-1", "p-1", product);
    await evotor.v2.products.deleteProduct("s-1", "p-1");

    expect(calls[0]!.url).toBe("https://api.evotor.ru/stores/s-1/products/p-1");
    expect(calls[0]!.init?.method).toBe("GET");
    expect(calls[1]!.url).toBe("https://api.evotor.ru/stores/s-1/products");
    expect(calls[1]!.init?.method).toBe("POST");
    expect(header(calls[1]!.init, "Content-Type")).toBe("application/vnd.evotor.v2+json");
    expect(calls[2]!.init?.method).toBe("PUT");
    expect(calls[3]!.init?.method).toBe("DELETE");
  });

  test("v2.product_groups — полный набор методов", async () => {
    const group: v2.ProductGroup = { id: "g-1", name: "Группа" };
    const { fetcher, calls } = mockFetch(
      json({ items: [group], paging: {} }),
      json(group),
      json(group),
      json(group),
      json(group),
      json({ id: "b-1", type: "product-group", status: "ACCEPTED" }),
      new Response(null, { status: 204 }),
      new Response(null, { status: 204 }),
    );

    const evotor = new Evotor("test-token", { fetch: fetcher });
    await evotor.v2.product_groups.getProductGroups("s-1", { cursor: "cur" });
    await evotor.v2.product_groups.getProductGroup("s-1", "g-1");
    await evotor.v2.product_groups.createProductGroup("s-1", group);
    await evotor.v2.product_groups.putProductGroup("s-1", "g-1", group);
    await evotor.v2.product_groups.patchProductGroup("s-1", "g-1", { name: "Новое" });
    await evotor.v2.product_groups.createProductGroups("s-1", [group]);
    await evotor.v2.product_groups.deleteProductGroups("s-1", ["g-1", "g-2"]);
    await evotor.v2.product_groups.deleteProductGroup("s-1", "g-1");

    const base = "https://api.evotor.ru/stores/s-1/product-groups";
    expect(calls[0]!.url).toBe(`${base}?cursor=cur`);
    expect(calls[1]!.url).toBe(`${base}/g-1`);
    expect(calls[2]!.init?.method).toBe("POST");
    expect(calls[3]!.init?.method).toBe("PUT");
    expect(calls[4]!.init?.method).toBe("PATCH");
    expect(calls[4]!.init?.body).toBe(JSON.stringify({ name: "Новое" }));
    expect(header(calls[5]!.init, "Content-Type")).toBe("application/vnd.evotor.v2+bulk+json");
    expect(calls[6]!.url).toBe(`${base}?id=g-1%2Cg-2`);
    expect(calls[7]!.init?.method).toBe("DELETE");
  });

  test("v2.bulks.getBulk, v2.push.getPush, v2.push.sendPush и v2.events.getEvent", async () => {
    const push: v2.PushNotification = { id: "p-1", status: "ACCEPTED", modified_at: "2024-01-01", details: [] };
    const { fetcher, calls } = mockFetch(
      json({ id: "b-1", type: "product", status: "RUNNING" }),
      json(push),
      json(push),
      json({ id: "ev-1", timestamp: 1, type: "Document", source: "DEVICE", action: "created", payload: {} }),
    );

    const evotor = new Evotor("test-token", { fetch: fetcher });
    await evotor.v2.bulks.getBulk("b/1");
    await evotor.v2.push.getPush("app-1", "p-1");
    await evotor.v2.push.sendPush("app-1", { devices: ["d-1"], payload: { type: "open" } });
    await evotor.v2.events.getEvent("app-1", "ev-1");

    expect(calls[0]!.url).toBe("https://api.evotor.ru/bulks/b%2F1");
    expect(calls[1]!.url).toBe("https://api.evotor.ru/api/apps/app-1/push-notifications/p-1");
    expect(calls[2]!.url).toBe("https://api.evotor.ru/api/apps/app-1/push-notifications");
    expect(calls[2]!.init?.method).toBe("POST");
    expect(calls[3]!.url).toBe("https://api.evotor.ru/apps/app-1/events/ev-1");
  });
});

describe("API Облака V2 — ошибки", () => {
  test("402 выбрасывает NotInstalledError", async () => {
    const body = [
      {
        code: "not_installed",
        message: "application is not paid/installed on all devices in store {store_id}",
        violations: [{ reason: "app is not paid/installed on device", subject: "device-1" }],
      },
    ];
    const { fetcher } = mockFetch(json(body, { status: 402 }));

    const evotor = new Evotor("test-token", { fetch: fetcher });

    await expect(evotor.v2.stores.getStores()).rejects.toBeInstanceOf(NotInstalledError);
  });

  test("тело ошибки-массив выбрасывает ApiError", async () => {
    const body = [{ code: "invalid_request", message: "неверный запрос" }];
    const { fetcher } = mockFetch(json(body, { status: 400 }));

    const evotor = new Evotor("test-token", { fetch: fetcher });

    await expect(evotor.v2.stores.getStores()).rejects.toBeInstanceOf(ApiError);
  });

  test("тело ошибки-объект V2 сохраняется в ApiError", async () => {
    const body = { code: "not_found", message: "документ не найден" };
    const { fetcher } = mockFetch(json(body, { status: 404, statusText: "Not Found" }));

    const evotor = new Evotor("test-token", { fetch: fetcher });

    try {
      await evotor.v2.documents.getDocument("s-1", "d-1");
      throw new Error("Expected ApiError");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(404);
      expect((error as ApiError).response).toEqual(body);
      expect((error as ApiError).message).toBe("404 Not Found: документ не найден");
    }
  });
});
