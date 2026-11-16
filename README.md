# 🧾 Evotor

[![npm](https://img.shields.io/npm/v/@shevernitskiy/evotor?logo=npm&style=flat&labelColor=000)](https://www.npmjs.com/package/@shevernitskiy/evotor)
[![JSR](https://jsr.io/badges/@shevernitskiy/evotor)](https://jsr.io/@shevernitskiy/evotor)
![bun](https://img.shields.io/badge/bun-1.4.4-black?style=flat&logo=bun&logoColor=white)
![dependencies](https://img.shields.io/badge/dependencies-0-green?style=flat&labelColor=000)
![types](https://img.shields.io/badge/types-TypeScript-blue?style=flat&labelColor=000)
[![license](https://img.shields.io/github/license/shevernitskiy/evotor?style=flat&labelColor=000)](https://github.com/shevernitskiy/evotor/blob/main/LICENSE)

A thin, fully-typed TypeScript client for the [Evotor Cloud](https://developer.evotor.ru/docs/rest_overview.html) REST API.

Zero dependencies, works on any runtime with a standard `fetch` (Node 18+, Bun, Deno).

- Typed entities, requests and responses — no `any`, no manual casts;
- Two versions of the Cloud API: `v1` (legacy reference) and `v2` (current reference);
- Sections mirroring the official docs of each version;
- Automatic rate-limit handling based on the `X-RateLimit-*` headers;
- Typed webhook payloads for every incoming webhook;
- Pluggable `fetch` — easy to test and to use in mock environments.

> [!NOTE]
> The library covers the endpoints that are part of the public Evotor Cloud API. If something is missing or
> mistyped, please open an issue or send a PR — contributions are welcome.

---

## 📊 Progress

### Library

- [x] npm & JSR publishing
- [x] Zero dependencies
- [x] TypeScript types for entities, requests and responses
- [x] Typed webhook payloads
- [x] Rate limit handling
- [x] Typed errors
- [x] Tests (on a replaced `fetch`)
- [x] README

### API

- [x] V1 — Account — stores, employees, devices
- [x] V1 — Products — get / upload / delete
- [x] V1 — Documents — get
- [x] V1 — Product schemes — get / upload / delete
- [x] V1 — Product extras — get / upload / delete
- [x] V1 — OFD — stores, devices, documents
- [x] V2 — Stores, devices, employees
- [x] V2 — Documents, products, product groups
- [x] V2 — Bulk tasks, push notifications, application events
- [ ] Webhook handling (receiving side)
- [ ] Token refresh / OAuth flow

---

## 📦 Installation

### npm

```bash
npm install @shevernitskiy/evotor
```

### JSR (Bun / Deno / any JSR-compatible runtime)

```bash
bun add jsr:@shevernitskiy/evotor
deno add jsr:@shevernitskiy/evotor
```

```ts
import { Evotor } from "@shevernitskiy/evotor";
```

---

## 🚀 Quick start

```ts
import { Evotor } from "@shevernitskiy/evotor";

const evotor = new Evotor(token);

// V1 — legacy reference
const stores = await evotor.v1.account.getStores();
const employees = await evotor.v1.account.getEmployees();
const devices = await evotor.v1.account.getDevices();

const products = await evotor.v1.products.getProducts(stores[0]!.uuid);
const documents = await evotor.v1.products.getDocuments(stores[0]!.uuid, {
  types: ["SELL"],
});

// V2 — current reference
const v2Stores = await evotor.v2.stores.getStores();
const v2Products = await evotor.v2.products.getProducts(v2Stores.items[0]!.id);
```

The client is created with a **token** that is passed in the `X-Authorization` header on every request.
Tokens are issued per application in the Evotor developer account.

---

## 🏗️ Client structure

```ts
const evotor = new Evotor(token, options);

evotor.v1.account;   // Сущности пользователя: магазины, сотрудники, смарт-терминалы
evotor.v1.products;  // Товары, документы, схемы и дополнительные поля
evotor.v1.ofd;       // Данные ОФД: магазины, смарт-терминалы, документы
evotor.v1.raw;       // Кастомные запросы к Облаку Эвотор V1
evotor.v1.ofd_raw;   // Кастомные запросы к ОФД

evotor.v2.stores;          // Магазины
evotor.v2.devices;         // Смарт-терминалы
evotor.v2.employees;       // Сотрудники
evotor.v2.documents;       // Документы
evotor.v2.products;        // Товары и модификации товаров
evotor.v2.product_groups;  // Группы товаров и группы модификаций
evotor.v2.bulks;           // Задачи для массовых операций
evotor.v2.push;            // Push-уведомления
evotor.v2.events;          // События приложения
evotor.v2.raw;             // Кастомные запросы к API Облака Эвотор V2
```

Each section is a separate class with methods named after the API operation, so the code reads like the docs.
The sections of each version mirror the sections of the corresponding documentation:

- V1 — [api.evotor.ru/docs](https://api.evotor.ru/docs/);
- V2 — [developer.evotor.ru/docs](https://developer.evotor.ru/docs/rest_overview.html).

### Constructor options

```ts
const evotor = new Evotor(token, {
  ofd_token: ofdToken,
  v2_token: v2Token,
  fetch: mockFetch,
});
```

| Option      | Type              | Description                                                                                   |
| ----------- | ----------------- | --------------------------------------------------------------------------------------------- |
| `ofd_token` | `string`          | Token for the OFD section. If omitted, the main token is used.                                |
| `v2_token`  | `string`          | Token for API Cloud V2. If omitted, the main token is used.                                   |
| `fetch`     | `typeof fetch`    | Replaces the global `fetch` — useful for tests, mocks and custom transports (proxy, retries).  |

> [!NOTE]
> V1 requests are authorized with the `X-Authorization` header, V2 requests — with `Authorization: Bearer <token>`
> and the `Accept`/`Content-Type` headers `application/vnd.evotor.v2+json`.

---

## 📚 API V1

### `v1.account` — user entities

| Method          | Endpoint                                      |
| --------------- | --------------------------------------------- |
| `getStores()`   | `GET /api/v1/inventories/stores/search`       |
| `getEmployees()`| `GET /api/v1/inventories/employees/search`    |
| `getDevices()`  | `GET /api/v1/inventories/devices/search`      |

```ts
const stores = await evotor.v1.account.getStores();
console.log(stores[0]?.name, stores[0]?.uuid);
```

### `v1.products` — products, documents, schemes and extras

| Method                                        | Endpoint                                                    |
| --------------------------------------------- | ----------------------------------------------------------- |
| `getProducts(storeUuid)`                      | `GET /api/v1/inventories/stores/{storeUuid}/products`         |
| `uploadProducts(storeUuid, products)`         | `POST /api/v1/inventories/stores/{storeUuid}/products`        |
| `deleteProducts(storeUuid, products)`         | `POST /api/v1/inventories/stores/{storeUuid}/products/delete` |
| `getDocuments(storeUuid, params?)`            | `GET /api/v1/inventories/stores/{storeUuid}/documents`        |
| `getSchemes(storeUuid)`                       | `GET /api/v1/inventories/stores/{storeUuid}/products/schemes` |
| `uploadSchemes(storeUuid, schemas)`           | `POST /api/v1/inventories/stores/{storeUuid}/products/schemes`|
| `deleteSchemes(storeUuid, schemas)`           | `POST /api/v1/inventories/stores/{storeUuid}/products/schemes/delete` |
| `getExtras(storeUuid)`                        | `GET /api/v1/inventories/stores/{storeUuid}/products/extras`  |
| `uploadExtras(storeUuid, extras)`             | `POST /api/v1/inventories/stores/{storeUuid}/products/extras` |
| `deleteExtras(storeUuid, extras)`             | `POST /api/v1/inventories/stores/{storeUuid}/products/extras/delete` |

```ts
// Загрузка товаров: при обновлении передаётся полный набор полей описания товара.
await evotor.v1.products.uploadProducts(storeUuid, [
  {
    uuid: "4b77d9a7-568d-4830-aecc-c67fe87fe96f",
    group: false,
    name: "Молоко 3.2% 1 л",
    price: 120,
    tax: "VAT_10",
    measureName: "шт",
    allowToSell: true,
  },
]);

// Удаление: пустой массив удаляет все товары магазина.
await evotor.v1.products.deleteProducts(storeUuid, [{ uuid: "4b77d9a7-568d-4830-aecc-c67fe87fe96f" }]);
```

> [!IMPORTANT]
> When updating a product you must send the **full** set of fields — Evotor removes the old ones and writes the new ones.

**Documents selection**

```ts
const documents = await evotor.v1.products.getDocuments(storeUuid, {
  deviceUuid: "3f9b0f1a-4a26-4a26-9e14-9e2f0b0a4d21",
  types: ["SELL", "PAYBACK"],
  gtCloseDate: "2024-01-01T00:00:00.000+03:00",
  ltCloseDate: "2024-01-15T00:00:00.000+03:00",
});
```

| Constraint                        | Meaning                                                                 |
| --------------------------------- | ----------------------------------------------------------------------- |
| no dates                          | documents of the last month are returned                                 |
| available range                   | documents not older than six months                                     |
| max range per request             | one month                                                                |

### `v1.ofd` — OFD data

The OFD section is authorized with a **separate OFD token**:

```ts
const evotor = new Evotor(token, { ofd_token: ofdToken });

const ofdStores = await evotor.v1.ofd.getStores();
const ofdDevices = await evotor.v1.ofd.getDevices();

const ofdDocuments = await evotor.v1.ofd.getDocuments("1111", {
  deviceId: "2222",
  from: "2024-01-01T00:00:00.000+03:00",
  to: "2024-01-02T00:00:00.000+03:00",
  type: "SELL",
});
```

| Method                 | Endpoint                        |
| ---------------------- | ------------------------------- |
| `getStores()`          | `GET /api/v1/ofd/stores`        |
| `getDevices()`         | `GET /api/v1/ofd/devices`       |
| `getDocuments(id, p)`  | `GET /api/v1/ofd/documents/{storeId}` |

> [!NOTE]
> The OFD selection window cannot exceed **seven days**. Available document types: `SELL` and `Z_REPORT`.

---

## 📚 API Cloud V2

The V2 reference lives on [developer.evotor.ru](https://developer.evotor.ru/docs/rest_overview.html).
The endpoints live on the same host as V1, but use new paths and the `application/vnd.evotor.v2+json`
content type. Every list response is wrapped into `{ items, paging }`:

```ts
const { items, paging } = await evotor.v2.stores.getStores();

if (paging.next_cursor !== undefined) {
  const next = await evotor.v2.stores.getStores({ cursor: paging.next_cursor });
}
```

### `v2.stores` — stores

| Method              | Endpoint      |
| ------------------- | ------------- |
| `getStores(params?)`| `GET /stores` |

### `v2.devices` — smart terminals

| Method               | Endpoint      |
| -------------------- | ------------- |
| `getDevices(params?)`| `GET /devices` |

### `v2.employees` — employees

| Method                        | Endpoint                          |
| ----------------------------- | --------------------------------- |
| `getEmployees(params?)`       | `GET /employees`                  |
| `getEmployee(id)`             | `GET /employees/{employee-id}`    |
| `getRoles()`                  | `GET /employees/roles`            |
| `createEmployee(employee)`    | `POST /employees`                 |
| `updateEmployee(id, employee)`| `PUT /employees/{employee-id}`    |

### `v2.documents` — documents

| Method                                   | Endpoint                                        |
| ---------------------------------------- | ----------------------------------------------- |
| `getDocuments(storeId, params?)`         | `GET /stores/{store-id}/documents`              |
| `getDocument(storeId, documentId)`       | `GET /stores/{store-id}/documents/{document-id}` |
| `getDeviceDocuments(storeId, deviceId, p)`| `GET /stores/{store-id}/devices/{device-id}/documents` |

### `v2.products` — products and modifications

| Method                                   | Endpoint                                            |
| ---------------------------------------- | --------------------------------------------------- |
| `getProducts(storeId, params?)`          | `GET /stores/{store-id}/products`                   |
| `getProduct(storeId, productId)`         | `GET /stores/{store-id}/products/{product-id}`       |
| `createProduct(storeId, product)`        | `POST /stores/{store-id}/products`                  |
| `putProducts(storeId, products)`         | `PUT /stores/{store-id}/products`                   |
| `putProduct(storeId, productId, product)`| `PUT /stores/{store-id}/products/{product-id}`       |
| `patchProduct(storeId, productId, body)` | `PATCH /stores/{store-id}/products/{product-id}`     |
| `deleteProducts(storeId, ids)`           | `DELETE /stores/{store-id}/products`                |
| `deleteProduct(storeId, productId)`      | `DELETE /stores/{store-id}/products/{product-id}`    |

### `v2.product_groups` — product groups

| Method                                         | Endpoint                                                    |
| ---------------------------------------------- | ----------------------------------------------------------- |
| `getProductGroups(storeId, params?)`           | `GET /stores/{store-id}/product-groups`                      |
| `getProductGroup(storeId, groupId)`            | `GET /stores/{store-id}/product-groups/{product-group-id}`   |
| `createProductGroup(storeId, group)`           | `POST /stores/{store-id}/product-groups`                     |
| `putProductGroups(storeId, groups)`            | `PUT /stores/{store-id}/product-groups`                      |
| `putProductGroup(storeId, groupId, group)`     | `PUT /stores/{store-id}/product-groups/{product-group-id}`   |
| `patchProductGroup(storeId, groupId, group)`   | `PATCH /stores/{store-id}/product-groups/{product-group-id}` |
| `deleteProductGroups(storeId, ids)`            | `DELETE /stores/{store-id}/product-groups`                   |
| `deleteProductGroup(storeId, groupId)`         | `DELETE /stores/{store-id}/product-groups/{product-group-id}`|

### `v2.bulks` — bulk tasks

| Method                | Endpoint            |
| --------------------- | ------------------- |
| `getBulks(params)`    | `GET /bulks`        |
| `getBulk(id)`         | `GET /bulks/{bulk-id}` |

### `v2.push` — push notifications

| Method                                     | Endpoint                                                          |
| ------------------------------------------ | ----------------------------------------------------------------- |
| `getPush(appId, pushId)`                   | `GET /api/apps/{application_id}/push-notifications/{push-id}`      |
| `sendPush(appId, push)`                    | `POST /api/apps/{application_id}/push-notifications`               |
| `sendPushToDevice(appId, deviceUuid, push)`| `POST /api/apps/{application_id}/devices/{device_uuid}/push-notifications` |

### `v2.events` — application events

| Method                      | Endpoint                             |
| --------------------------- | ------------------------------------ |
| `getEvents(appId, params)`  | `GET /apps/{application_id}/events`   |
| `getEvent(appId, eventId)`  | `GET /apps/{application_id}/events/{event_id}` |

### Mass operations

`putProducts` and `putProductGroups` are sent as mass operations — the `Content-Type` header gets the
`+bulk` modifier, and the response contains a task that can be tracked with `v2.bulks`:

```ts
const task = await evotor.v2.products.putProducts(storeId, [
  {
    name: "Молоко 3.2% 1 л",
    price: 120,
    measure_name: "шт",
    tax: "VAT_10",
    allow_to_sell: true,
    type: "NORMAL",
  },
]);

const status = await evotor.v2.bulks.getBulk(task.id);
```

### Types

Types of each version live in its own namespace — `v1` and `v2`:

```ts
import type { v1, v2 } from "@shevernitskiy/evotor";

const store: v2.Store = {
  id: "20170228-F4F1-401B-80FA-9ECCA8451FFB",
  name: "Мой магазин",
  user_id: "00-000000000000000",
  created_at: "2018-04-17T10:11:49.393+0000",
  updated_at: "2018-07-16T16:00:10.663+0000",
};

const legacy: v1.Store = { uuid: "b1c1f6a2-1f1e-4a7c-9b3e-0f6b2a5d7c11", name: "Мой магазин" };
```

Only fundamental entities live in the entities files — every method declares its parameters and the response
type right in the signature, so the editor shows the whole shape on hover:

```ts
evotor.v2.products.patchProduct(storeId, productId, { quantity: 12 });
//                        ^? { price?: number; cost_price?: number; quantity?: number }
//                                                 ^? Promise<Product>
```

---

## 🧩 Custom requests

Anything that is not covered by the typed sections can be requested through the raw REST client.
It applies the same base URL, headers, rate limiting and error handling:

```ts
const data = await evotor.v1.raw.get({
  url: "/api/v1/inventories/stores/search",
  query: { someParam: "value" },
});

await evotor.v1.raw.post({
  url: `/api/v1/inventories/stores/${storeUuid}/products`,
  payload: { ... },
});
```

`evotor.v1.ofd_raw` is the same client, but authorized with the OFD token.
`evotor.v2.raw` is the same client, but authorized with the V2 token and the V2 content type.

Available methods: `get`, `post`, `put`, `patch`, `delete`.
Query arrays are joined with a comma, `undefined` values are skipped.

---

## 🪝 Webhooks

The library does **not** receive webhooks for you — the receiving side is organized by your service.
What the library gives you is a typed payload for every incoming webhook:

```ts
import type {
  WebhookCommodity,
  WebhookDevice,
  WebhookDocument,
  WebhookEmployee,
  WebhookInstallationEvent,
  WebhookReceipt,
  WebhookStore,
  WebhookSubscriptionEvent,
  WebhookUserCreate,
  WebhookUserToken,
  WebhookUserVerify,
} from "@shevernitskiy/evotor";

const receipt: WebhookReceipt = await request.json();
```

`WebhookEventMap` maps every webhook address to its payload type:

```ts
import type { WebhookEventMap } from "@shevernitskiy/evotor";

function handle<K extends keyof WebhookEventMap>(address: K, payload: WebhookEventMap[K]) {
  // payload is fully typed for the given address
}
```

| Address                | Payload                     |
| ---------------------- | --------------------------- |
| `user.verify`          | `WebhookUserVerify`         |
| `user.create`          | `WebhookUserCreate`         |
| `user.token`           | `WebhookUserToken`          |
| `commodities`          | `WebhookCommodity`          |
| `inventories.stores`   | `WebhookStore[]`            |
| `inventories.employees`| `WebhookEmployee[]`         |
| `inventories.devices`  | `WebhookDevice[]`           |
| `inventories.documents`| `WebhookDocument[]`         |
| `receipts`             | `WebhookReceipt`            |
| `subscription.event`   | `WebhookSubscriptionEvent`  |
| `installation.event`   | `WebhookInstallationEvent`  |

---

## ⏱️ Rate limits

The client reads the `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset` headers.

When no requests are left, the next call waits until the window is reset.
Concurrent calls share a single timer, so the client never fires a burst of waiting requests.

The limiter is transparent — there is nothing to configure and nothing to call.

---

## 🛡️ Error handling

The client throws a typed error depending on the response:

| Error                | When                                                              |
| -------------------- | ----------------------------------------------------------------- |
| `AuthError`          | response status `401` or `403`                                    |
| `NotInstalledError`  | response status `402` — the app is not installed on all devices    |
| `ApiError`           | the response body contains an `errors` field or an array of errors |
| `HttpError`          | any other HTTP error                                              |

`AuthError`, `NotInstalledError` and `ApiError` carry the parsed response body in the `response` property.

```ts
import { ApiError, AuthError, HttpError, NotInstalledError } from "@shevernitskiy/evotor";

try {
  await evotor.v1.account.getStores();
} catch (err) {
  if (err instanceof AuthError) {
    console.error("Auth failed:", err.response);
  } else if (err instanceof NotInstalledError) {
    console.error("Not installed:", err.response);
  } else if (err instanceof ApiError) {
    console.error("API error:", err.response);
  } else if (err instanceof HttpError) {
    console.error("HTTP error:", err.message);
  } else {
    console.error("Unknown error:", err);
  }
}
```

---

## ✅ Tests

```bash
bun test
bun run typecheck
```

All tests run on a replaced `fetch` — no requests are sent to the Evotor Cloud.

---

## 📦 Release

The release workflow (`.github/workflows/release.yml`) is triggered manually with a version
(`v0.1.0`, `0.1.0` — the `v` prefix is optional). It type checks, runs the tests, bumps the version
in `package.json` and `jsr.json`, commits it, publishes to JSR, builds and publishes the npm
package, and creates a GitHub release.

```bash
bun run version 0.1.0        # bump package.json + jsr.json
bun run build:npm 0.1.0      # build the npm package into ./npm
```

A local release (npm + GitHub release) can be done with `scripts/release.ps1`.

---

## 🤝 Contribution

Pull requests, issues and feedback are very welcome. The library is developed and tested with
[Bun](https://bun.sh) and targets Node, Bun and Deno.

```bash
bun install
bun test
bun run typecheck
```

---

## 🔗 Links

- [Evotor Cloud API V2 documentation](https://developer.evotor.ru/docs/rest_overview.html)
- [Evotor Cloud API V1 documentation](https://api.evotor.ru/docs/)
- [GitHub repository](https://github.com/shevernitskiy/evotor)
- [npm package](https://www.npmjs.com/package/@shevernitskiy/evotor)
- [JSR package](https://jsr.io/@shevernitskiy/evotor)

---

## 📄 License

MIT — see the [LICENSE](LICENSE) file.
