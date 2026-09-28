import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// 기본값(3회 재시도)은 간헐적 500을 조용히 복구해 에러 화면과 '다시 시도' 버튼이 사실상 보이지 않으므로 끈다.
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  return worker.start({ onUnhandledRequest: 'bypass', quiet: true });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
});
