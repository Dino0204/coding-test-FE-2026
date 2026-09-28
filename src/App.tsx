import { Suspense, useEffect, useState, useTransition } from 'react';
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchSlide, fetchSlides } from './api/slides';
import { SearchInput } from './components/SearchInput';
import { SlideDetailPanel, type HeatmapSettings } from './components/SlideDetailPanel';
import { SlideList } from './components/SlideList';
import { parseUrlState, toUrlSearch } from './utils/urlState';

type SlideListQueryProps = {
  q: string;
  page: number;
  isStale: boolean;
  isSearching: boolean;
  onPageChange: (page: number) => void;
  selectedId?: string;
  onSelect: (id: string) => void;
};

// useSuspenseQuery는 데이터가 올 때까지 가장 가까운 Suspense를 fallback으로 바꾸고,
// 실패하면 가장 가까운 ErrorBoundary로 에러를 던진다. 그래서 여기서는 성공한 데이터만 다룬다.
function SlideListQuery({ q, page, isStale, isSearching, onPageChange, selectedId, onSelect }: SlideListQueryProps) {
  const { data } = useSuspenseQuery({
    queryKey: ['slides', q, page],
    queryFn: () => fetchSlides(page, q),
  });
  return (
    <SlideList
      items={data.items}
      total={data.total}
      page={page}
      isStale={isStale}
      isSearching={isSearching}
      onPageChange={onPageChange}
      selectedId={selectedId}
      onSelect={onSelect}
    />
  );
}

// 목록과 같은 패턴: 성공한 데이터만 다루고, 로딩·에러는 바깥 Suspense·ErrorBoundary가 맡는다.
type SlideDetailQueryProps = {
  id: string;
  heatmap: HeatmapSettings;
  onHeatmapChange: (heatmap: HeatmapSettings) => void;
};

function SlideDetailQuery({ id, heatmap, onHeatmapChange }: SlideDetailQueryProps) {
  const { data } = useSuspenseQuery({
    queryKey: ['slide', id],
    queryFn: () => fetchSlide(id),
  });
  return <SlideDetailPanel slide={data} heatmap={heatmap} onHeatmapChange={onHeatmapChange} />;
}

export default function App() {
  // 새로고침·공유한 URL로 들어와도 같은 화면이 보이도록 첫 렌더링 때 URL에서 상태를 읽는다.
  const [initial] = useState(() => parseUrlState(window.location.search));
  const [q, setQ] = useState(initial.q);
  const [page, setPage] = useState(initial.page);
  const [selectedId, setSelectedId] = useState(initial.slide);
  // 슬라이드를 바꿔도 heatmap 설정을 유지하려고 패널이 아닌 App에 둔다. 기본값은 명세에 없어 임시로 정함.
  const [heatmap, setHeatmap] = useState<HeatmapSettings>({ visible: true, opacity: 50 });
  // transition 안에서 바뀐 state로 다시 suspend되면 React는 fallback 대신 이전 화면(이전 데이터)을 유지한다.
  const [isPagePending, startPageTransition] = useTransition();
  // 검색은 transition을 따로 둬서 '검색 중' 표시를 페이지 이동과 구분한다.
  const [isSearching, startSearchTransition] = useTransition();

  // 상태가 바뀌면 URL에 반영한다. replaceState라 뒤로 가기 기록은 쌓이지 않는다.
  useEffect(() => {
    const search = toUrlSearch({ q, page, slide: selectedId });
    window.history.replaceState(null, '', search || window.location.pathname);
  }, [q, page, selectedId]);

  const changePage = (next: number) => startPageTransition(() => setPage(next));
  // 검색어가 바뀌면 결과 개수가 달라지므로 1페이지로 돌아간다. 같은 검색어(앞뒤 공백만 추가 등)면 무시한다.
  const search = (next: string) => {
    if (next === q) return;
    startSearchTransition(() => {
      setQ(next);
      setPage(1);
    });
  };

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-4 text-xl font-bold">슬라이드 분석 결과 뷰어</h1>
      <div className="mb-4">
        <SearchInput defaultValue={initial.q} onSearch={search} />
      </div>
      <div className="grid items-start gap-4 lg:grid-cols-[1fr_24rem]">
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              // 다시 시도: 쿼리의 에러 상태를 지워야(reset) 다시 렌더링될 때 요청을 새로 보낸다.
              onReset={reset}
              resetKeys={[q, page]}
              fallbackRender={({ error, resetErrorBoundary }) => (
                <SlideList
                  page={page}
                  errorMessage={error instanceof Error ? error.message : '알 수 없는 오류'}
                  onRetry={resetErrorBoundary}
                />
              )}
            >
              <Suspense fallback={<SlideList page={page} />}>
                <SlideListQuery
                  q={q}
                  page={page}
                  isStale={isPagePending}
                  isSearching={isSearching}
                  onPageChange={changePage}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>

        {selectedId ? (
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary
                onReset={reset}
                // 다른 슬라이드를 고르면 이전 에러 화면을 지우고 새로 요청한다.
                resetKeys={[selectedId]}
                fallbackRender={({ error, resetErrorBoundary }) => (
                  <SlideDetailPanel
                    errorMessage={error instanceof Error ? error.message : '알 수 없는 오류'}
                    onRetry={resetErrorBoundary}
                  />
                )}
              >
                <Suspense fallback={<SlideDetailPanel />}>
                  <SlideDetailQuery id={selectedId} heatmap={heatmap} onHeatmapChange={setHeatmap} />
                </Suspense>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        ) : (
          <section
            aria-label="슬라이드 상세"
            className="rounded-md border border-border bg-surface p-12 text-center text-sm text-muted"
          >
            목록에서 슬라이드를 선택하세요.
          </section>
        )}
      </div>
    </main>
  );
}
