import { Endpoint } from "../../../core/endpoint.ts";
import type { Document, DocumentType, Paging } from "../../../typings/v2/entities.ts";

/**
 * Документы магазина.
 *
 * Документация: https://developer.evotor.ru/docs/rest_api_get_store_documents.html
 */
export class DocumentsApi extends Endpoint {
  /**
   * Возвращает список документов магазина.
   *
   * `GET /stores/{store-id}/documents`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param params Параметры выборки документов.
   * @param params.since Время в миллисекундах. Ответ содержит документы, созданные начиная с указанного момента включительно. Указывается только в первом запросе из серии постраничных запросов.
   * @param params.until Время в миллисекундах. Ответ содержит документы, созданные строго до указанного момента. Если параметр не задан, значение определяется как текущая дата.
   * @param params.type Типы документов, которые должны попасть в ответ. Можно указать несколько типов через запятую.
   * @param params.cursor Идентификатор курсора для постраничного чтения данных. Значение берётся из поля `paging.next_cursor` предыдущего ответа.
   */
  getDocuments(
    storeId: string,
    params?: {
      since?: number;
      until?: number;
      type?: DocumentType | DocumentType[];
      cursor?: string;
    },
  ): Promise<Paging<Document>> {
    return this.rest.get<Paging<Document>>({
      url: `/stores/${encodeURIComponent(storeId)}/documents`,
      query: {
        since: params?.since,
        until: params?.until,
        type: params?.type,
        cursor: params?.cursor,
      },
    });
  }

  /**
   * Возвращает документ по идентификатору.
   *
   * `GET /stores/{store-id}/documents/{document-id}`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param documentId Идентификатор документа в Облаке Эвотор.
   */
  getDocument(storeId: string, documentId: string): Promise<Document> {
    return this.rest.get<Document>({
      url: `/stores/${encodeURIComponent(storeId)}/documents/${encodeURIComponent(documentId)}`,
    });
  }

  /**
   * Возвращает список документов по идентификатору смарт-терминала.
   *
   * `GET /stores/{store-id}/devices/{device-id}/documents`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param deviceId Идентификатор смарт-терминала в Облаке Эвотор.
   * @param params Параметры выборки документов.
   * @param params.since Время в миллисекундах. Ответ содержит документы, созданные начиная с указанного момента включительно. Указывается только в первом запросе из серии постраничных запросов.
   * @param params.until Время в миллисекундах. Ответ содержит документы, созданные строго до указанного момента. Если параметр не задан, значение определяется как текущая дата.
   * @param params.type Типы документов, которые должны попасть в ответ. Можно указать несколько типов через запятую.
   * @param params.cursor Идентификатор курсора для постраничного чтения данных. Значение берётся из поля `paging.next_cursor` предыдущего ответа.
   */
  getDeviceDocuments(
    storeId: string,
    deviceId: string,
    params?: {
      since?: number;
      until?: number;
      type?: DocumentType | DocumentType[];
      cursor?: string;
    },
  ): Promise<Paging<Document>> {
    return this.rest.get<Paging<Document>>({
      url: `/stores/${encodeURIComponent(storeId)}/devices/${encodeURIComponent(deviceId)}/documents`,
      query: {
        since: params?.since,
        until: params?.until,
        type: params?.type,
        cursor: params?.cursor,
      },
    });
  }
}
