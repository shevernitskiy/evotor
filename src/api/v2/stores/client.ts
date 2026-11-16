import { Endpoint } from "../../../core/endpoint.ts";
import type { Paging, Store } from "../../../typings/v2/entities.ts";

/**
 * Магазины пользователя платформы Эвотор.
 *
 * Документация: https://developer.evotor.ru/docs/rest_stores.html
 */
export class StoresApi extends Endpoint {
  /**
   * Возвращает список магазинов пользователя.
   *
   * `GET /stores`
   *
   * @param params Параметры выборки магазинов.
   * @param params.cursor Идентификатор курсора для постраничного чтения данных. Значение берётся из поля `paging.next_cursor` предыдущего ответа.
   */
  getStores(params?: { cursor?: string }): Promise<Paging<Store>> {
    return this.rest.get<Paging<Store>>({
      url: "/stores",
      query: {
        cursor: params?.cursor,
      },
    });
  }
}
