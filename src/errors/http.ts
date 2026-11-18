import type { JSONValue } from "../typings/lib.ts";

export class HttpError extends Error {
  constructor(
    public status: number,
    public response: JSONValue,
    message?: string,
  ) {
    super(message ?? String(status));
    this.name = "HttpError";
  }
}
