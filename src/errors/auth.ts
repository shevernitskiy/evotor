import type { JSONValue } from "../typings/lib.ts";

export class AuthError extends Error {
  constructor(
    public response: JSONValue,
    message?: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}
