import type { JSONValue } from "./lib.ts";

/** Единица измерения товара. */
export type MeasureName = "" | "шт" | "кг" | "л" | "м" | "км" | "м2" | "м3" | "компл" | "упак" | "ед" | "дроб";

/** Ставка НДС для товара. */
export type Tax = "NO_VAT" | "VAT_10" | "VAT_18" | "VAT_0" | "VAT_18_118" | "VAT_10_110";

/** Тип товара. */
export type ProductType =
  | "NORMAL"
  | "ALCOHOL_MARKED"
  | "ALCOHOL_NOT_MARKED"
  | "TOBACCO_MARKED"
  | "SHOES_MARKED"
  | "MEDICINE_MARKED"
  | "SERVICE";

/** Магазин пользователя платформы Эвотор. */
export type Store = {
  /** Уникальный идентификатор магазина в Облаке Эвотор. Формат – `uuid4`. */
  uuid: string;
  /** Имя магазина, которое пользователь указал в Личном кабинете. */
  name: string;
  /** Адрес магазина, который пользователь указал в Личном кабинете. Может быть `null`. */
  address?: string | null;
  /** Облако Эвотор не использует это поле. Нужно для сопоставления сущностей, если сторонняя система не работает с идентификаторами. */
  code?: string | null;
};

/** Роль сотрудника, задаёт права доступа к смарт-терминалу. */
export type EmployeeRole = "ADMIN" | "CASHIER" | "MANUAL";

/** Сотрудник пользователя платформы Эвотор. */
export type Employee = {
  /** Уникальный идентификатор сотрудника в Облаке Эвотор. Формат – `uuid4`. */
  uuid: string;
  /** Имя сотрудника, которое пользователь указал в Личном кабинете. */
  name: string;
  /** Роль сотрудника. */
  role: EmployeeRole;
  /** Идентификаторы магазинов, в которых работает сотрудник. */
  stores: string[];
  /** Фамилия сотрудника. Может быть `null`. */
  lastName?: string | null;
  /** Отчество сотрудника. Может быть `null`. */
  patronymicName?: string | null;
  /** Номер телефона сотрудника в платформе Эвотор. Может быть `null`. */
  phone?: number | null;
  /** Облако Эвотор не использует это поле. Нужно для сопоставления сущностей, если сторонняя система не работает с идентификаторами. */
  code?: string | null;
};

/** Смарт-терминал пользователя платформы Эвотор. */
export type Device = {
  /** Уникальный идентификатор смарт-терминала в Облаке Эвотор. Формат – `uuid4`. */
  uuid?: string;
  /** Облако Эвотор не использует это поле. Нужно для сопоставления сущностей, если сторонняя система не работает с идентификаторами. */
  code?: string | null;
  /** Имя смарт-терминала, которое пользователь дал устройству в Личном кабинете. */
  name?: string;
  /** Идентификатор магазина, в котором работает смарт-терминал. */
  storeUuid?: string;
  /** Часовой пояс, в котором работает смарт-терминал, в миллисекундах относительно UTC. */
  timezoneOffset?: number;
};

/** Товар или группа товаров. */
export type Product = {
  /** Идентификатор товара или группы товаров, уникальный в рамках магазина. Формат – `uuid4`. */
  uuid: string;
  /** Название товара или группы товаров. Не может быть `null` или пустой строкой. */
  name: string;
  /** `true` – группа товаров, `false` – товар. */
  group: boolean;
  /** Тип товара. Передаётся только если `group = false`. */
  type?: ProductType;
  /** Уникальный идентификатор группы, к которой принадлежит товар или группа товаров. Может быть `null`. */
  parentUuid?: string | null;
  /** Является ли группа хранилищем для модификаций. Передаётся только если `group = true`. */
  hasVariants?: boolean;
  /** Код товара или группы товаров. */
  code?: string;
  /** Количество товара в наличии (остаток). Передаётся только если `group = false`. */
  quantity?: number;
  /** Единица измерения товара. Передаётся только если `group = false`. */
  measureName?: MeasureName;
  /** Ставка НДС для товара. Передаётся только если `group = false`. */
  tax?: Tax;
  /** Отпускная цена товара. */
  price?: number;
  /** `true` – товар можно добавить в чек, `false` – нельзя. */
  allowToSell?: boolean;
  /** Закупочная цена товара. */
  costPrice?: number;
  /** Описание товара. Может быть `null`. */
  description?: string | null;
  /** Артикул товара. Может быть `null`. */
  articleNumber?: string | null;
  /** Массив штрихкодов товара. Может быть `null`. */
  barCodes?: string[] | null;
  /** Крепость алкогольной продукции. */
  alcoholByVolume?: number | null;
  /** Код вида алкогольной продукции ФСРАР. */
  alcoholProductKindCode?: number | null;
  /** Ёмкость тары алкогольной продукции в литрах. */
  tareVolume?: number | null;
  /** Массив строк кодов алкогольной продукции ЕГАИС. */
  alcoCodes?: string[] | null;
  /** Дополнительные атрибуты товара. Используется начиная с версии товаров V2. */
  attributes?: Record<string, JSONValue>;
};

/** Товар, который требуется удалить из магазина. */
export type ProductToDelete = {
  /** Уникальный UUID товара в платформе Эвотор. */
  uuid: string;
};

/** Тип поля схемы товара. */
export type ProductSchemaItemType = "TEXT_FIELD" | "DICTIONARY_FIELD";

/** Элемент раскрывающегося списка поля схемы. */
export type ProductSchemaDictionaryItem = {
  /** Название элемента списка. */
  title?: string;
  /** Идентификатор элемента. Формат – `uuid4`. */
  value?: string;
};

/** Поле схемы товара. */
export type ProductSchemaItem = {
  /** Имя поля. */
  title?: string;
  /** Указывает можно редактировать поле или нет. */
  editable?: boolean;
  /** Идентификатор поля. Формат – `uuid4`. */
  uuid?: string;
  /** Определяет набор данных, которые содержит дополнительное поле. */
  type?: ProductSchemaItemType;
  /** Валидный JSON-объект с произвольными данными, доступными на терминале из JavaScript. Только для `TEXT_FIELD`. */
  data?: Record<string, JSONValue>;
  /** Валидное регулярное выражение. Только для `TEXT_FIELD`. */
  regexp?: string;
  /** Указывает можно выбрать несколько элементов раскрывающегося списка или нет. Только для `DICTIONARY_FIELD`. */
  multiple?: boolean;
  /** Массив элементов раскрывающегося списка. Только для `DICTIONARY_FIELD`. */
  items?: ProductSchemaDictionaryItem[];
};

/** Схема дополнительных полей товара. */
export type ProductSchema = {
  /** Идентификатор схемы в магазине. Формат – `uuid4`. */
  uuid: string;
  /** Идентификатор приложения в Облаке Эвотор. Формат – `uuid4`. */
  appId: string;
  /** Массив полей схемы. */
  items: ProductSchemaItem[];
};

/** Дополнительное поле товара. */
export type ProductExtra = {
  /** Идентификатор дополнительного поля. Формат – `uuid4`. */
  uuid?: string;
  /** Идентификатор приложения в Облаке Эвотор. Формат – `uuid4`. */
  appId?: string;
  /** Идентификатор товара, связанного с дополнительным полем. */
  key?: {
    uuid?: string;
  };
  /** Поля, необходимые для отображения дополнительного поля в элементе управления смарт-терминала. */
  scheme?: {
    /** Значение, которое будет отображаться в элементе управления. */
    value?: string;
    /** Идентификатор поля из схемы. Формат – `uuid4`. */
    fieldId?: string;
  };
  /** Валидный JSON-объект с данными, отображаемыми с помощью JavaScript в интерфейсе смарт-терминала. */
  data?: Record<string, JSONValue>;
};

/** Тип документа. */
export type DocumentType =
  | "SELL"
  | "PAYBACK"
  | "CASH_INCOME"
  | "CASH_OUTCOME"
  | "OPEN_SESSION"
  | "FPRINT"
  | "CLOSE_SESSION"
  | "INVENTORY"
  | "ACCEPT"
  | "RETURN"
  | "WRITE_OFF"
  | "REVALUATION"
  | "OPEN_TARE";

/** Тип транзакции документа. */
export type TransactionType =
  | "DISCOUNT_DOCUMENT"
  | "DISCOUNT_POSITION"
  | "DISCOUNT_DOCUMENT_POSITION"
  | "DOCUMENT_OPEN"
  | "DOCUMENT_CLOSE"
  | "DOCUMENT_CLOSE_FPRINT"
  | "REGISTER_POSITION"
  | "REGISTER_BILLS"
  | "CASH_INCOME"
  | "CASH_OUTCOME"
  | "INVENTORY"
  | "PAYMENT"
  | "OPEN_SESSION"
  | "CLOSE_SESSION"
  | "FPRINT_OPEN_SESSION"
  | "FPRINT_X_REPORT"
  | "FPRINT_Z_REPORT"
  | "POSITION_TAX"
  | "REVALUATION";

/** Транзакция документа. */
export type DocumentTransaction = {
  /** Тип транзакции. */
  type: TransactionType;
  [key: string]: JSONValue | undefined;
};

/** Документ магазина. */
export type Document = {
  /** Идентификатор документа в Облаке Эвотор, уникальный в рамках магазина `storeUuid`. Формат – `uuid4`. */
  uuid: string;
  /** Тип документа. */
  type: DocumentType;
  /** Транзакции документа. */
  transactions?: DocumentTransaction[];
  /** Идентификатор устройства в Облаке Эвотор. Формат – `uuid4`, регистрозависимый. */
  deviceUuid: string;
  /** Дата закрытия документа в соответствии с ISO 8601. */
  closeDate: string;
  /** Дата открытия документа в соответствии с ISO 8601. */
  openDate: string;
  /** Код сотрудника, который открыл документ. Может быть `null`. */
  openUserCode: number | null;
  /** Идентификатор сотрудника, который открыл документ. Формат – `uuid4`. */
  openUserUuid: string;
  /** Код сотрудника, который закрыл документ. Может быть `null`. */
  closeUserCode: number | null;
  /** Идентификатор сотрудника, который закрыл документ. Формат – `uuid4`. */
  closeUserUuid: string;
  /** Идентификатор смены, в течение которой был создан документ. Формат – `uuid4`. */
  sessionUUID: string;
  /** Номер смены. */
  sessionNumber: string;
  /** Номер документа. */
  number: number;
  /** Окончательная сумма чека с учётом скидок. */
  closeResultSum: string;
  /** Общая сумма чека (число) без учёта скидок. */
  closeSum: string;
  /** Идентификатор магазина. Формат – `uuid4`. */
  storeUuid: string;
  /** Поля с дополнительной информацией. По токену Облака Эвотор определяется, какие поля необходимо вернуть. Может быть `null`. */
  extras: Record<string, JSONValue> | null;
  /** Версия формата документа. */
  version: "V1" | "V2";
};

/** Тип документа ОФД. */
export type OfdDocumentType = "SELL" | "Z_REPORT";

/** Магазин, зарегистрированный в ОФД. */
export type OfdStore = {
  /** Идентификатор магазина в ОФД. */
  id: number;
  /** Идентификатор магазина, в который вложен данный магазин. В ОФД иерархия магазинов древовидная. */
  parentId: number;
  /** Название магазина в ОФД. */
  name: string;
};

/** Смарт-терминал, зарегистрированный в ОФД. */
export type OfdDevice = {
  /** Идентификатор смарт-терминала в ОФД. */
  id: number;
  /** Идентификатор магазина, которому принадлежит смарт-терминал. */
  storeId: number;
  /** Название смарт-терминала в ОФД. */
  name: string;
  /** Адрес смарт-терминала. */
  address?: string;
};

/** Позиция документа ОФД. */
export type OfdDocumentItem = {
  /** Модификаторы позиции. */
  modifiers: JSONValue[];
  /** Сумма позиции. */
  sum: number;
  /** Цена позиции. */
  price: number;
  /** Количество позиции. */
  quantity: number;
  /** Сумма НДС позиции. */
  ndsNo: number;
  /** Штрихкод товара. */
  barcode: string;
  /** Наименование товара. */
  name: string;
};

/** Документ, переданный в ОФД. */
export type OfdDocument = {
  /** Позиции документа. */
  items: OfdDocumentItem[];
  /** Отменённые позиции документа. */
  stornoItems: JSONValue[];
  /** Модификаторы документа. */
  modifiers: JSONValue[];
  /** Тип операции. */
  operationType: number;
  /** Оператор, оформивший документ. */
  operator: string;
  /** Номер чека. */
  receiptCode: number;
  /** Дата и время чека. */
  receiptDate: string;
  /** Номер смены. */
  shiftNumber: number;
  /** ИНН пользователя. */
  userInn: string;
  /** Пользователь. */
  user: string;
  /** Сумма НДС документа. */
  ndsNo: number;
  /** Идентификатор запроса. */
  rqId: number;
  /** Номер запроса. */
  requestNumber: number;
  /** Итоговая сумма документа. */
  totalSum: number;
  /** Сумма наличными. */
  cashTotalSum: number;
  /** Сумма безналичными. */
  ecashTotalSum: number;
  /** Фискальный признак. */
  fiscalSign: number;
  /** Номер фискального накопителя. */
  fiscalDriveNumber: string;
  /** Номер фискального документа. */
  fiscalDocumentNumber: number;
  /** Тип системы налогообложения. */
  taxationType: number;
};

/** Ответ раздела «Данные ОФД». */
export type OfdResponse<T> = {
  /** Версия схемы данных. */
  version: number;
  /** Источник данных. */
  provider: string;
  /** Данные. */
  data: T;
};
