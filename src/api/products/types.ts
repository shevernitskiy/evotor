import type {
  Document,
  DocumentType,
  Product,
  ProductExtra,
  ProductSchema,
  ProductToDelete,
} from "../../typings/entities.ts";

/** Ответ на запрос списка товаров. */
export type ResponseGetProducts = Product[];

/** Тело запроса передачи товаров. */
export type RequestUploadProducts = Product[];

/** Ответ на запрос передачи товаров. */
export type ResponseUploadProducts = void;

/** Тело запроса удаления товаров. */
export type RequestDeleteProducts = ProductToDelete[];

/** Ответ на запрос удаления товаров. */
export type ResponseDeleteProducts = void;

/** Параметры выборки документов. */
export type RequestGetDocuments = {
  /**
   * Идентификатор устройства в Облаке Эвотор.
   *
   * Формат – `uuid4`, в соответствии с RFC 4122. Регистрозависимый.
   */
  deviceUuid?: string;
  /**
   * Дата окончания выборки. Ответ содержит документы, созданные до указанной даты.
   *
   * Если не заданы даты начала и окончания выборки, возвращаются документы, созданные за последний месяц с текущей даты.
   * Для выгрузки доступны документы, созданные не более шести месяцев назад, с момента выполнения запроса.
   * Диапазон дат (от `gtCloseDate` до `ltCloseDate`) в рамках одного запроса не может превышать один месяц.
   *
   * Формат времени — 2017-01-10T09:33:19.757+0000.
   */
  ltCloseDate?: string;
  /**
   * Дата начала выборки. Ответ содержит документы, созданные после указанной даты.
   *
   * Если не заданы даты начала и окончания выборки, возвращаются документы, созданные за последний месяц с текущей даты.
   * Для выгрузки доступны документы, созданные не более шести месяцев назад, с момента выполнения запроса.
   * Диапазон дат (от `gtCloseDate` до `ltCloseDate`) в рамках одного запроса не может превышать один месяц.
   *
   * Формат времени — 2017-01-10T09:33:19.757+0000.
   */
  gtCloseDate?: string;
  /**
   * Ответ будет содержать документы определённых типов. Можно указать несколько типов через запятую.
   *
   * Кассовые документы — `SELL`, `PAYBACK`, `CASH_INCOME`, `CASH_OUTCOME`, `OPEN_SESSION`, `FPRINT`, `CLOSE_SESSION`;
   * инвентаризация — `INVENTORY`; приёмка — `ACCEPT`; возврат поставщику — `RETURN`;
   * списание — `WRITE_OFF`; акт переоценки — `REVALUATION`; вскрытие тары — `OPEN_TARE`.
   */
  types?: DocumentType[];
};

/** Ответ на запрос списка документов. */
export type ResponseGetDocuments = Document[];

/** Ответ на запрос списка схем товаров. */
export type ResponseGetSchemes = ProductSchema[];

/** Тело запроса передачи схем товаров. */
export type RequestUploadSchemes = ProductSchema[];

/** Ответ на запрос передачи схем товаров. */
export type ResponseUploadSchemes = void;

/** Тело запроса удаления схем товаров: массив идентификаторов схем. */
export type RequestDeleteSchemes = string[];

/** Ответ на запрос удаления схем товаров. */
export type ResponseDeleteSchemes = void;

/** Ответ на запрос списка дополнительных полей товаров. */
export type ResponseGetExtras = ProductExtra[];

/** Тело запроса передачи дополнительных полей товаров. */
export type RequestUploadExtras = ProductExtra[];

/** Ответ на запрос передачи дополнительных полей товаров. */
export type ResponseUploadExtras = void;

/** Тело запроса удаления дополнительных полей товаров: массив идентификаторов дополнительных полей. */
export type RequestDeleteExtras = string[];

/** Ответ на запрос удаления дополнительных полей товаров. */
export type ResponseDeleteExtras = void;
