import { Endpoint } from "../../../core/endpoint.ts";
import type { Device, Paging } from "../../../typings/v2/entities.ts";

/**
 * Смарт-терминалы пользователя платформы Эвотор.
 *
 * Документация: https://developer.evotor.ru/docs/rest_smart_terminals.html
 */
export class DevicesApi extends Endpoint {
  /**
   * Возвращает список смарт-терминалов пользователя.
   *
   * `GET /devices`
   *
   * @param params Параметры выборки смарт-терминалов.
   * @param params.cursor Идентификатор курсора для постраничного чтения данных. Значение берётся из поля `paging.next_cursor` предыдущего ответа.
   */
  getDevices(params?: { cursor?: string }): Promise<Paging<Device>> {
    return this.rest.get<Paging<Device>>({
      url: "/devices",
      query: {
        cursor: params?.cursor,
      },
    });
  }
}
