export type UrlState = {
  q: string;
  page: number;
  /** 선택한 슬라이드 ID */
  slide?: string;
};

/** `?q=홍&page=2&slide=S-2026-0009` → 상태. 없거나 잘못된 page(`abc`, `0`, `-1`)는 1로 본다. */
export function parseUrlState(search: string): UrlState {
  const params = new URLSearchParams(search);
  const page = Math.floor(Number(params.get('page')));
  return {
    q: (params.get('q') ?? '').trim(),
    page: page >= 1 ? page : 1,
    slide: params.get('slide') || undefined,
  };
}

/** 상태 → `?q=...&page=...&slide=...`. 기본값(빈 검색어, 1페이지, 선택 없음)은 빼서 URL을 짧게 둔다. */
export function toUrlSearch({ q, page, slide }: UrlState) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (page > 1) params.set('page', String(page));
  if (slide) params.set('slide', slide);
  const search = params.toString();
  return search ? `?${search}` : '';
}
