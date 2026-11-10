import type { Device, Document, Employee, MeasureName, ProductType, Store } from "./entities.ts";
import type { JSONValue } from "./lib.ts";

/**
 * Типы входящих вебхуков Эвотор.
 *
 * Облако Эвотор вызывает сторонний сервис по адресам `partner.ru` — пользователь сам организует приём,
 * библиотека даёт только типы payload-ов.
 *
 * Документация: https://api.evotor.ru/docs/#tag/Вебхуки-запросы
 * Документация: https://api.evotor.ru/docs/#tag/Вебхуки-уведомления
 */

/** Идентификатор пользователя в Облаке Эвотор. Формат – `[0-9]{2}-[0-9]{15}`. */
export type WebhookUserId = string;

/**
 * Тело запроса «Авторизация пользователя».
 *
 * `POST /partner.ru/api/v1/user/verify`
 */
export type WebhookUserVerify = {
  /** Идентификатор пользователя в Облаке Эвотор. */
  userId: WebhookUserId;
  /** Имя пользователя в стороннем сервисе. */
  username?: string;
  /** Пароль пользователя в стороннем сервисе. */
  password?: string;
  /** Дополнительные данные о пользователе, заданные в интерфейсе магазина приложений. */
  customField?: string;
};

/**
 * Тело запроса «Регистрация учётной записи».
 *
 * `POST /partner.ru/api/v1/user/create`
 */
export type WebhookUserCreate = {
  /** Идентификатор пользователя в Облаке Эвотор. */
  userId: WebhookUserId;
  /** Дополнительные данные о пользователе, заданные в интерфейсе магазина приложений. */
  customField?: string;
};

/**
 * Ответ стороннего сервиса на запросы авторизации и регистрации пользователя.
 *
 * `POST /partner.ru/api/v1/user/verify`, `POST /partner.ru/api/v1/user/create`
 */
export type WebhookUserResponse = {
  /** Идентификатор пользователя в Облаке Эвотор. */
  userId: WebhookUserId;
  /** Токен, который облако Эвотор будет передавать в заголовке `Authorization` с типом `Bearer`. */
  token: string;
};

/**
 * Тело запроса «Передача токена Облака Эвотор».
 *
 * `POST /partner.ru/api/v1/user/token`
 */
export type WebhookUserToken = {
  /** Идентификатор пользователя в Облаке Эвотор. */
  userId: WebhookUserId;
  /** Токен, с которым приложение будет обращаться в Облако Эвотор за данными пользователя. */
  token: string;
};

/**
 * Ответ на запрос поиска товара по штрихкоду.
 *
 * `GET /partner.ru/api/v1/commodities`
 */
export type WebhookCommodity = {
  /** Название товара. */
  name?: string;
  /** Массив строк кодов алкогольной продукции ЕГАИС. */
  alcCodes?: string[] | null;
  /** Массив штрихкодов товара. */
  scanCodes?: string[] | null;
  /** Крепость алкогольной продукции. */
  alcoholByVolume?: number | null;
  /** Код вида алкогольной продукции ФСРАР. */
  alcoholProductKindCode?: number | null;
  /** Ёмкость тары алкогольной продукции в литрах. */
  tareVolume?: number | null;
  /** Единица измерения товара. */
  measure?: MeasureName;
};

/**
 * Магазин, созданный или изменённый в Личном кабинете.
 *
 * `PUT /partner.ru/api/v1/inventories/stores`
 */
export type WebhookStore = Omit<Store, "code">;

/**
 * Сотрудник, созданный или изменённый в Личном кабинете.
 *
 * `PUT /partner.ru/api/v1/inventories/employees`
 */
export type WebhookEmployee = Omit<Employee, "code">;

/**
 * Смарт-терминал, созданный или изменённый в Личном кабинете.
 *
 * `PUT /partner.ru/api/v1/inventories/devices`
 */
export type WebhookDevice = Omit<Device, "code">;

/**
 * Документ, созданный на смарт-терминале.
 *
 * `PUT /partner.ru/api/v1/inventories/stores/{storeUuid}/documents`
 */
export type WebhookDocument = Omit<Document, "storeUuid"> & {
  /** Идентификатор магазина. В вебхуке магазин передаётся в пути запроса. */
  storeUuid?: string;
};

/** Позиция чека. */
export type WebhookReceiptItem = {
  /** Идентификатор товара. Формат – `uuid4`. */
  id?: string;
  /** Название товара. */
  name?: string;
  /** Тип товара. */
  itemType?: ProductType;
  /** Единица измерения товара. */
  measureName?: MeasureName;
  /** Количество товара. */
  quantity?: number;
  /** Отпускная цена товара. */
  price?: number;
  /** Закупочная цена товара. */
  costPrice?: number;
  /** Общая цена товара. */
  sumPrice?: number;
  /** Сумма налога на товар. */
  tax?: number;
  /** Сумма налога на товар, выраженная в процентах. */
  taxPercent?: number;
  /** Общая сумма скидки на товар. */
  discount?: number;
};

/** Данные чека. */
export type WebhookReceiptData = {
  /** Идентификатор чека. Формат – `uuid4`. */
  id?: string;
  /** Идентификатор устройства в Облаке Эвотор. Формат – `uuid4`, регистрозависимый. */
  deviceId?: string;
  /** Идентификатор магазина. Формат – `uuid4`. */
  storeId?: string;
  /** Дата и время создания чека. */
  dateTime?: number;
  /** Тип документа. */
  type?: "SELL" | "PAYBACK";
  /** Номер смены. */
  shiftId?: string;
  /** Уникальный идентификатор сотрудника, продавшего товар. */
  employeeId?: string;
  /** Способ оплаты. */
  paymentSource?: "PAY_CASH" | "PAY_CARD" | "OTHER";
  /** `true` – информационный чек, `false` – фискальный чек. */
  infoCheck?: boolean;
  /** Относится ли документ к ЕГАИС. */
  egais?: boolean;
  /** Массив позиций чека. */
  items?: WebhookReceiptItem[];
  /** Общая сумма налога. */
  totalTax?: number;
  /** Общая сумма скидки. */
  totalDiscount?: number;
  /** Общая сумма чека. */
  totalAmount?: number;
  /** Дополнительные поля, например поля программ лояльности. */
  extras?: Record<string, JSONValue>;
};

/**
 * Тело запроса «Отправить чек (V2)».
 *
 * `POST /partner.ru/api/v2/receipts`
 */
export type WebhookReceipt = {
  /** Уникальный идентификатор события отправки чека. */
  id?: string;
  /** Время в миллисекундах, в Unix-формате. */
  timestamp?: number;
  /** Идентификатор пользователя в Облаке Эвотор. */
  userId?: WebhookUserId;
  /** Тип события. */
  type?: string;
  /** Версия API. */
  version?: number;
  /** Данные чека. */
  data?: WebhookReceiptData;
};

/** Удержанная сумма. */
export type WebhookChargedSum = {
  /** Значение суммы. До двух знаков в дробной части. */
  amount?: number;
  /** Наименование валюты. */
  currency?: string;
};

/** Платная опция подписки. */
export type WebhookAddon = {
  /** Идентификатор платной опции. */
  id?: string;
  /** Количественная мера платной опции, которую выбрал пользователь. */
  quantity?: number;
};

/** Общая часть события подписки. */
export type WebhookSubscriptionEventBase = {
  /** Идентификатор подписки. Формат – `uuid4`. */
  subscriptionId: string;
  /** Идентификатор приложения. Формат – `uuid4`. */
  productId: string;
  /** Идентификатор пользователя в Облаке Эвотор. */
  userId: WebhookUserId;
  /** Дата и время отправки события в соответствии с ISO 8601. */
  timestamp: string;
  /** Номер события в последовательности. Необходим для соблюдения порядка обработки событий. */
  sequenceNumber: number;
};

/** Подписка создана. Сообщает о том, что пользователь приобрёл приложение в Личном кабинете. */
export type WebhookSubscriptionCreated = WebhookSubscriptionEventBase & {
  type: "SubscriptionCreated";
  /** Идентификатор тарифа, который вы создаёте на портале разработчиков. */
  planId: string;
  /** Строка вида `PnDT`, где n – количество дней бесплатного периода. */
  trialPeriodDuration: string;
  /** Количество оплаченных устройств. */
  deviceNumber?: number;
};

/** Список платных опций, выбранных пользователем. */
export type WebhookAddonsUpdated = WebhookSubscriptionEventBase & {
  type: "AddonsUpdated";
  /** Список платных опций, которые выбрал пользователь при подписке, обновлении или изменении тарифа. */
  addons: WebhookAddon[];
};

/** Подписка активирована. Сообщает об успешной оплате. */
export type WebhookSubscriptionActivated = WebhookSubscriptionEventBase & {
  type: "SubscriptionActivated";
  /** Дата следующего платежа. */
  nextBillingDate: string;
  /** Удержанная сумма. */
  chargedSum?: WebhookChargedSum;
};

/** Подписка продлена на следующий период. Сообщает об успешной оплате очередного периода. */
export type WebhookSubscriptionRenewed = WebhookSubscriptionEventBase & {
  type: "SubscriptionRenewed";
  /** Дата следующего платежа. */
  nextBillingDate: string;
  /** Удержанная сумма. */
  chargedSum?: WebhookChargedSum;
};

/** Изменились условия подписки. */
export type WebhookSubscriptionTermsChanged = WebhookSubscriptionEventBase & {
  type: "SubscriptionTermsChanged";
  /** Идентификатор тарифа, который вы создаёте на портале разработчиков. */
  planId?: string;
  /** Количество оплаченных устройств. */
  deviceNumber?: number;
  /** Дата следующего платежа. */
  nextBillingDate?: string;
  /** Удержанная сумма. */
  chargedSum?: WebhookChargedSum;
};

/** Пользователь отправил запрос на завершение подписки (удалил приложение из Личного кабинета). */
export type WebhookSubscriptionTerminationRequested = WebhookSubscriptionEventBase & {
  type: "SubscriptionTerminationRequested";
};

/** Подписка завершена. Приходит, если не прошла регулярная оплата. */
export type WebhookSubscriptionTerminated = WebhookSubscriptionEventBase & {
  type: "SubscriptionTerminated";
};

/**
 * Событие подписки.
 *
 * `POST /partner.ru/api/v1/subscription/event`
 */
export type WebhookSubscriptionEvent =
  | WebhookSubscriptionCreated
  | WebhookAddonsUpdated
  | WebhookSubscriptionActivated
  | WebhookSubscriptionRenewed
  | WebhookSubscriptionTermsChanged
  | WebhookSubscriptionTerminationRequested
  | WebhookSubscriptionTerminated;

/** Активация пробного периода. */
export type WebhookTrialStarted = {
  /** Тип события. */
  type: "trialStarted";
  /** Дата и время активации пробного периода. */
  date?: string;
  data?: {
    /** Длительность пробного периода. */
    trialDuration?: number;
    /** Единица измерения длительности пробного периода. */
    trialPeriodMeasure?: "day" | "month" | "year";
    /** Идентификатор пользователя в Облаке Эвотор. */
    userId?: WebhookUserId;
    /** Код тарифа, для которого активирован пробный период. */
    tariffId?: string;
  };
};

/**
 * Событие установки или удаления приложения.
 *
 * `POST /partner.ru/api/v2/installation/event`
 */
export type WebhookInstallationEvent = {
  /** Идентификатор события. Формат – `uuid4`. */
  id: string;
  /** Дата и время отправки события, в миллисекундах, в формате unix timestamp. */
  timestamp: number;
  /** Версия API, к которой относятся события. */
  version: number;
  /** Тип события. */
  type: "ApplicationInstalled" | "ApplicationUninstalled";
  data: {
    /** Идентификатор приложения в Облаке Эвотор. Формат – `uuid4`. */
    productId: string;
    /** Идентификатор пользователя в Облаке Эвотор. */
    userId: WebhookUserId;
  };
};

/**
 * Все payload-ы входящих вебхуков.
 *
 * Ключ — адрес вебхука, значение — тип тела запроса.
 */
export type WebhookEventMap = {
  "user.verify": WebhookUserVerify;
  "user.create": WebhookUserCreate;
  "user.token": WebhookUserToken;
  "commodities": WebhookCommodity;
  "inventories.stores": WebhookStore[];
  "inventories.employees": WebhookEmployee[];
  "inventories.devices": WebhookDevice[];
  "inventories.documents": WebhookDocument[];
  "receipts": WebhookReceipt;
  "subscription.event": WebhookSubscriptionEvent;
  "installation.event": WebhookInstallationEvent;
};
