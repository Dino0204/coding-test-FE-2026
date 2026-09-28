import { Suspense, useState, useTransition } from 'react';
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchSlides } from './api/slides';
import { SearchInput } from './components/SearchInput';
import { SlideList } from './components/SlideList';

type SlideListQueryProps = {
  q: string;
  page: number;
  isStale: boolean;
  isSearching: boolean;
  onPageChange: (page: number) => void;
};

// useSuspenseQuery는 데이터가 올 때까지 가장 가까운 Suspense를 fallback으로 바꾸고,
// 실패하면 가장 가까운 ErrorBoundary로 에러를 던진다. 그래서 여기서는 성공한 데이터만 다룬다.
function SlideListQuery({ q, page, isStale, isSearching, onPageChange }: SlideListQueryProps) {
  const { data } = useSuspenseQuery({
    queryKey: ['slides', q, page],
    queryFn: () => fetchSlides(page, q),
  });
  return <SlideList items={data.items} total={data.total} page={page} isStale={isStale} isSearching={isSearching} onPageChange={onPageChange} />;
}

export default function App() {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  // transition 안에서 바뀐 state로 다시 suspend되면 React는 fallback 대신 이전 화면(이전 데이터)을 유지한다.
  const [isPagePending, startPageTransition] = useTransition();
  // 검색은 transition을 따로 둬서 '검색 중' 표시를 페이지 이동과 구분한다.
  const [isSearching, startSearchTransition] = useTransition();

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
        <SearchInput onSearch={search} />
      </div>
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
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </main>
  );
}
