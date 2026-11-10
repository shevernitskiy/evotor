import type { JSONValue } from "../typings/lib.ts";

export class ApiError extends Error {
  constructor(
    public response: JSONValue,
    message?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
