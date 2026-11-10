import { Endpoint } from "../../core/endpoint.ts";
import type { JSONValue } from "../../typings/lib.ts";
import type {
  RequestDeleteExtras,
  RequestDeleteProducts,
  RequestDeleteSchemes,
  RequestGetDocuments,
  RequestUploadExtras,
  RequestUploadProducts,
  RequestUploadSchemes,
  ResponseDeleteExtras,
  ResponseDeleteProducts,
  ResponseDeleteSchemes,
  ResponseGetDocuments,
  ResponseGetExtras,
  ResponseGetProducts,
  ResponseGetSchemes,
  ResponseUploadExtras,
  ResponseUploadProducts,
  ResponseUploadSchemes,
} from "./types.ts";

/**
 * Товары и документы, схемы и дополнительные поля товаров.
 *
 * Документация: https://api.evotor.ru/docs/#tag/Товары-и-документы
 */
export class ProductsApi extends Endpoint {
  /**
   * Возвращает информацию обо всех товарах в определённом магазине (`storeUuid`) пользователя платформы.
   *
   * `GET /api/v1/inventories/stores/{storeUuid}/products`
   *
   * @param storeUuid Идентификатор магазина в Облаке Эвотор, в рамках которого действует запрос. Формат – `uuid4`.
   */
  getProducts(storeUuid: string): Promise<ResponseGetProducts> {
    return this.rest.get<ResponseGetProducts>({
      url: `/api/v1/inventories/stores/${encodeURIComponent(storeUuid)}/products`,
    });
  }

  /**
   * Загружает информацию об одном или нескольких товарах в определённый магазин (`storeUuid`) пользователя платформы.
   *
   * При обновлении товара необходимо передать полный набор полей описания товара. Облако удаляет старые и записывает новые поля.
   *
   * `POST /api/v1/inventories/stores/{storeUuid}/products`
   *
   * @param storeUuid Идентификатор магазина в Облаке Эвотор, в рамках которого действует запрос. Формат – `uuid4`.
   * @param products Массив товаров, которые требуется передать в магазин.
   */
  uploadProducts(storeUuid: string, products: RequestUploadProducts): Promise<ResponseUploadProducts> {
    return this.rest.post<ResponseUploadProducts>({
      url: `/api/v1/inventories/stores/${encodeURIComponent(storeUuid)}/products`,
      payload: products as JSONValue,
    });
  }

  /**
   * Удаляет товары магазина.
   *
   * HTTP-запрос с пустым массивом удалит все товары в магазине.
   * Чтобы удалить определённый товар, в теле HTTP-запроса требуется указать его UUID.
   *
   * `POST /api/v1/inventories/stores/{storeUuid}/products/delete`
   *
   * @param storeUuid Идентификатор магазина в Облаке Эвотор, в рамках которого действует запрос. Формат – `uuid4`.
   * @param products Массив товаров, которые требуется удалить. Пустой массив удаляет все товары магазина.
   */
  deleteProducts(storeUuid: string, products: RequestDeleteProducts): Promise<ResponseDeleteProducts> {
    return this.rest.post<ResponseDeleteProducts>({
      url: `/api/v1/inventories/stores/${encodeURIComponent(storeUuid)}/products/delete`,
      payload: products as JSONValue,
    });
  }

  /**
   * Возвращает массив документов магазина (`storeUuid`).
   *
   * Если не заданы даты начала и окончания выборки, возвращаются документы, созданные за последний месяц с текущей даты.
   * Для выгрузки доступны документы, созданные не более шести месяцев назад, с момента выполнения запроса.
   * Диапазон дат в рамках одного запроса не может превышать один месяц.
   *
   * `GET /api/v1/inventories/stores/{storeUuid}/documents`
   *
   * @param storeUuid Идентификатор магазина в Облаке Эвотор, в рамках которого действует запрос. Формат – `uuid4`.
   * @param params Параметры выборки документов.
   */
  getDocuments(storeUuid: string, params?: RequestGetDocuments): Promise<ResponseGetDocuments> {
    return this.rest.get<ResponseGetDocuments>({
      url: `/api/v1/inventories/stores/${encodeURIComponent(storeUuid)}/documents`,
      query: {
        deviceUuid: params?.deviceUuid,
        ltCloseDate: params?.ltCloseDate,
        gtCloseDate: params?.gtCloseDate,
        types: params?.types,
      },
    });
  }

  /**
   * Возвращает схемы товаров для определённого магазина (`storeUuid`) пользователя платформы.
   *
   * Эвотор возвращает схемы в соответствии с приложением, создавшим схемы.
   * Эвотор определяет приложение по токену, который сторонний сервис передаёт в заголовке `X-Authorization`.
   *
   * `GET /api/v1/inventories/stores/{storeUuid}/products/schemes`
   *
   * @param storeUuid Идентификатор магазина в Облаке Эвотор, в рамках которого действует запрос. Формат – `uuid4`.
   */
  getSchemes(storeUuid: string): Promise<ResponseGetSchemes> {
    return this.rest.get<ResponseGetSchemes>({
      url: `/api/v1/inventories/stores/${encodeURIComponent(storeUuid)}/products/schemes`,
    });
  }

  /**
   * Создаёт / изменяет схемы товаров для определённого магазина (`storeUuid`) пользователя платформы.
   *
   * Эвотор создаёт схему в рамках приложения.
   * Эвотор определяет приложение по токену, который сторонний сервис передаёт в заголовке `X-Authorization`.
   *
   * `POST /api/v1/inventories/stores/{storeUuid}/products/schemes`
   *
   * @param storeUuid Идентификатор магазина в Облаке Эвотор, в рамках которого действует запрос. Формат – `uuid4`.
   * @param schemas Массив значений схемы.
   */
  uploadSchemes(storeUuid: string, schemas: RequestUploadSchemes): Promise<ResponseUploadSchemes> {
    return this.rest.post<ResponseUploadSchemes>({
      url: `/api/v1/inventories/stores/${encodeURIComponent(storeUuid)}/products/schemes`,
      payload: schemas as JSONValue,
    });
  }

  /**
   * Удаляет указанные схемы товаров.
   *
   * В теле запроса укажите один или несколько идентификаторов схем, которые требуется удалить.
   *
   * `POST /api/v1/inventories/stores/{storeUuid}/products/schemes/delete`
   *
   * @param storeUuid Идентификатор магазина в Облаке Эвотор, в рамках которого действует запрос. Формат – `uuid4`.
   * @param schemas Массив идентификаторов схем. Формат – `uuid4`, уникальный в рамках приложения.
   */
  deleteSchemes(storeUuid: string, schemas: RequestDeleteSchemes): Promise<ResponseDeleteSchemes> {
    return this.rest.post<ResponseDeleteSchemes>({
      url: `/api/v1/inventories/stores/${encodeURIComponent(storeUuid)}/products/schemes/delete`,
      payload: schemas as JSONValue,
    });
  }

  /**
   * Возвращает дополнительные поля товаров в определённом магазине (`storeUuid`) пользователя платформы.
   *
   * `GET /api/v1/inventories/stores/{storeUuid}/products/extras`
   *
   * @param storeUuid Идентификатор магазина в Облаке Эвотор, в рамках которого действует запрос. Формат – `uuid4`.
   */
  getExtras(storeUuid: string): Promise<ResponseGetExtras> {
    return this.rest.get<ResponseGetExtras>({
      url: `/api/v1/inventories/stores/${encodeURIComponent(storeUuid)}/products/extras`,
    });
  }

  /**
   * Создаёт / изменяет дополнительные поля товаров в определённом магазине (`storeUuid`) пользователя платформы.
   *
   * `POST /api/v1/inventories/stores/{storeUuid}/products/extras`
   *
   * @param storeUuid Идентификатор магазина в Облаке Эвотор, в рамках которого действует запрос. Формат – `uuid4`.
   * @param extras Массив дополнительных полей.
   */
  uploadExtras(storeUuid: string, extras: RequestUploadExtras): Promise<ResponseUploadExtras> {
    return this.rest.post<ResponseUploadExtras>({
      url: `/api/v1/inventories/stores/${encodeURIComponent(storeUuid)}/products/extras`,
      payload: extras as JSONValue,
    });
  }

  /**
   * Удаляет указанные дополнительные поля товаров.
   *
   * В теле запроса укажите один или несколько идентификаторов дополнительных полей, которые требуется удалить.
   *
   * `POST /api/v1/inventories/stores/{storeUuid}/products/extras/delete`
   *
   * @param storeUuid Идентификатор магазина в Облаке Эвотор, в рамках которого действует запрос. Формат – `uuid4`.
   * @param extras Массив идентификаторов дополнительных полей. Формат – `uuid4`, уникальный в рамках приложения.
   */
  deleteExtras(storeUuid: string, extras: RequestDeleteExtras): Promise<ResponseDeleteExtras> {
    return this.rest.post<ResponseDeleteExtras>({
      url: `/api/v1/inventories/stores/${encodeURIComponent(storeUuid)}/products/extras/delete`,
      payload: extras as JSONValue,
    });
  }
}
