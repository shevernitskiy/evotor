export type JSONValue = string | number | boolean | null | { [key: string]: JSONValue } | JSONValue[];

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type QueryValue = string | number | boolean | null | readonly (string | number | boolean)[] | undefined;

export type EvotorRequestInit = {
  url: string;
  query?: Record<string, QueryValue>;
  payload?: JSONValue;
  content_type?: "bulk";
};

export type Options = {
  /** Подмена `fetch` — для тестов и мок-окружений. */
  fetch?: typeof fetch;
  /** Базовый адрес API. По умолчанию `https://api.evotor.ru`. */
  base_url?: string;
  /** Дополнительные заголовки, которые переопределяют заголовки по умолчанию. */
  headers?: Record<string, string>;
  /** Таймаут запроса в миллисекундах. */
  timeout?: number;
  /** Сигнал для отмены запросов. */
  signal?: AbortSignal;
  /** Токен ОФД для раздела «Данные ОФД». Если не задан, используется основной токен. */
  ofd_token?: string;
  /** Токен для API Облака V2. Если не задан, используется основной токен. */
  v2_token?: string;
};
