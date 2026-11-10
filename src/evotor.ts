import { AccountApi } from "./api/account/client.ts";
import { OfdApi } from "./api/ofd/client.ts";
import { ProductsApi } from "./api/products/client.ts";
import { RestClient } from "./core/rest-client.ts";
import type { Options } from "./typings/lib.ts";

export class Evotor {
  private readonly rest: RestClient;
  private readonly ofd_rest: RestClient;
  /** Сущности пользователя Эвотор: магазины, сотрудники и смарт-терминалы. */
  readonly account: AccountApi;
  /** Товары, документы, схемы и дополнительные поля товаров. */
  readonly products: ProductsApi;
  /** Данные ОФД. */
  readonly ofd: OfdApi;

  constructor(token: string, options: Options = {}) {
    this.rest = new RestClient(token, options);
    this.ofd_rest = options.ofd_token === undefined ? this.rest : new RestClient(options.ofd_token, options);
    this.account = new AccountApi(this.rest);
    this.products = new ProductsApi(this.rest);
    this.ofd = new OfdApi(this.ofd_rest);
  }

  /** Кастомные запросы к Облаку Эвотор. */
  get raw(): RestClient {
    return this.rest;
  }

  /** Кастомные запросы к ОФД. */
  get ofd_raw(): RestClient {
    return this.ofd_rest;
  }
}
