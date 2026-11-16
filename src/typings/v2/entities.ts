import type { JSONValue } from "../lib.ts";

/** Страница данных API Облака V2. */
export type Paging<T> = {
  /** Данные страницы. */
  items: T[];
  /** Информация о следующей странице. Если текущая страница последняя — объект пустой. */
  paging: {
    /** Значение параметра `cursor` для получения следующей страницы. */
    next_cursor?: string;
  };
};

/** Единица измерения товара. */
export type MeasureName =
  | "шт"
  | "шт или ед"
  | "г"
  | "кг"
  | "т"
  | "см"
  | "дм"
  | "м"
  | "кв. см"
  | "кв. дм"
  | "кв. м"
  | "мл"
  | "л"
  | "куб. м"
  | "кВт*ч"
  | "Гкал"
  | "сутки"
  | "час"
  | "мин"
  | "с"
  | "Кбайт"
  | "Мбайт"
  | "Гбайт"
  | "Тбайт";

/** Ставка НДС для товара. */
export type Tax =
  | "NO_VAT"
  | "VAT_0"
  | "VAT_10"
  | "VAT_10_110"
  | "VAT_18"
  | "VAT_18_118"
  | "VAT_5"
  | "VAT_5_105"
  | "VAT_7"
  | "VAT_7_107"
  | "VAT_22"
  | "VAT_22_122";

/** Тип товара. */
export type ProductType =
  | "NORMAL"
  | "DAIRY_MARKED"
  | "WATER_MARKED"
  | "TOBACCO_MARKED"
  | "SHOES_MARKED"
  | "MEDICINE_MARKED"
  | "SERVICE"
  | "ALCOHOL_NOT_MARKED"
  | "ALCOHOL_MARKED"
  | "NOT_ALCOHOL_BEER_MARKED"
  | "BEER_MARKED_KEG"
  | "PERFUME_MARKED"
  | "PHOTOS_MARKED"
  | "TYRES_MARKED"
  | "TOBACCO_PRODUCTS_MARKED"
  | "LIGHT_INDUSTRY_MARKED"
  | "JEWELRY_MARKED"
  | "FUR_MARKED"
  | "BIKE_MARKED"
  | "LOTTERY_TICKET"
  | "LOTTERY_PRIZE"
  | "MEDICAL_DEVICES_MARKED"
  | "VETERINARY_MARKED"
  | "CAVIAR_MARKED"
  | "FURSLP_MARKED"
  | "AUTO_FLUIDS_MARKED"
  | "CHEMICALS_MARKED";

/** Магазин пользователя платформы Эвотор. */
export type Store = {
  /** Уникальный идентификатор магазина в Облаке Эвотор. */
  id: string;
  /** Имя магазина, которое пользователь указал в Личном кабинете. */
  name: string;
  /** Адрес магазина, который пользователь указал в Личном кабинете. */
  address?: string;
  /** Идентификатор пользователя Эвотор. */
  user_id: string;
  /** Дата и время создания объекта. */
  created_at: string;
  /** Дата и время обновления данных объекта. */
  updated_at: string;
};

/** Модель смарт-терминала. */
export type DeviceModel = "10" | "7_2" | "7_2_ATOL" | "7_3" | "5" | "5_I" | "POWER" | "UNKNOWN";

/** Смарт-терминал пользователя платформы Эвотор. */
export type Device = {
  /** Уникальный идентификатор смарт-терминала в Облаке Эвотор. */
  id: string;
  /** Имя смарт-терминала, которое пользователь дал устройству в Личном кабинете. */
  name: string;
  /** Идентификатор магазина, в котором работает смарт-терминал. */
  store_id: string;
  /** ИНН владельца терминала. */
  inn?: string;
  /** Часовой пояс устройства — смещение в миллисекундах относительно UTC. */
  timezone_offset?: number;
  /** IMEI смарт-терминала. */
  imei?: string;
  /** Версия ПО смарт-терминала. */
  firmware_version?: string;
  /** GPS-координаты смарт-терминала. */
  location?: {
    lng: number;
    lat: number;
  };
  /** Идентификатор пользователя Эвотор. */
  user_id: string;
  /** Серийный номер устройства. */
  serial_number?: string;
  /** Модель устройства. */
  device_model?: DeviceModel;
  /** Дата и время создания объекта. */
  created_at: string;
  /** Дата и время обновления данных объекта. */
  updated_at: string;
};

/** Роль сотрудника. */
export type EmployeeRole = "ADMIN" | "CASHIER" | "MANUAL";

/** Роль сотрудника, созданная в Личном кабинете. */
export type Role = {
  /** Уникальный идентификатор роли. */
  id: string;
  /** Название роли. */
  name: string;
  /** Должность сотрудника, которую пользователь указал в Личном кабинете. */
  position?: string;
};

/** Данные сотрудника при добавлении. */
export type EmployeeCreate = {
  /** Номер телефона сотрудника. */
  phone: number;
  /** Идентификатор роли сотрудника. */
  role_id: string;
  /** Имя сотрудника. */
  name: string;
  /** Фамилия сотрудника. */
  last_name?: string;
  /** Отчество сотрудника. */
  patronymic_name?: string;
  /** Должность сотрудника. */
  position?: string;
  /** Идентификаторы магазинов, в которые нужно добавить сотрудника. */
  stores: string[];
};

/** Данные сотрудника при обновлении. */
export type EmployeeUpdate = {
  /** Номер телефона сотрудника. */
  phone?: number;
  /** Имя сотрудника. */
  name: string;
  /** Фамилия сотрудника. */
  last_name?: string;
  /** Отчество сотрудника. */
  patronymic_name?: string;
  /** Идентификатор роли сотрудника. */
  role_id: string;
  /** ИНН сотрудника. */
  inn?: string;
  /** Идентификаторы магазинов, в которые нужно добавить сотрудника. */
  stores: string[];
  /** Должность сотрудника. */
  position?: string;
};

/** Сотрудник пользователя платформы Эвотор. */
export type Employee = {
  /** Уникальный идентификатор сотрудника в Облаке Эвотор. */
  id: string;
  /** Имя сотрудника, которое пользователь указал в Личном кабинете. */
  name: string;
  /** Фамилия сотрудника. */
  last_name?: string;
  /** Отчество сотрудника. */
  patronymic_name?: string;
  /** Должность сотрудника, которую пользователь указал в Личном кабинете. */
  position?: string;
  /** Номер телефона сотрудника. */
  phone?: number;
  /** Идентификаторы магазинов, в которых работает сотрудник. */
  stores: string[];
  /** Роль сотрудника. */
  role: EmployeeRole;
  /** Уникальный идентификатор роли сотрудника. */
  role_id: string;
  /** Идентификатор пользователя Эвотор. */
  user_id: string;
  /** Дата и время создания объекта. */
  created_at: string;
  /** Дата и время обновления данных объекта. */
  updated_at: string;
};

/** Тип документа. */
export type DocumentType =
  | "OPEN_SESSION"
  | "POS_OPEN_SESSION"
  | "CLOSE_SESSION"
  | "CASH_INCOME"
  | "CASH_OUTCOME"
  | "INVENTORY"
  | "ACCEPT"
  | "REVALUATION"
  | "WRITE_OFF"
  | "RETURN"
  | "OPEN_TARE"
  | "SELL"
  | "PAYBACK"
  | "BUY"
  | "BUYBACK"
  | "X_REPORT"
  | "Z_REPORT"
  | "CORRECTION";

/** Документ магазина. */
export type Document = {
  /** Тип документа. */
  type: DocumentType;
  /** Идентификатор документа, уникальный в рамках магазина. */
  id: string;
  /** Дополнительная информация, добавленная сторонними приложениями. */
  extras?: Record<string, JSONValue>;
  /** Порядковый номер документа на смарт-терминале. */
  number: number;
  /** Дата сохранения документа на смарт-терминале. */
  close_date: string;
  /** Часовой пояс смарт-терминала — смещение в миллисекундах относительно UTC. */
  time_zone_offset: number;
  /** Идентификатор смены. */
  session_id: string;
  /** Номер смены. */
  session_number?: number;
  /** Идентификатор сотрудника, закрывшего документ. */
  close_user_id?: string;
  /** Идентификатор смарт-терминала. */
  device_id?: string;
  /** Идентификатор магазина. */
  store_id?: string;
  /** Идентификатор пользователя Эвотор. */
  user_id?: string;
  /** Версия формата документа. */
  version?: "V1" | "V2";
  /** Тело документа. */
  body?: JSONValue;
};

/** Поля товара, которые можно запросить в ответе. */
export type ProductField =
  | "user_id"
  | "store_id"
  | "id"
  | "type"
  | "name"
  | "code"
  | "barcodes"
  | "price"
  | "cost_price"
  | "quantity"
  | "measure_name"
  | "tax"
  | "allow_to_sell"
  | "attributes_choices"
  | "description"
  | "article_number"
  | "parent_id"
  | "alcocodes"
  | "alcohol_by_volume"
  | "alcohol_product_kind_code"
  | "tare_volume"
  | "classification_code"
  | "created_at"
  | "updated_at";

/** Товар или модификация товара. */
export type Product = {
  /** Тип товара. */
  type?: ProductType;
  /** Название товара или модификации товара. */
  name: string;
  /** Код товара или модификации товара. */
  code?: string;
  /** Отпускная цена товара или модификации товара. */
  price: number;
  /** Единица измерения товара. */
  measure_name: MeasureName;
  /** Код ставки НДС для товара. */
  tax: Tax;
  /** Признак разрешения продажи. */
  allow_to_sell: boolean;
  /** Описание товара. */
  description?: string;
  /** Артикул товара. */
  article_number?: string;
  /** Штрихкоды товара. */
  barcodes?: string[];
  /** Идентификатор группы, к которой иерархически привязан товар. */
  parent_id?: string;
  /** Идентификатор товара, уникальный в рамках магазина. */
  id?: string;
  /** Доступный к продаже остаток товара. */
  quantity?: number;
  /** Закупочная цена товара. */
  cost_price?: number;
  /** Признак подакцизного товара. */
  is_excisable?: boolean;
  /** Признак наличия возрастных ограничений. */
  is_age_limited?: boolean;
  /** Дополнительные атрибуты товара. */
  attributes_choices?: Record<string, JSONValue>;
  /** Идентификатор магазина. */
  store_id?: string;
  /** Идентификатор пользователя Эвотор. */
  user_id?: string;
  /** Дата и время создания объекта. */
  created_at?: string;
  /** Дата и время обновления данных объекта. */
  updated_at?: string;
};

/** Значение характеристики группы модификаций. */
export type ProductGroupChoice = {
  /** Идентификатор значения характеристики. */
  id?: string;
  /** Название значения характеристики. */
  name: string;
};

/** Характеристика группы модификаций. */
export type ProductGroupAttribute = {
  /** Идентификатор характеристики. */
  id?: string;
  /** Название характеристики. */
  name: string;
  /** Возможные значения характеристики. */
  choices: ProductGroupChoice[];
};

/** Группа товаров или группа модификаций товаров. */
export type ProductGroup = {
  /** Идентификатор группы, уникальный в рамках магазина. */
  id?: string;
  /** Идентификатор родительской группы. */
  parent_id?: string;
  /** Название группы. */
  name: string;
  /** Штрихкоды группы модификаций. */
  barcodes?: string[];
  /** Характеристики группы модификаций. */
  attributes?: ProductGroupAttribute[];
  /** Идентификатор магазина. */
  store_id?: string;
  /** Идентификатор пользователя Эвотор. */
  user_id?: string;
  /** Дата и время создания объекта. */
  created_at?: string;
  /** Дата и время обновления данных объекта. */
  updated_at?: string;
};

/** Тип сущности, обрабатываемой задачей массовой операции. */
export type BulkType = "product" | "product-group";

/** Состояние задачи массовой операции. */
export type BulkStatus = "ACCEPTED" | "RUNNING" | "COMPLETED" | "DECLINED" | "FAILED";

/** Задача массовой операции. */
export type Bulk = {
  /** Идентификатор задачи. */
  id: string;
  /** Объект, который обрабатывается в задаче. */
  type: BulkType;
  /** Состояние задачи. */
  status: BulkStatus;
  /** Время обновления состояния задачи. */
  modified_at: string;
  /** Детали выполнения задачи. */
  details?: JSONValue[];
};

/** Состояние задачи push-уведомления. */
export type PushStatus = "ACCEPTED" | "RUNNING" | "COMPLETED" | "FAILED";

/** Статус доставки push-уведомления на смарт-терминал. */
export type PushNotificationDetail = {
  /** Дата и время истечения задачи уведомления. */
  active_until?: string;
  /** Дата и время создания задачи уведомления. */
  created_at?: string;
  /** Идентификатор смарт-терминала. */
  device_id?: string;
  /** Дата и время, когда задача уведомления была отклонена сервером. */
  rejected_at?: string;
  /** Ответ приложения на уведомление. */
  reply?: JSONValue;
  /** Дата и время отправки уведомления. */
  sent_at?: string;
  /** Состояние задачи уведомления на смарт-терминале. */
  status?: PushStatus;
};

/** Push-уведомление. */
export type PushNotification = {
  /** Идентификатор задачи уведомления. */
  id: string;
  /** Состояние задачи уведомления. */
  status: PushStatus;
  /** Время обновления состояния задачи. */
  modified_at: string;
  /** Информация о ходе выполнения задачи на отдельных смарт-терминалах. */
  details: PushNotificationDetail[];
};

/** Тип события приложения. */
export type EventType = "Document" | "Product" | "ProductGroup" | "Settings" | "MarketplacePurchase";

/** Событие приложения. */
export type Event = {
  /** Уникальный идентификатор события. */
  id: string;
  /** Время создания события в миллисекундах. */
  timestamp: number;
  /** Тип события. */
  type: EventType;
  /** Источник события: смарт-терминал или приложение. */
  source?: "DEVICE" | "APPLICATION";
  /** Действие, которое привело к созданию события. */
  action: string;
  /** Данные события. */
  payload?: JSONValue;
};
