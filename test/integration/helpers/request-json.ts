export async function requestJson<T>(
  baseUrl: string,
  pathName: string,
  params: {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: HeadersInit;
  }
): Promise<{
  status: number;
  headers: Headers;
  body: T | null;
}> {
  const hasBody = params.body !== undefined;

  const headers = new Headers(params.headers);
  if (hasBody) headers.set("content-type", "application/json");

  const response = await fetch(`${baseUrl}${pathName}`, {
    method: params.method,
    headers,
    body: hasBody ? JSON.stringify(params.body) : undefined,
  });

  const text = await response.text();

  return {
    status: response.status,
    headers: response.headers,
    body: text ? (JSON.parse(text) as T) : null,
  };
}
