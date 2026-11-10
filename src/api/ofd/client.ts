import { Endpoint } from "../../core/endpoint.ts";
import type {
  RequestGetOfdDocuments,
  ResponseGetOfdDevices,
  ResponseGetOfdDocuments,
  ResponseGetOfdStores,
} from "./types.ts";

/**
 * Данные ОФД: магазины, смарт-терминалы и документы, переданные в ОФД.
 *
 * Запросы авторизуются токеном ОФД в заголовке `X-Authorization`.
 *
 * Документация: https://api.evotor.ru/docs/#tag/Данные-ОФД
 */
export class OfdApi extends Endpoint {
  /**
   * Возвращает массив с информацией о всех магазинах пользователя, которые зарегистрированы в ОФД.
   *
   * `GET /api/v1/ofd/stores`
   */
  getStores(): Promise<ResponseGetOfdStores> {
    return this.rest.get<ResponseGetOfdStores>({
      url: "/api/v1/ofd/stores",
    });
  }

  /**
   * Возвращает массив с информацией о всех смарт-терминалах пользователя, которые зарегистрированы в ОФД.
   *
   * `GET /api/v1/ofd/devices`
   */
  getDevices(): Promise<ResponseGetOfdDevices> {
    return this.rest.get<ResponseGetOfdDevices>({
      url: "/api/v1/ofd/devices",
    });
  }

  /**
   * Возвращает массив с информацией о документах, переданных в ОФД, за заданный период.
   * Можно указать тип необходимых документов.
   *
   * Максимальный размер выборки — семь дней.
   *
   * `GET /api/v1/ofd/documents/{storeId}`
   *
   * @param storeId Идентификатор магазина, полученный из запроса «Получение иерархии магазинов из ОФД», в формате `\d+`.
   * @param params Параметры выборки документов: смарт-терминал, период и тип документа.
   */
  getDocuments(storeId: string, params: RequestGetOfdDocuments): Promise<ResponseGetOfdDocuments> {
    return this.rest.get<ResponseGetOfdDocuments>({
      url: `/api/v1/ofd/documents/${encodeURIComponent(storeId)}`,
      query: {
        deviceId: params.deviceId,
        from: params.from,
        to: params.to,
        type: params.type,
      },
    });
  }
}
