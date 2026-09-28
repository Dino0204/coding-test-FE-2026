import { useEffect, useState } from 'react';
import { fetchSlides } from './api/slides';
import type { SlideListResponse } from './api/types';
import { SlideList } from './components/SlideList';

export default function App() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<SlideListResponse | null>(null);

  useEffect(() => {
    // 페이지를 빠르게 바꾸면 이전 요청이 늦게 도착해 최신 결과를 덮어쓸 수 있으므로 무시한다.
    let ignore = false;
    // ponytail: 로딩·에러 화면 없음. 실패 시 이전 화면 유지. 요구사항 2에서 처리
    fetchSlides(page)
      .then((res) => !ignore && setData(res))
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [page]);

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="mb-4 text-xl font-bold">슬라이드 분석 결과 뷰어</h1>
      {data && <SlideList data={data} onPageChange={setPage} />}
    </main>
  );
}
