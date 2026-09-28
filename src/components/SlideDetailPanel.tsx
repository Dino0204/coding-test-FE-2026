import type { SlideDetail } from '../api/types';
import { formatCellCount, formatKi67, formatKst, maskPatientName, STATUS_LABEL } from '../utils/format';
import { Button } from './Button';

export type HeatmapSettings = {
  visible: boolean;
  /** 0 ~ 100 (%). heatmap 이미지의 CSS opacity */
  opacity: number;
};

type SlideDetailPanelProps = {
  /** 로딩 중이거나 에러면 undefined → 스켈레톤을 그린다 */
  slide?: SlideDetail;
  errorMessage?: string;
  onRetry?: () => void;
  heatmap?: HeatmapSettings;
  onHeatmapChange?: (heatmap: HeatmapSettings) => void;
};

// SlideList와 같은 방식: 데이터가 있으면 내용, 없으면 스켈레톤, 에러면 스켈레톤 위에 재시도 안내.
export function SlideDetailPanel({ slide, errorMessage, onRetry, heatmap, onHeatmapChange }: SlideDetailPanelProps) {
  const pulse = errorMessage ? '' : 'animate-pulse';
  // heatmap이 없는 슬라이드(분석 미완료)와 로딩·에러 중에는 컨트롤을 모두 막는다.
  const heatmapUrl = slide?.heatmapUrl;
  const showHeatmap = Boolean(heatmapUrl && heatmap?.visible);
  const { analysis } = slide ?? {};
  const rows: [string, string | undefined][] = [
    ['환자명', slide && maskPatientName(slide.patientName)],
    ['검사일시', slide && formatKst(slide.examinedAt)],
    ['분석 상태', slide && STATUS_LABEL[slide.status]],
    ['Ki67 양성률', analysis && formatKi67(analysis.ki67Index)],
    [
      '양성 세포 수 / 전체 세포 수',
      analysis && `${formatCellCount(analysis.positiveCells)} / ${formatCellCount(analysis.totalCells)}`,
    ],
    ['분석 완료 일시', analysis && (analysis.analyzedAt === null ? '-' : formatKst(analysis.analyzedAt))],
  ];

  return (
    <section
      aria-label="슬라이드 상세"
      aria-busy={!slide && !errorMessage}
      className="relative rounded-md border border-border bg-surface p-4"
    >
      <h2 className="mb-3 h-6 font-mono font-bold">
        {slide ? slide.id : <span className={`block w-32 h-full rounded-md bg-border ${pulse}`} />}
      </h2>
      {slide ? (
        // 슬라이드와 heatmap은 같은 크기(1200×800)라 같은 상자에 겹쳐 그리면 위치가 맞는다.
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md">
          <img src={slide.imageUrl} alt={`${slide.id} 슬라이드 이미지`} className="size-full object-cover" />
          {showHeatmap && (
            <img
              src={heatmapUrl!}
              alt={`${slide.id} heatmap`}
              className="absolute inset-0 size-full object-cover"
              style={{ opacity: heatmap!.opacity / 100 }}
            />
          )}
        </div>
      ) : (
        <div className={`aspect-[3/2] w-full rounded-md bg-border ${pulse}`} />
      )}
      <fieldset disabled={!heatmapUrl} className="mt-3 flex items-center gap-4 text-sm disabled:opacity-50">
        <legend className="sr-only">Heatmap 설정</legend>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showHeatmap}
            onChange={(e) => heatmap && onHeatmapChange?.({ ...heatmap, visible: e.target.checked })}
          />
          Heatmap
        </label>
        <label className="flex flex-1 items-center gap-2">
          투명도
          <input
            type="range"
            min={0}
            max={100}
            // heatmap을 끈 동안에는 투명도를 바꿔도 보이지 않으므로 막는다.
            disabled={!heatmap?.visible}
            value={heatmap?.opacity ?? 0}
            onChange={(e) => heatmap && onHeatmapChange?.({ ...heatmap, opacity: Number(e.target.value) })}
            className="flex-1"
          />
          <output className="w-10 text-right tabular-nums">{heatmap?.opacity ?? 0}%</output>
        </label>
      </fieldset>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-muted">{label}</dt>
            <dd>{value ?? <span className={`block h-4 w-24 rounded-md bg-border ${pulse}`} />}</dd>
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
