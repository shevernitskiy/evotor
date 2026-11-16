import type { RestClient } from "../../core/rest-client.ts";
import { AccountApi } from "./account/client.ts";
import { OfdApi } from "./ofd/client.ts";
import { ProductsApi } from "./products/client.ts";

/**
 * API Облака Эвотор V1.
 *
 * Документация: https://api.evotor.ru/docs/
 */
export class ApiV1 {
  /** Сущности пользователя Эвотор: магазины, сотрудники и смарт-терминалы. */
  readonly account: AccountApi;
  /** Товары, документы, схемы и дополнительные поля товаров. */
  readonly products: ProductsApi;
  /** Данные ОФД: магазины, смарт-терминалы, документы. */
  readonly ofd: OfdApi;
  /** Кастомные запросы к Облаку Эвотор V1. */
  readonly raw: RestClient;
  /** Кастомные запросы к ОФД. */
  readonly ofd_raw: RestClient;

  constructor(rest: RestClient, ofd_rest: RestClient) {
    this.account = new AccountApi(rest);
    this.products = new ProductsApi(rest);
    this.ofd = new OfdApi(ofd_rest);
    this.raw = rest;
    this.ofd_raw = ofd_rest;
  }
}
