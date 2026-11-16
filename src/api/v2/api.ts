import type { RestClient } from "../../core/rest-client.ts";
import { BulksApi } from "./bulks/client.ts";
import { DevicesApi } from "./devices/client.ts";
import { DocumentsApi } from "./documents/client.ts";
import { EmployeesApi } from "./employees/client.ts";
import { EventsApi } from "./events/client.ts";
import { ProductGroupsApi } from "./product_groups/client.ts";
import { ProductsApi } from "./products/client.ts";
import { PushApi } from "./push/client.ts";
import { StoresApi } from "./stores/client.ts";

/**
 * API Облака Эвотор V2.
 *
 * Документация: https://developer.evotor.ru/docs/rest_overview.html
 */
export class ApiV2 {
  /** Магазины пользователя платформы Эвотор. */
  readonly stores: StoresApi;
  /** Смарт-терминалы пользователя платформы Эвотор. */
  readonly devices: DevicesApi;
  /** Сотрудники пользователя платформы Эвотор. */
  readonly employees: EmployeesApi;
  /** Документы магазина. */
  readonly documents: DocumentsApi;
  /** Товары и модификации товаров. */
  readonly products: ProductsApi;
  /** Группы товаров и группы модификаций товаров. */
  readonly product_groups: ProductGroupsApi;
  /** Задачи для массовых операций. */
  readonly bulks: BulksApi;
  /** Push-уведомления для смарт-терминалов. */
  readonly push: PushApi;
  /** События приложения. */
  readonly events: EventsApi;
  /** Кастомные запросы к API Облака Эвотор V2. */
  readonly raw: RestClient;

  constructor(rest: RestClient) {
    this.stores = new StoresApi(rest);
    this.devices = new DevicesApi(rest);
    this.employees = new EmployeesApi(rest);
    this.documents = new DocumentsApi(rest);
    this.products = new ProductsApi(rest);
    this.product_groups = new ProductGroupsApi(rest);
    this.bulks = new BulksApi(rest);
    this.push = new PushApi(rest);
    this.events = new EventsApi(rest);
    this.raw = rest;
  }
}
