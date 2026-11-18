import { ApiError } from "../errors/api.ts";
import { AuthError } from "../errors/auth.ts";
import { HttpError } from "../errors/http.ts";
import { NotInstalledError } from "../errors/not-installed.ts";
import type { EvotorRequestInit, HttpMethod, JSONValue, Options, QueryValue } from "../typings/lib.ts";
import { RateLimiter } from "./rate-limiter.ts";

export type ApiVersion = "v1" | "v2";

const V2_CONTENT_TYPE = "application/vnd.evotor.v2+json";
const V2_BULK_CONTENT_TYPE = "application/vnd.evotor.v2+bulk+json";

export class RestClient {
  private readonly base_url: string;
  private readonly headers: Record<string, string>;
  private readonly fetcher: typeof fetch;
  private readonly timeout?: number;
  private readonly signal?: AbortSignal;
  private readonly limiter = new RateLimiter();

  constructor(token: string, options: Options = {}, version: ApiVersion = "v1") {
    if (token.trim() === "") throw new TypeError("Evotor token is required");
    if (options.timeout !== undefined && !(Number.isFinite(options.timeout) && options.timeout > 0)) {
      throw new TypeError("Evotor timeout must be a positive number of milliseconds");
    }

    this.base_url = (options.base_url ?? "https://api.evotor.ru").replace(/\/+$/, "");
    const defaults: Record<string, string> =
      version === "v2"
        ? {
            "Authorization": `Bearer ${token}`,
            "Accept": V2_CONTENT_TYPE,
            "Content-Type": V2_CONTENT_TYPE,
          }
        : {
            "X-Authorization": token,
            "Content-Type": "application/json",
          };
    this.headers = { ...defaults, ...options.headers };
    this.fetcher = options.fetch ?? globalThis.fetch;
    this.timeout = options.timeout;
    this.signal = options.signal;
  }

  async request<T>(method: HttpMethod, init: EvotorRequestInit): Promise<T> {
    const pause = this.limiter.wait();
    if (pause !== undefined) await pause;

    const query = this.buildQuery(init.query);
    const target = `${this.base_url}${init.url}${query}`;
    const headers = { ...this.headers };
    if (init.content_type === "bulk") headers["Content-Type"] = V2_BULK_CONTENT_TYPE;

    const response = await this.fetcher(target, {
      method,
      headers,
      body: init.payload === undefined ? undefined : JSON.stringify(init.payload),
      signal: this.createSignal(),
    });

    this.limiter.update(response.headers);

    if (!response.ok) {
      throw await this.createError(response);
    }

    const text = await response.text();
    if (text === "") return undefined as T;

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new HttpError(response.status, text, text);
    }
  }

  get<T>(init: EvotorRequestInit): Promise<T> {
    return this.request<T>("GET", init);
  }

  post<T>(init: EvotorRequestInit): Promise<T> {
    return this.request<T>("POST", init);
  }

  put<T>(init: EvotorRequestInit): Promise<T> {
    return this.request<T>("PUT", init);
  }

  patch<T>(init: EvotorRequestInit): Promise<T> {
    return this.request<T>("PATCH", init);
  }

  delete<T>(init: EvotorRequestInit): Promise<T> {
    return this.request<T>("DELETE", init);
  }

  private createSignal(): AbortSignal | undefined {
    if (this.timeout === undefined) return this.signal;

    const timeout = AbortSignal.timeout(this.timeout);
    return this.signal === undefined ? timeout : AbortSignal.any([timeout, this.signal]);
  }

  private buildQuery(values?: Record<string, QueryValue>): string {
    if (values === undefined) return "";

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
      if (value === undefined || value === null) continue;
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
    const detail =
      typeof data === "object" && data !== null && !Array.isArray(data) && typeof data.message === "string"
        ? data.message
        : undefined;
    const description = detail === undefined ? message : `${message}: ${detail}`;

    if (response.status === 401 || response.status === 403) {
      return new AuthError(response.status, data, description);
    }
    if (response.status === 402) {
      return new NotInstalledError(response.status, data, description);
    }
    if (typeof data === "object" && data !== null) {
      return new ApiError(response.status, data, description);
    }
    return new HttpError(response.status, data, text === "" ? message : text);
  }
}
