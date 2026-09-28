import { formatKst, maskPatientName, STATUS_LABEL } from './format';

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
