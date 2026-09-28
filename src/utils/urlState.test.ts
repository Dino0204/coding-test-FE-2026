import { parseUrlState, toUrlSearch } from './urlState';

describe('parseUrlState', () => {
  it('검색어, 페이지, 선택한 슬라이드 ID를 읽는다', () => {
    expect(parseUrlState('?q=%ED%99%8D%EA%B8%B8%EB%8F%99&page=3&slide=S-2026-0009')).toEqual({
      q: '홍길동',
      page: 3,
      slide: 'S-2026-0009',
    });
  });

  it('쿼리가 없으면 기본값(빈 검색어, 1페이지, 선택 없음)을 쓴다', () => {
    expect(parseUrlState('')).toEqual({ q: '', page: 1, slide: undefined });
  });

  it.each(['abc', '0', '-1'])('잘못된 page=%s는 1페이지로 본다', (page) => {
    expect(parseUrlState(`?page=${page}`).page).toBe(1);
  });
});

describe('toUrlSearch', () => {
  it('기본값은 URL에서 뺀다', () => {
    expect(toUrlSearch({ q: '', page: 1 })).toBe('');
  });

  it('읽은 URL을 다시 쓰면 같은 상태가 된다', () => {
    const state = { q: '홍 길&동', page: 2, slide: 'S-2026-0009' };
    expect(parseUrlState(toUrlSearch(state))).toEqual(state);
  });
});
