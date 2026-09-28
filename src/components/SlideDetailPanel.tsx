import type { SlideDetail } from "../api/types";
import {
  formatCellCount,
  formatKi67,
  formatKst,
  maskPatientName,
  STATUS_LABEL,
} from "../utils/format";
import { Button } from "./Button";

type SlideDetailPanelProps = {
  /** 로딩 중이거나 에러면 undefined → 스켈레톤을 그린다 */
  slide?: SlideDetail;
  errorMessage?: string;
  onRetry?: () => void;
};

// SlideList와 같은 방식: 데이터가 있으면 내용, 없으면 스켈레톤, 에러면 스켈레톤 위에 재시도 안내.
export function SlideDetailPanel({
  slide,
  errorMessage,
  onRetry,
}: SlideDetailPanelProps) {
  const pulse = errorMessage ? "" : "animate-pulse";
  const { analysis } = slide ?? {};
  const rows: [string, string | undefined][] = [
    ["환자명", slide && maskPatientName(slide.patientName)],
    ["검사일시", slide && formatKst(slide.examinedAt)],
    ["분석 상태", slide && STATUS_LABEL[slide.status]],
    ["Ki67 양성률", analysis && formatKi67(analysis.ki67Index)],
    [
      "양성 세포 수 / 전체 세포 수",
      analysis &&
        `${formatCellCount(analysis.positiveCells)} / ${formatCellCount(analysis.totalCells)}`,
    ],
    [
      "분석 완료 일시",
      analysis &&
        (analysis.analyzedAt === null ? "-" : formatKst(analysis.analyzedAt)),
    ],
  ];

  return (
    <section
      aria-label="슬라이드 상세"
      aria-busy={!slide && !errorMessage}
      className="relative rounded-md border border-border bg-surface p-4"
    >
      <h2 className="mb-3 h-6 font-mono font-bold">
        {slide ? (
          slide.id
        ) : (
          <span className={`block w-32 h-full rounded-md bg-border ${pulse}`} />
        )}
      </h2>
      {slide ? (
        <img
          src={slide.imageUrl}
          alt={`${slide.id} 슬라이드 이미지`}
          className="aspect-square w-full rounded-md object-cover"
        />
      ) : (
        <div className={`aspect-square w-full rounded-md bg-border ${pulse}`} />
      )}
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-muted">{label}</dt>
            <dd>
              {value ?? (
                <span
                  className={`block h-4 w-24 rounded-md bg-border ${pulse}`}
                />
              )}
            </dd>
          </div>
        ))}
      </dl>

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
    </section>
  );
}
