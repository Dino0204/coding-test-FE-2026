import type { SlideListResponse } from '../api/types';
import { formatKst, maskPatientName, STATUS_LABEL } from '../utils/format';
import { Button } from './Button';

type SlideListProps = {
  data: SlideListResponse;
  onPageChange: (page: number) => void;
};

export function SlideList({ data, onPageChange }: SlideListProps) {
  const { items, page, pageSize, total } = data;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="rounded-md border border-border bg-surface">
      <table className="w-full text-left text-sm">
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
          {items.map((slide) => (
            <tr key={slide.id} className="border-b border-border last:border-b-0">
              <td className="p-3">
                <img src={slide.thumbnailUrl} alt={`${slide.id} 썸네일`} className="size-12 rounded-md object-cover" />
              </td>
              <td className="p-3 font-mono">{slide.id}</td>
              <td className="p-3">{maskPatientName(slide.patientName)}</td>
              <td className="p-3">{formatKst(slide.examinedAt)}</td>
              <td className="p-3">{STATUS_LABEL[slide.status]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav aria-label="페이지 이동" className="flex items-center justify-center gap-3 border-t border-border p-3">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          이전
        </Button>
        <span className="text-sm text-muted">
          {page} / {totalPages}
        </span>
        <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          다음
        </Button>
      </nav>
    </section>
  );
}
