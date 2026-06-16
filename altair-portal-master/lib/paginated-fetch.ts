import type { CursorPage } from './pagination';

interface FetchPaginatedOptions {
  limit?: number;
  init?: RequestInit;
}

function appendPagination(url: string, limit: number, cursor: string | null): string {
  const separator = url.includes('?') ? '&' : '?';
  const params = new URLSearchParams({ limit: limit.toString() });
  if (cursor) params.set('cursor', cursor);
  return `${url}${separator}${params.toString()}`;
}

// GPT-Codex (G) BEGIN: let app clients consume paginated list APIs as plain arrays.
export async function fetchPaginatedCollection<T>(
  url: string,
  options: FetchPaginatedOptions = {}
): Promise<T[]> {
  const limit = options.limit ?? 100;
  const allItems: T[] = [];
  let cursor: string | null = null;

  do {
    const res = await fetch(appendPagination(url, limit, cursor), options.init);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const payload = await res.json() as T[] | CursorPage<T>;

    if (Array.isArray(payload)) return [...allItems, ...payload];

    allItems.push(...payload.data);
    cursor = payload.pageInfo.hasNextPage ? payload.pageInfo.nextCursor : null;
  } while (cursor);

  return allItems;
}
// GPT-Codex (G) END: callers can opt into bounded server pages without duplicating cursor loops.
