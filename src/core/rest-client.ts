import { ApiError } from "../errors/api.ts";
import { AuthError } from "../errors/auth.ts";
import { HttpError } from "../errors/http.ts";
import type { HttpMethod, JSONValue, Options, QueryValue, RequestInit } from "../typings/lib.ts";
import { RateLimiter } from "./rate-limiter.ts";

export class RestClient {
  private readonly base_url = "https://api.evotor.ru";
  private readonly headers: Record<string, string>;
  private readonly fetcher: typeof fetch;
  private readonly limiter = new RateLimiter();

  constructor(token: string, options: Options = {}) {
    if (token.trim() === "") throw new TypeError("Evotor token is required");
    this.headers = {
      "X-Authorization": token,
      "Content-Type": "application/json",
    };
    this.fetcher = options.fetch ?? globalThis.fetch;
  }

  async request<T>(method: HttpMethod, init: RequestInit): Promise<T> {
    const pause = this.limiter.wait();
    if (pause !== undefined) await pause;

    const query = this.buildQuery(init.query);
    const target = `${this.base_url}${init.url}${query}`;
    const response = await this.fetcher(target, {
      method,
      headers: this.headers,
      body: init.payload === undefined ? undefined : JSON.stringify(init.payload),
    });

    this.limiter.update(response.headers);

    if (!response.ok) {
      throw await this.createError(response);
    }

    const text = await response.text();
    return (text === "" ? undefined : JSON.parse(text)) as T;
  }

  get<T>(init: RequestInit): Promise<T> {
    return this.request<T>("GET", init);
  }

  post<T>(init: RequestInit): Promise<T> {
    return this.request<T>("POST", init);
  }

  put<T>(init: RequestInit): Promise<T> {
    return this.request<T>("PUT", init);
  }

  patch<T>(init: RequestInit): Promise<T> {
    return this.request<T>("PATCH", init);
  }

  delete<T>(init: RequestInit): Promise<T> {
    return this.request<T>("DELETE", init);
  }

  private buildQuery(values?: Record<string, QueryValue>): string {
    if (values === undefined) return "";

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
      if (value === undefined) continue;
      params.set(key, Array.isArray(value) ? value.join(",") : String(value));
    }

    const query = params.toString();
    return query === "" ? "" : `?${query}`;
  }

  private async createError(response: Response): Promise<Error> {
    const text = await response.text();
    let data: JSONValue = text;

    try {
      data = JSON.parse(text) as JSONValue;
    } catch {
      data = text;
    }

    const message = `${response.status} ${response.statusText}`.trim();
    if (response.status === 401 || response.status === 403) {
      return new AuthError(data, message);
    }
    if (typeof data === "object" && data !== null && "errors" in data) {
      return new ApiError(data, message);
    }
    return new HttpError(text === "" ? message : text);
  }
}
