import { ApiV1 } from "./api/v1/api.ts";
import { ApiV2 } from "./api/v2/api.ts";
import { RestClient } from "./core/rest-client.ts";
import type { Options } from "./typings/lib.ts";

export class Evotor {
  /** API Облака Эвотор V1. */
  readonly v1: ApiV1;
  /** API Облака Эвотор V2. */
  readonly v2: ApiV2;

  constructor(token: string, options: Options = {}) {
    const rest = new RestClient(token, options);
    const ofd_rest = options.ofd_token === undefined ? rest : new RestClient(options.ofd_token, options);
    const v2_rest = new RestClient(options.v2_token ?? token, options, "v2");

    this.v1 = new ApiV1(rest, ofd_rest);
    this.v2 = new ApiV2(v2_rest);
  }
}
