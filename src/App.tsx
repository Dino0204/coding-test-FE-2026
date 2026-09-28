import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchSlides } from './api/slides';
import { SlideList } from './components/SlideList';

export default function App() {
  // 현재 페이지의 기준은 이 state 하나다. 응답의 page를 기준으로 삼으면 요청 실패 시 둘이 어긋난다.
  const [page, setPage] = useState(1);
  // queryKey에 page를 넣어 페이지마다 따로 요청·캐시한다. 늦게 온 이전 페이지 응답이 현재 화면을 덮지 않는다.
  const { data, error, refetch } = useQuery({
    queryKey: ['slides', page],
    queryFn: () => fetchSlides(page),
    placeholderData: keepPreviousData, // 다음 페이지를 받는 동안 이전 목록을 유지한다
  });

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-4 text-xl font-bold">슬라이드 분석 결과 뷰어</h1>
      <SlideList
        items={data?.items}
        total={data?.total}
        page={page}
        error={error}
        onPageChange={setPage}
        onRetry={() => refetch()}
      />
    </main>
  );
}
