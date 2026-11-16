import { Endpoint } from "../../../core/endpoint.ts";
import type { Bulk, BulkStatus, BulkType, Paging } from "../../../typings/v2/entities.ts";

/**
 * Задачи массовых операций.
 *
 * Документация: https://developer.evotor.ru/docs/rest_api_get_bulks.html
 */
export class BulksApi extends Endpoint {
  /**
   * Возвращает общее состояние задач массовых операций.
   *
   * `GET /bulks`
   *
   * @param params Параметры выборки задач.
   * @param params.type Тип сущности, задачи по которому должны быть в ответе. Можно указать несколько типов через запятую.
   * @param params.status Фильтр задач по статусам. Если параметр не задан — задачи с любым статусом. Можно указать несколько статусов через запятую.
   * @param params.cursor Идентификатор курсора для постраничного чтения данных. Значение берётся из поля `paging.next_cursor` предыдущего ответа.
   */
  getBulks(params: {
    type: BulkType | BulkType[];
    status?: BulkStatus | BulkStatus[];
    cursor?: string;
  }): Promise<Paging<Bulk>> {
    return this.rest.get<Paging<Bulk>>({
      url: "/bulks",
      query: {
        type: params.type,
        status: params.status,
        cursor: params.cursor,
      },
    });
  }

  /**
   * Возвращает подробную информацию о состоянии задачи массовой операции.
   *
   * `GET /bulks/{bulk-id}`
   *
   * @param bulkId Идентификатор задачи.
   */
  getBulk(bulkId: string): Promise<Bulk> {
    return this.rest.get<Bulk>({
      url: `/bulks/${encodeURIComponent(bulkId)}`,
    });
  }
}
