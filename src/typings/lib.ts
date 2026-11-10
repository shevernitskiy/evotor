export type JSONValue = string | number | boolean | null | { [key: string]: JSONValue } | JSONValue[];

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type QueryValue = string | number | boolean | readonly string[] | undefined;

export type RequestInit = {
  url: string;
  query?: Record<string, QueryValue>;
  payload?: JSONValue;
};

export type Options = {
  /** Подмена `fetch` — для тестов и мок-окружений. */
  fetch?: typeof fetch;
  /** Токен ОФД для раздела «Данные ОФД». Если не задан, используется основной токен. */
  ofd_token?: string;
};
