import { Endpoint } from "../../../core/endpoint.ts";
import type { OfdDevice, OfdDocument, OfdDocumentType, OfdResponse, OfdStore } from "../../../typings/v1/entities.ts";

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
  getStores(): Promise<OfdResponse<OfdStore[]>> {
    return this.rest.get<OfdResponse<OfdStore[]>>({
      url: "/api/v1/ofd/stores",
    });
  }

  /**
   * Возвращает массив с информацией о всех смарт-терминалах пользователя, которые зарегистрированы в ОФД.
   *
   * `GET /api/v1/ofd/devices`
   */
  getDevices(): Promise<OfdResponse<OfdDevice[]>> {
    return this.rest.get<OfdResponse<OfdDevice[]>>({
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
   * @param params Параметры выборки документов.
   * @param params.deviceId Идентификатор смарт-терминала, полученный из запроса «Получение иерархии касс из ОФД», в формате `\d+`.
   * @param params.from Начало интервала выборки для выгрузки документов. Формат даты – ISO-8601. Выборка не может превышать семи дней.
   * @param params.to Конец интервала выборки для выгрузки документов. Формат даты – ISO-8601. Выборка не может превышать семи дней.
   * @param params.type Тип документа для выгрузки из ОФД. Доступны только `SELL` (кассовые документы) и `Z_REPORT` (z-отчёт).
   */
  getDocuments(
    storeId: string,
    params: {
      deviceId: string;
      from: string;
      to: string;
      type: OfdDocumentType;
    },
  ): Promise<OfdResponse<OfdDocument[]>> {
    return this.rest.get<OfdResponse<OfdDocument[]>>({
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
