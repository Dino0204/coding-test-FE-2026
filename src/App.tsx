import { Suspense, useState, useTransition } from 'react';
import { QueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchSlides } from './api/slides';
import { SlideList } from './components/SlideList';

type SlideListQueryProps = {
  page: number;
  isStale: boolean;
  onPageChange: (page: number) => void;
};

// useSuspenseQuery는 데이터가 올 때까지 가장 가까운 Suspense를 fallback으로 바꾸고,
// 실패하면 가장 가까운 ErrorBoundary로 에러를 던진다. 그래서 여기서는 성공한 데이터만 다룬다.
function SlideListQuery({ page, isStale, onPageChange }: SlideListQueryProps) {
  const { data } = useSuspenseQuery({
    queryKey: ['slides', page],
    queryFn: () => fetchSlides(page),
  });
  return <SlideList items={data.items} total={data.total} page={page} isStale={isStale} onPageChange={onPageChange} />;
}

export default function App() {
  const [page, setPage] = useState(1);
  // transition 안에서 바뀐 state로 다시 suspend되면 React는 fallback 대신 이전 화면(이전 데이터)을 유지한다.
  const [isPending, startTransition] = useTransition();

  const changePage = (next: number) => startTransition(() => setPage(next));

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-4 text-xl font-bold">슬라이드 분석 결과 뷰어</h1>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            // 다시 시도: 쿼리의 에러 상태를 지워야(reset) 다시 렌더링될 때 요청을 새로 보낸다.
            onReset={reset}
            resetKeys={[page]}
            fallbackRender={({ error, resetErrorBoundary }) => (
              <SlideList
                page={page}
                errorMessage={error instanceof Error ? error.message : '알 수 없는 오류'}
                onRetry={resetErrorBoundary}
              />
            )}
          >
            <Suspense fallback={<SlideList page={page} />}>
              <SlideListQuery page={page} isStale={isPending} onPageChange={changePage} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </main>
  );
}
