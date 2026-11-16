import { Endpoint } from "../../../core/endpoint.ts";
import type { Device, Employee, Store } from "../../../typings/v1/entities.ts";

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
  getStores(): Promise<Store[]> {
    return this.rest.get<Store[]>({
      url: "/api/v1/inventories/stores/search",
    });
  }

  /**
   * Возвращает массив с информацией о всех сотрудниках пользователя.
   * Под сотрудниками понимаются пользователи смарт-терминалов, например, кассиры.
   *
   * `GET /api/v1/inventories/employees/search`
   */
  getEmployees(): Promise<Employee[]> {
    return this.rest.get<Employee[]>({
      url: "/api/v1/inventories/employees/search",
    });
  }

  /**
   * Возвращает массив с информацией о всех смарт-терминалах пользователя.
   *
   * `GET /api/v1/inventories/devices/search`
   */
  getDevices(): Promise<Device[]> {
    return this.rest.get<Device[]>({
      url: "/api/v1/inventories/devices/search",
    });
  }
}
