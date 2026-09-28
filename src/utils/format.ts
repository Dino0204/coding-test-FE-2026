import type { SlideStatus } from '../api/types';

/** 첫·마지막 글자만 남기고 `*`로 가린다. 두 글자면 두 번째 글자를 가린다. */
export function maskPatientName(name: string) {
  if (name.length === 2) return `${name[0]}*`;
  return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
}

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/** UTC ISO 문자열 → KST `YYYY-MM-DD HH:mm`. KST는 서머타임이 없어 +9시간 고정이다. */
export function formatKst(isoUtc: string) {
  return new Date(Date.parse(isoUtc) + KST_OFFSET_MS).toISOString().slice(0, 16).replace('T', ' ');
}

export const STATUS_LABEL: Record<SlideStatus, string> = {
  completed: '완료',
  processing: '분석 중',
  failed: '실패',
};
