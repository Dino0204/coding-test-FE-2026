import { formatCellCount, formatKi67, formatKst, maskPatientName, STATUS_LABEL } from './format';

describe('maskPatientName', () => {
  it.each([
    ['홍길동', '홍*동'],
    ['김민', '김*'],
    ['남궁민수', '남**수'],
  ])('%s → %s', (input, expected) => {
    expect(maskPatientName(input)).toBe(expected);
  });
});

describe('formatKst', () => {
  it('UTC를 KST로 바꿔 날짜가 넘어가는 시각도 YYYY-MM-DD HH:mm으로 표시한다', () => {
    expect(formatKst('2026-09-01T16:30:00Z')).toBe('2026-09-02 01:30');
  });

  it('KST 기준 날짜가 그대로인 시각을 표시한다', () => {
    expect(formatKst('2026-09-26T00:05:00Z')).toBe('2026-09-26 09:05');
  });
});

describe('STATUS_LABEL', () => {
  it.each([
    ['completed', '완료'],
    ['processing', '분석 중'],
    ['failed', '실패'],
  ] as const)('%s → %s', (status, label) => {
    expect(STATUS_LABEL[status]).toBe(label);
  });
});

describe('formatKi67', () => {
  it('소수점 첫째 자리까지 %로 표시한다', () => {
    expect(formatKi67(41.16)).toBe('41.2%');
  });

  it('분석 결과가 없으면(null) 분석 결과 없음으로 표시한다', () => {
    expect(formatKi67(null)).toBe('분석 결과 없음');
  });
});

describe('formatCellCount', () => {
  it.each([
    [12480, '12,480'],
    [30321, '30,321'],
  ])('%d → %s', (input, expected) => {
    expect(formatCellCount(input)).toBe(expected);
  });
});
