import { expect, test } from "bun:test";

import type { WebhookEventMap, WebhookReceipt, WebhookSubscriptionEvent } from "../index.ts";

test("типы входящих вебхуков доступны", () => {
  const receipt: WebhookReceipt = {
    id: "receipt-1",
    timestamp: 1496826444000001,
    userId: "01-000000000000001",
    type: "receipt",
    version: 2,
    data: {
      id: "doc-1",
      storeId: "store-1",
      type: "SELL",
      totalAmount: 3000,
      items: [{ id: "p-1", name: "Товар", quantity: 2, price: 1500 }],
    },
  };
  const event: WebhookSubscriptionEvent = {
    type: "SubscriptionTerminated",
    subscriptionId: "subscription-1",
    productId: "product-1",
    userId: "01-000000000000001",
    timestamp: "2024-01-01T00:00:00.000+0000",
    sequenceNumber: 1,
  };
  const payload: WebhookEventMap["receipts"] = receipt;

  expect(payload.data?.totalAmount).toBe(3000);
  expect(event.type).toBe("SubscriptionTerminated");
});
