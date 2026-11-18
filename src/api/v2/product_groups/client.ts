import { Endpoint } from "../../../core/endpoint.ts";
import type { JSONValue } from "../../../typings/lib.ts";
import type { Bulk, Paging, ProductGroup } from "../../../typings/v2/entities.ts";

/**
 * Группы товаров и группы модификаций товаров.
 *
 * Документация: https://developer.evotor.ru/docs/rest_api_get_store_product_groups.html
 */
export class ProductGroupsApi extends Endpoint {
  /**
   * Возвращает список групп товаров и групп модификаций товаров магазина.
   *
   * `GET /stores/{store-id}/product-groups`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param params Параметры выборки групп товаров.
   * @param params.since Время в миллисекундах. Ответ содержит группы, изменённые начиная с указанного момента включительно. Указывается только в первом запросе из серии постраничных запросов.
   * @param params.cursor Идентификатор курсора для постраничного чтения данных. Значение берётся из поля `paging.next_cursor` предыдущего ответа.
   * @param params.isRemoved Если `true` — ответ содержит только удалённые группы.
   * @param params.id Идентификаторы групп, до 1000 элементов.
   */
  getProductGroups(
    storeId: string,
    params?: {
      since?: number;
      cursor?: string;
      isRemoved?: boolean;
      id?: string | string[];
    },
  ): Promise<Paging<ProductGroup>> {
    return this.rest.get<Paging<ProductGroup>>({
      url: `/stores/${encodeURIComponent(storeId)}/product-groups`,
      query: {
        since: params?.since,
        cursor: params?.cursor,
        isRemoved: params?.isRemoved,
        id: params?.id,
      },
    });
  }

  /**
   * Возвращает группу товаров по идентификатору.
   *
   * `GET /stores/{store-id}/product-groups/{product-group-id}`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param groupId Идентификатор группы товаров в Облаке Эвотор.
   */
  getProductGroup(storeId: string, groupId: string): Promise<ProductGroup> {
    return this.rest.get<ProductGroup>({
      url: `/stores/${encodeURIComponent(storeId)}/product-groups/${encodeURIComponent(groupId)}`,
    });
  }

  /**
   * Создаёт группу товаров или группу модификаций товаров.
   *
   * `POST /stores/{store-id}/product-groups`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param group Данные группы товаров.
   */
  createProductGroup(storeId: string, group: ProductGroup): Promise<ProductGroup> {
    return this.rest.post<ProductGroup>({
      url: `/stores/${encodeURIComponent(storeId)}/product-groups`,
      payload: group as JSONValue,
    });
  }

  /**
   * Создаёт несколько групп товаров.
   *
   * Запрос выполняется как массовая операция.
   * Состояние задачи доступно через раздел «Задачи для массовых операций».
   *
   * `POST /stores/{store-id}/product-groups`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param groups Массив групп товаров.
   */
  createProductGroups(storeId: string, groups: ProductGroup[]): Promise<Bulk> {
    return this.rest.post<Bulk>({
      url: `/stores/${encodeURIComponent(storeId)}/product-groups`,
      payload: groups as JSONValue,
      content_type: "bulk",
    });
  }

  /**
   * Создаёт или заменяет несколько групп товаров.
   *
   * Запрос выполняется как массовая операция.
   * Состояние задачи доступно через раздел «Задачи для массовых операций».
   *
   * `PUT /stores/{store-id}/product-groups`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param groups Массив групп товаров.
   */
  putProductGroups(storeId: string, groups: ProductGroup[]): Promise<Bulk> {
    return this.rest.put<Bulk>({
      url: `/stores/${encodeURIComponent(storeId)}/product-groups`,
      payload: groups as JSONValue,
      content_type: "bulk",
    });
  }

  /**
   * Создаёт или заменяет группу товаров.
   *
   * `PUT /stores/{store-id}/product-groups/{product-group-id}`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param groupId Идентификатор группы товаров в Облаке Эвотор.
   * @param group Данные группы товаров.
   */
  putProductGroup(storeId: string, groupId: string, group: ProductGroup): Promise<ProductGroup> {
    return this.rest.put<ProductGroup>({
      url: `/stores/${encodeURIComponent(storeId)}/product-groups/${encodeURIComponent(groupId)}`,
      payload: group as JSONValue,
    });
  }

  /**
   * Обновляет данные группы товаров.
   *
   * `PATCH /stores/{store-id}/product-groups/{product-group-id}`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param groupId Идентификатор группы товаров в Облаке Эвотор.
   * @param group Изменяемые поля группы товаров.
   * @param group.name Название группы, длиной не менее 1 символа и не более 128 символов.
   */
  patchProductGroup(storeId: string, groupId: string, group: { name: string }): Promise<ProductGroup> {
    return this.rest.patch<ProductGroup>({
      url: `/stores/${encodeURIComponent(storeId)}/product-groups/${encodeURIComponent(groupId)}`,
      payload: group as JSONValue,
    });
  }

  /**
   * Удаляет несколько групп товаров или групп модификаций товаров.
   *
   * `DELETE /stores/{store-id}/product-groups`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param ids Идентификаторы групп, до 1000 элементов.
   */
  deleteProductGroups(storeId: string, ids: string[]): Promise<void> {
    return this.rest.delete<void>({
      url: `/stores/${encodeURIComponent(storeId)}/product-groups`,
      query: {
        id: ids,
      },
    });
  }

  /**
   * Удаляет группу товаров или группу модификаций товаров.
   *
   * `DELETE /stores/{store-id}/product-groups/{product-group-id}`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param groupId Идентификатор группы товаров в Облаке Эвотор.
   */
  deleteProductGroup(storeId: string, groupId: string): Promise<void> {
    return this.rest.delete<void>({
      url: `/stores/${encodeURIComponent(storeId)}/product-groups/${encodeURIComponent(groupId)}`,
    });
  }
}
