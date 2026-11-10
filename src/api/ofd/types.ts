import type { OfdDevice, OfdDocument, OfdDocumentType, OfdStore } from "../../typings/entities.ts";

/** Ответ на запрос списка магазинов ОФД. */
export type ResponseGetOfdStores = {
  version: number;
  provider: string;
  data: OfdStore[];
};

/** Ответ на запрос списка смарт-терминалов ОФД. */
export type ResponseGetOfdDevices = {
  version: number;
  provider: string;
  data: OfdDevice[];
};

/** Ответ на запрос списка документов ОФД. */
export type ResponseGetOfdDocuments = {
  version: number;
  provider: string;
  data: OfdDocument[];
};

/** Параметры выборки документов ОФД. */
export type RequestGetOfdDocuments = {
  /**
   * Идентификатор смарт-терминала, полученный из запроса «Получение иерархии касс из ОФД», в формате `\d+`.
   */
  deviceId: string;
  /**
   * Начало интервала выборки для выгрузки документов. Формат даты – ISO-8601.
   *
   * Выборка не может превышать семи дней.
   */
  from: string;
  /**
   * Конец интервала выборки для выгрузки документов. Формат даты – ISO-8601.
   *
   * Выборка не может превышать семи дней.
   */
  to: string;
  /**
   * Тип документа для выгрузки из ОФД.
   *
   * Доступны только документы типов `SELL` (кассовые документы) и `Z_REPORT` (z-отчёт).
   */
  type: OfdDocumentType;
};
