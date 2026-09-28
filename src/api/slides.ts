import type { SlideListResponse } from './types';

export const PAGE_SIZE = 20;

// fetch는 4xx/5xx에서도 reject하지 않으므로 res.ok를 직접 확인해 throw한다.
export async function fetchSlides(page: number, q = ''): Promise<SlideListResponse> {
  // URLSearchParams가 검색어의 공백·한글·& 같은 문자를 인코딩한다.
  const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
  if (q) params.set('q', q);
  const res = await fetch(`/api/slides?${params}`);
  if (!res.ok) throw new Error(`슬라이드 목록 요청 실패 (${res.status})`);
  return res.json();
}
