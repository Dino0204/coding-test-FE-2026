import type { SlideListResponse } from './types';

export const PAGE_SIZE = 20;

// fetch는 4xx/5xx에서도 reject하지 않으므로 res.ok를 직접 확인해 throw한다.
export async function fetchSlides(page: number): Promise<SlideListResponse> {
  const res = await fetch(`/api/slides?page=${page}&pageSize=${PAGE_SIZE}`);
  if (!res.ok) throw new Error(`슬라이드 목록 요청 실패 (${res.status})`);
  return res.json();
}
