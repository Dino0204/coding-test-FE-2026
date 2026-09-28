import { useRef } from 'react';

const DEBOUNCE_MS = 300;

type SearchInputProps = {
  /** 처음 보여 줄 검색어 (URL에서 읽은 값) */
  defaultValue?: string;
  onSearch: (q: string) => void;
};

// 입력마다 이전 타이머를 취소하고 새로 건다. 입력이 300ms 동안 멈춰야 onSearch가 한 번 호출된다.
export function SearchInput({ defaultValue, onSearch }: SearchInputProps) {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  return (
    <input
      type="search"
      defaultValue={defaultValue}
      aria-label="슬라이드 ID 또는 환자명 검색"
      placeholder="슬라이드 ID 또는 환자명"
      className="h-10 w-full max-w-sm rounded-md border border-border bg-surface px-3 focus-visible:outline-2 focus-visible:outline-primary"
      onChange={(e) => {
        const value = e.target.value.trim();
        clearTimeout(timer.current);
        timer.current = setTimeout(() => onSearch(value), DEBOUNCE_MS);
      }}
    />
  );
}
