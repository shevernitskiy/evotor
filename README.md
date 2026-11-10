# 🧾Evotor

A thin TypeScript client for the Evotor Cloud REST API.

The client sections mirror the sections of the [official documentation](https://api.evotor.ru/docs/):
`account` — user entities, `products` — products, documents, schemes and extra fields,
`ofd` — OFD data.

## Install

```bash
bun install
```

## Usage

```ts
import { Evotor } from "evotor";

const evotor = new Evotor(token);

const stores = await evotor.account.getStores();
const employees = await evotor.account.getEmployees();
const devices = await evotor.account.getDevices();

const products = await evotor.products.getProducts(stores[0]!.uuid);
const documents = await evotor.products.getDocuments(stores[0]!.uuid, {
  types: ["SELL"],
});
```

The OFD section is authorized with a separate OFD token:

```ts
const evotor = new Evotor(token, { ofd_token: ofdToken });

const ofdStores = await evotor.ofd.getStores();
const ofdDocuments = await evotor.ofd.getDocuments("1111", {
  deviceId: "2222",
  from: "2024-01-01T00:00:00.000+03:00",
  to: "2024-01-02T00:00:00.000+03:00",
  type: "SELL",
});
```

`fetch` can be replaced through the options — useful for tests and mock environments:

```ts
const evotor = new Evotor(token, { fetch: mockFetch });
```

## Implemented methods

| Section    | Methods                                                                                                                                                                            |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `account`  | `getStores()`, `getEmployees()`, `getDevices()`                                                                                                                                    |
| `products` | `getProducts()`, `uploadProducts()`, `deleteProducts()`, `getDocuments()`, `getSchemes()`, `uploadSchemes()`, `deleteSchemes()`, `getExtras()`, `uploadExtras()`, `deleteExtras()` |
| `ofd`      | `getStores()`, `getDevices()`, `getDocuments()`                                                                                                                                    |

## Webhook types

The library does not receive webhooks for you — you organize the receiving side yourself.
Payload types for every incoming webhook are exported from the package:

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
} from "evotor";

const receipt: WebhookReceipt = await request.json();
```

`WebhookEventMap` maps every webhook address to its payload type.

## Rate limits

The client reads the `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset` headers.
When no requests are left, the next call waits until the window is reset; concurrent calls share
a single timer.

## Errors

- `AuthError` — response 401 or 403;
- `ApiError` — response body contains `errors`;
- `HttpError` — any other HTTP error.

## Tests

```bash
bun test
bun run typecheck
```

All tests run on a replaced `fetch`: no requests are sent to the Evotor Cloud.

## Release

The release workflow (`.github/workflows/release.yml`) is triggered manually with a version
(`v0.1.0`, `0.1.0` — the `v` prefix is optional). It type checks, runs the tests, bumps the version
in `package.json` and `jsr.json`, commits it, publishes to JSR, builds and publishes the npm
package, and creates a GitHub release.

```bash
bun run version 0.1.0        # bump package.json + jsr.json
bun run build:npm 0.1.0      # build the npm package into ./npm
```

A local release (npm + GitHub release) can be done with `scripts/release.ps1`.
