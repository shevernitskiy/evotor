import { Endpoint } from "../../../core/endpoint.ts";
import type { JSONValue } from "../../../typings/lib.ts";
import type { Bulk, Paging, Product, ProductField } from "../../../typings/v2/entities.ts";

/**
 * Товары и модификации товаров магазина.
 *
 * Документация: https://developer.evotor.ru/docs/rest_api_get_store_products.html
 */
export class ProductsApi extends Endpoint {
  /**
   * Возвращает список товаров и модификаций товаров магазина.
   *
   * `GET /stores/{store-id}/products`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param params Параметры выборки товаров.
   * @param params.since Время в миллисекундах. Ответ содержит товары, изменённые начиная с указанного момента включительно. Указывается только в первом запросе из серии постраничных запросов.
   * @param params.cursor Идентификатор курсора для постраничного чтения данных. Значение берётся из поля `paging.next_cursor` предыдущего ответа.
   * @param params.isRemoved Если `true` — ответ содержит только удалённые товары.
   * @param params.id Идентификаторы товаров, до 1000 элементов.
   * @param params.fields Поля, которые нужно вернуть в ответе.
   */
  getProducts(
    storeId: string,
    params?: {
      since?: number;
      cursor?: string;
      isRemoved?: boolean;
      id?: string | string[];
      fields?: ProductField | ProductField[];
    },
  ): Promise<Paging<Product>> {
    return this.rest.get<Paging<Product>>({
      url: `/stores/${encodeURIComponent(storeId)}/products`,
      query: {
        since: params?.since,
        cursor: params?.cursor,
        isRemoved: params?.isRemoved,
        id: params?.id,
        fields: params?.fields,
      },
    });
  }

  /**
   * Возвращает товар по идентификатору.
   *
   * `GET /stores/{store-id}/products/{product-id}`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param productId Идентификатор товара в Облаке Эвотор.
   */
  getProduct(storeId: string, productId: string): Promise<Product> {
    return this.rest.get<Product>({
      url: `/stores/${encodeURIComponent(storeId)}/products/${encodeURIComponent(productId)}`,
    });
  }

  /**
   * Создаёт товар.
   *
   * `POST /stores/{store-id}/products`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param product Данные товара.
   */
  createProduct(storeId: string, product: Product): Promise<Product> {
    return this.rest.post<Product>({
      url: `/stores/${encodeURIComponent(storeId)}/products`,
      payload: product as JSONValue,
    });
  }

  /**
   * Создаёт или заменяет несколько товаров.
   *
   * Запрос выполняется как массовая операция — до 1000 товаров за раз.
   * Состояние задачи доступно через раздел «Задачи для массовых операций».
   *
   * `PUT /stores/{store-id}/products`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param products Массив товаров.
   */
  putProducts(storeId: string, products: Product[]): Promise<Bulk> {
    return this.rest.put<Bulk>({
      url: `/stores/${encodeURIComponent(storeId)}/products`,
      payload: products as JSONValue,
      content_type: "bulk",
    });
  }

  /**
   * Создаёт или заменяет товар.
   *
   * `PUT /stores/{store-id}/products/{product-id}`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param productId Идентификатор товара в Облаке Эвотор.
   * @param product Данные товара.
   */
  putProduct(storeId: string, productId: string, product: Product): Promise<Product> {
    return this.rest.put<Product>({
      url: `/stores/${encodeURIComponent(storeId)}/products/${encodeURIComponent(productId)}`,
      payload: product as JSONValue,
    });
  }

  /**
   * Обновляет данные товара.
   *
   * `PATCH /stores/{store-id}/products/{product-id}`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param productId Идентификатор товара в Облаке Эвотор.
   * @param product Изменяемые поля товара.
   * @param product.price Отпускная цена товара или модификации товара.
   * @param product.cost_price Закупочная цена товара или модификации товара.
   * @param product.quantity Доступный к продаже остаток товара или модификации товара.
   */
  patchProduct(
    storeId: string,
    productId: string,
    product: {
      price?: number;
      cost_price?: number;
      quantity?: number;
    },
  ): Promise<Product> {
    return this.rest.patch<Product>({
      url: `/stores/${encodeURIComponent(storeId)}/products/${encodeURIComponent(productId)}`,
      payload: product as JSONValue,
    });
  }

  /**
   * Удаляет несколько товаров или модификаций товаров.
   *
   * `DELETE /stores/{store-id}/products`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param ids Идентификаторы товаров, до 1000 элементов.
   */
  deleteProducts(storeId: string, ids: string[]): Promise<void> {
    return this.rest.delete<void>({
      url: `/stores/${encodeURIComponent(storeId)}/products`,
      query: {
        id: ids,
      },
    });
  }

  /**
   * Удаляет товар или модификацию товара.
   *
   * `DELETE /stores/{store-id}/products/{product-id}`
   *
   * @param storeId Идентификатор магазина в Облаке Эвотор.
   * @param productId Идентификатор товара в Облаке Эвотор.
   */
  deleteProduct(storeId: string, productId: string): Promise<void> {
    return this.rest.delete<void>({
      url: `/stores/${encodeURIComponent(storeId)}/products/${encodeURIComponent(productId)}`,
    });
  }
}
