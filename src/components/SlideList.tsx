import { PAGE_SIZE } from '../api/slides';
import type { SlideSummary } from '../api/types';
import { formatKst, maskPatientName, STATUS_LABEL } from '../utils/format';
import { Button } from './Button';

// 로딩·검색·에러 때 그리는 스켈레톤 행 수. 한 페이지(20행) 높이는 너무 커서 줄였다.
const SKELETON_ROWS = 5;

type SlideListProps = {
  /** 로딩 중이거나 에러면 undefined → 스켈레톤을 그린다 */
  items?: SlideSummary[];
  total?: number;
  page: number;
  /** 다음 데이터를 받는 동안 이전 데이터를 흐리게 보여 준다 */
  isStale?: boolean;
  /** 검색 결과를 기다리는 중이면 목록 대신 스켈레톤과 '검색 중' 표시 */
  isSearching?: boolean;
  errorMessage?: string;
  onPageChange?: (page: number) => void;
  onRetry?: () => void;
  selectedId?: string;
  onSelect?: (id: string) => void;
};

export function SlideList({
  items: loadedItems,
  total: loadedTotal,
  page,
  isStale,
  isSearching,
  errorMessage,
  onPageChange,
  onRetry,
  selectedId,
  onSelect,
}: SlideListProps) {
  // 검색 중에는 이전 검색어의 결과를 숨기고 로딩과 같은 스켈레톤을 그린다.
  const items = isSearching ? undefined : loadedItems;
  const total = isSearching ? undefined : loadedTotal;
  // 로딩·에러면 응답이 없어 전체 개수를 모른다. 목록이 보일 때까지 페이지 이동을 모두 막는다.
  const totalPages = total === undefined ? undefined : Math.max(1, Math.ceil(total / PAGE_SIZE));
  const navDisabled = !items;

  return (
    <section className="rounded-md border border-border bg-surface">
      <div className="relative">
        <table
          className={`w-full text-left text-sm transition-opacity ${isStale ? 'opacity-50' : ''}`}
          aria-busy={isStale || (!items && !errorMessage)}
        >
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
            {items?.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-muted">
                  표시할 슬라이드가 없습니다.
                </td>
              </tr>
            ) : items ? (
              items.map((slide) => (
                <tr
                  key={slide.id}
                  aria-selected={slide.id === selectedId}
                  // <tr>엔 네이티브 대화형 요소가 없어 tabIndex로 Tab 포커스를 주고, Enter/Space를 직접 click처럼 처리한다.
                  tabIndex={0}
                  onClick={() => onSelect?.(slide.id)}
                  onKeyDown={(e) => {
                    // ↑/↓는 포커스만 옆 행으로 옮긴다. 선택(상세 요청)은 Enter로 한다.
                    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                      e.preventDefault(); // 방향키의 페이지 스크롤 막기
                      const row = e.currentTarget;
                      const next = e.key === 'ArrowDown' ? row.nextElementSibling : row.previousElementSibling;
                      (next as HTMLElement | null)?.focus();
                      return;
                    }
                    if (e.key !== 'Enter' && e.key !== ' ') return;
                    e.preventDefault(); // Space의 페이지 스크롤 막기
                    onSelect?.(slide.id);
                  }}
                  className="cursor-pointer border-b border-border last:border-b-0 hover:bg-bg aria-selected:bg-primary/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                >
                  <td className="p-3">
                    <img
                      src={slide.thumbnailUrl}
                      alt={`${slide.id} 썸네일`}
                      className="size-12 rounded-md object-cover"
                    />
                  </td>
                  <td className="p-3 font-mono">{slide.id}</td>
                  <td className="p-3">{maskPatientName(slide.patientName)}</td>
                  <td className="p-3">{formatKst(slide.examinedAt)}</td>
                  <td className="p-3">{STATUS_LABEL[slide.status]}</td>
                </tr>
              ))
            ) : (
              Array.from({ length: SKELETON_ROWS }, (_, i) => (
                <tr key={i} data-testid="skeleton-row" className="border-b border-border last:border-b-0">
                  <td className="p-3">
                    <div className={`size-12 rounded-md bg-border ${errorMessage ? '' : 'animate-pulse'}`} />
                  </td>
                  {['w-24', 'w-12', 'w-32', 'w-12'].map((w, j) => (
                    <td key={j} className="p-3">
                      <div className={`h-4 rounded-md bg-border ${w} ${errorMessage ? '' : 'animate-pulse'}`} />
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {isSearching && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p role="status" className="rounded-md border border-border bg-surface px-4 py-2 text-sm shadow">
              검색 중…
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/60">
            <div
              role="alert"
              className="flex flex-col items-center gap-3 rounded-md border border-border bg-surface p-6 shadow"
            >
              <p className="text-danger">{errorMessage}</p>
              <Button size="sm" onClick={onRetry}>
                다시 시도
              </Button>
            </div>
          </div>
        )}
      </div>

      <nav aria-label="페이지 이동" className="flex items-center justify-center gap-3 border-t border-border p-3">
        <Button
          variant="secondary"
          size="sm"
          disabled={navDisabled || page <= 1}
          onClick={() => onPageChange?.(page - 1)}
        >
          이전
        </Button>
        <span className="text-sm text-muted">
          {page} / {totalPages ?? '-'}
        </span>
        <Button
          variant="secondary"
          size="sm"
          disabled={navDisabled || totalPages === undefined || page >= totalPages}
          onClick={() => onPageChange?.(page + 1)}
        >
          다음
        </Button>
      </nav>
    </section>
  );
}
