import type { SlideDetail, SlideListResponse } from './types';

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

// 404(없는 슬라이드)는 재시도해도 같은 결과라 문구를 따로 둔다.
export async function fetchSlide(id: string): Promise<SlideDetail> {
  const res = await fetch(`/api/slides/${encodeURIComponent(id)}`);
  if (res.status === 404) throw new Error('존재하지 않는 슬라이드입니다.');
  if (!res.ok) throw new Error(`슬라이드 상세 요청 실패 (${res.status})`);
  return res.json();
}
