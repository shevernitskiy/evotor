# 🧾 Evotor

[![npm](https://img.shields.io/npm/v/@shevernitskiy/evotor?logo=npm&style=flat&labelColor=000)](https://www.npmjs.com/package/@shevernitskiy/evotor)
[![JSR](https://jsr.io/badges/@shevernitskiy/evotor)](https://jsr.io/@shevernitskiy/evotor)
![bun](https://img.shields.io/badge/bun-1.4.4-black?style=flat&logo=bun&logoColor=white)
![dependencies](https://img.shields.io/badge/dependencies-0-green?style=flat&labelColor=000)
![types](https://img.shields.io/badge/types-TypeScript-blue?style=flat&labelColor=000)
[![license](https://img.shields.io/github/license/shevernitskiy/evotor?style=flat&labelColor=000)](https://github.com/shevernitskiy/evotor/blob/main/LICENSE)

A thin, fully-typed TypeScript client for the [Evotor Cloud](https://api.evotor.ru/docs/) REST API.

Zero dependencies, works on any runtime with a standard `fetch` (Node 18+, Bun, Deno).

- Typed entities, requests and responses — no `any`, no manual casts;
- Three sections mirroring the official docs: `account`, `products`, `ofd`;
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

- [x] Account — stores, employees, devices
- [x] Products — get / upload / delete
- [x] Documents — get
- [x] Product schemes — get / upload / delete
- [x] Product extras — get / upload / delete
- [x] OFD — stores, devices, documents
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

const stores = await evotor.account.getStores();
const employees = await evotor.account.getEmployees();
const devices = await evotor.account.getDevices();

const products = await evotor.products.getProducts(stores[0]!.uuid);
const documents = await evotor.products.getDocuments(stores[0]!.uuid, {
  types: ["SELL"],
});
```

The client is created with a **token** that is passed in the `X-Authorization` header on every request.
Tokens are issued per application in the Evotor developer account.

---

## 🏗️ Client structure

```ts
const evotor = new Evotor(token, options);

evotor.account;   // Сущности пользователя: магазины, сотрудники, смарт-терминалы
evotor.products;  // Товары, документы, схемы и дополнительные поля
evotor.ofd;       // Данные ОФД: магазины, смарт-терминалы, документы
```

Each section is a separate class with methods named after the API operation, so the code reads like the docs.

### Constructor options

```ts
const evotor = new Evotor(token, {
  ofd_token: ofdToken,
  fetch: mockFetch,
});
```

| Option      | Type              | Description                                                                                   |
| ----------- | ----------------- | --------------------------------------------------------------------------------------------- |
| `ofd_token` | `string`          | Token for the OFD section. If omitted, the main token is used.                                |
| `fetch`     | `typeof fetch`    | Replaces the global `fetch` — useful for tests, mocks and custom transports (proxy, retries).  |

---

## 📚 API

### `account` — user entities

| Method          | Endpoint                                      |
| --------------- | --------------------------------------------- |
| `getStores()`   | `GET /api/v1/inventories/stores/search`       |
| `getEmployees()`| `GET /api/v1/inventories/employees/search`    |
| `getDevices()`  | `GET /api/v1/inventories/devices/search`      |

```ts
const stores = await evotor.account.getStores();
console.log(stores[0]?.name, stores[0]?.uuid);
```

### `products` — products, documents, schemes and extras

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
await evotor.products.uploadProducts(storeUuid, [
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
await evotor.products.deleteProducts(storeUuid, [{ uuid: "4b77d9a7-568d-4830-aecc-c67fe87fe96f" }]);
```

> [!IMPORTANT]
> When updating a product you must send the **full** set of fields — Evotor removes the old ones and writes the new ones.

**Documents selection**

```ts
const documents = await evotor.products.getDocuments(storeUuid, {
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

### `ofd` — OFD data

The OFD section is authorized with a **separate OFD token**:

```ts
const evotor = new Evotor(token, { ofd_token: ofdToken });

const ofdStores = await evotor.ofd.getStores();
const ofdDevices = await evotor.ofd.getDevices();

const ofdDocuments = await evotor.ofd.getDocuments("1111", {
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

## 🧩 Custom requests

Anything that is not covered by the typed sections can be requested through the raw REST client.
It applies the same base URL, headers, rate limiting and error handling:

```ts
const data = await evotor.raw.get({
  url: "/api/v1/inventories/stores/search",
  query: { someParam: "value" },
});

await evotor.raw.post({
  url: `/api/v1/inventories/stores/${storeUuid}/products`,
  payload: { ... },
});
```

`evotor.ofd_raw` is the same client, but authorized with the OFD token.

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

| Error        | When                                                    |
| ------------ | ------------------------------------------------------- |
| `AuthError`  | response status `401` or `403`                          |
| `ApiError`   | the response body contains an `errors` field            |
| `HttpError`  | any other HTTP error                                    |

`AuthError` and `ApiError` carry the parsed response body in the `response` property.

```ts
import { ApiError, AuthError, HttpError } from "@shevernitskiy/evotor";

try {
  await evotor.account.getStores();
} catch (err) {
  if (err instanceof AuthError) {
    console.error("Auth failed:", err.response);
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

- [Evotor Cloud API documentation](https://api.evotor.ru/docs/)
- [GitHub repository](https://github.com/shevernitskiy/evotor)
- [npm package](https://www.npmjs.com/package/@shevernitskiy/evotor)
- [JSR package](https://jsr.io/@shevernitskiy/evotor)

---

## 📄 License

MIT — see the [LICENSE](LICENSE) file.
