import { Endpoint } from "../../core/endpoint.ts";
import type { ResponseGetDevices, ResponseGetEmployees, ResponseGetStores } from "./types.ts";

/**
 * Сущности пользователя Эвотор: магазины, сотрудники и смарт-терминалы.
 *
 * Документация: https://api.evotor.ru/docs/#tag/Сущности-пользователя-Эвотор
 */
export class AccountApi extends Endpoint {
  /**
   * Возвращает массив с информацией о всех магазинах пользователя.
   *
   * `GET /api/v1/inventories/stores/search`
   */
  getStores(): Promise<ResponseGetStores> {
    return this.rest.get<ResponseGetStores>({
      url: "/api/v1/inventories/stores/search",
    });
  }

  /**
   * Возвращает массив с информацией о всех сотрудниках пользователя.
   * Под сотрудниками понимаются пользователи смарт-терминалов, например, кассиры.
   *
   * `GET /api/v1/inventories/employees/search`
   */
  getEmployees(): Promise<ResponseGetEmployees> {
    return this.rest.get<ResponseGetEmployees>({
      url: "/api/v1/inventories/employees/search",
    });
  }

  /**
   * Возвращает массив с информацией о всех смарт-терминалах пользователя.
   *
   * `GET /api/v1/inventories/devices/search`
   */
  getDevices(): Promise<ResponseGetDevices> {
    return this.rest.get<ResponseGetDevices>({
      url: "/api/v1/inventories/devices/search",
    });
  }
}
