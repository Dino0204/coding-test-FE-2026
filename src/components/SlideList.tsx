import { PAGE_SIZE } from '../api/slides';
import type { SlideSummary } from '../api/types';
import { formatKst, maskPatientName, STATUS_LABEL } from '../utils/format';
import { Button } from './Button';

type SlideListProps = {
  /** 로딩 중이거나 에러면 undefined */
  items?: SlideSummary[];
  total?: number;
  page: number;
  error: Error | null;
  onPageChange: (page: number) => void;
  onRetry: () => void;
};

export function SlideList({ items, total, page, error, onPageChange, onRetry }: SlideListProps) {
  // 에러면 응답이 없어 전체 개수를 모른다. 이때는 '다음'을 막고 '이전'으로만 돌아갈 수 있게 한다.
  const totalPages = total === undefined ? undefined : Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section className="rounded-md border border-border bg-surface">
      <div className="relative">
        <table className="w-full text-left text-sm" aria-busy={!items && !error}>
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="p-3 font-medium">썸네일</th>
              <th className="p-3 font-medium">슬라이드 ID</th>
              <th className="p-3 font-medium">환자명</th>
              <th className="p-3 font-medium">검사일시</th>
              <th className="p-3 font-medium">분석 상태</th>
            </tr>
          </thead>
          <tbody>
            {items
              ? items.map((slide) => (
                  <tr key={slide.id} className="border-b border-border last:border-b-0">
                    <td className="p-3">
                      <img src={slide.thumbnailUrl} alt={`${slide.id} 썸네일`} className="size-12 rounded-md object-cover" />
                    </td>
                    <td className="p-3 font-mono">{slide.id}</td>
                    <td className="p-3">{maskPatientName(slide.patientName)}</td>
                    <td className="p-3">{formatKst(slide.examinedAt)}</td>
                    <td className="p-3">{STATUS_LABEL[slide.status]}</td>
                  </tr>
                ))
              : // 로딩·에러 모두 실제 목록과 같은 높이의 스켈레톤을 그려 레이아웃이 튀지 않게 한다.
                Array.from({ length: PAGE_SIZE }, (_, i) => (
                  <tr key={i} data-testid="skeleton-row" className="border-b border-border last:border-b-0">
                    <td className="p-3">
                      <div className={`size-12 rounded-md bg-border ${error ? '' : 'animate-pulse'}`} />
                    </td>
                    {['w-24', 'w-12', 'w-32', 'w-12'].map((w, j) => (
                      <td key={j} className="p-3">
                        <div className={`h-4 rounded-md bg-border ${w} ${error ? '' : 'animate-pulse'}`} />
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/60">
            <div role="alert" className="flex flex-col items-center gap-3 rounded-md border border-border bg-surface p-6 shadow">
              <p className="text-danger">{error.message}</p>
              <Button size="sm" onClick={onRetry}>
                다시 시도
              </Button>
            </div>
          </div>
        )}
      </div>

      <nav aria-label="페이지 이동" className="flex items-center justify-center gap-3 border-t border-border p-3">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          이전
        </Button>
        <span className="text-sm text-muted">
          {page} / {totalPages ?? '-'}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={totalPages === undefined || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          다음
        </Button>
      </nav>
    </section>
  );
}
