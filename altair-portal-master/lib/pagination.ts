export const DEFAULT_PAGE_LIMIT = 50;
export const MAX_PAGE_LIMIT = 100;

export interface CursorPagination {
  cursor: string | null;
  limit: number;
  queryTake: number;
}

export interface CursorPageInfo {
  limit: number;
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface CursorPage<T> {
  data: T[];
  pageInfo: CursorPageInfo;
}

// GPT-Codex (G) BEGIN: centralize cursor pagination parsing and envelope construction.
export function parseCursorPagination(searchParams: URLSearchParams): CursorPagination {
  const rawLimit = Number.parseInt(searchParams.get('limit') ?? '', 10);
  const requestedLimit = Number.isFinite(rawLimit) ? rawLimit : DEFAULT_PAGE_LIMIT;
  const limit = Math.min(Math.max(requestedLimit, 1), MAX_PAGE_LIMIT);

  return {
    cursor: searchParams.get('cursor'),
    limit,
    queryTake: limit + 1,
  };
}

export function toCursorPage<T extends { id: string }>(
  rows: T[],
  pagination: CursorPagination
): CursorPage<T> {
  const hasNextPage = rows.length > pagination.limit;
  const data = hasNextPage ? rows.slice(0, pagination.limit) : rows;
  const nextCursor = hasNextPage ? data[data.length - 1]?.id ?? null : null;

  return {
    data,
    pageInfo: {
      limit: pagination.limit,
      nextCursor,
      hasNextPage,
    },
  };
}
// GPT-Codex (G) END: list endpoints now share one bounded cursor contract.
