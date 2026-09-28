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

/** 상태 → `?q=...&page=...&slide=...`. page는 1페이지여도 항상 쓰고, 빈 검색어와 선택 없음은 뺀다. */
export function toUrlSearch({ q, page, slide }: UrlState) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  params.set('page', String(page));
  if (slide) params.set('slide', slide);
  return `?${params}`;
}
