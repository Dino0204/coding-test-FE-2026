import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('기본 type은 button이고 클릭 이벤트를 전달한다', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>재시도</Button>);
    const button = screen.getByRole('button', { name: '재시도' });
    expect(button).toHaveAttribute('type', 'button');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disabled면 클릭이 호출되지 않는다', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        재시도
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
