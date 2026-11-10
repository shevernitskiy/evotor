export type FetchInit = NonNullable<Parameters<typeof fetch>[1]>;

export type FetchCall = {
  url: string;
  init: FetchInit | undefined;
};

export function mockFetch(...responses: Response[]) {
  const calls: FetchCall[] = [];
  const fetcher = (async (input: string | URL | Request, init?: FetchInit) => {
    calls.push({ url: input.toString(), init });
    const response = responses.shift();
    if (!response) throw new Error("Unexpected fetch call");
    return response;
  }) as typeof fetch;
  return { fetcher, calls };
}

export function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

export function header(init: FetchInit | undefined, name: string): string | null {
  return new Headers(init?.headers).get(name);
}
