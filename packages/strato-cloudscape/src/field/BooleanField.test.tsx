
import { render } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { useFieldValue, useRecordContext } from '@strato-admin/core';
import BooleanField from './BooleanField';

// Mock ra-core
vi.mock('@strato-admin/core', () => import('../__mocks__/strato-core'));

// Mock Cloudscape components
vi.mock('@cloudscape-design/components/status-indicator', () => ({
  default: ({ children, type }: any) => (
    <div data-testid="status-indicator" data-type={type}>
      {children}
    </div>
  ),
}));

describe('BooleanField', () => {
  it('should render check icon for true value', () => {
    const record = { is_active: true };
    (useRecordContext as any).mockReturnValue(record);
    (useFieldValue as any).mockReturnValue(true);

    const { getByTestId } = render(<BooleanField source="is_active" />);

    const indicator = getByTestId('status-indicator');
    expect(indicator.getAttribute('data-type')).toBe('success');
  });

  it('should render close icon for false value', () => {
    const record = { is_active: false };
    (useRecordContext as any).mockReturnValue(record);
    (useFieldValue as any).mockReturnValue(false);

    const { getByTestId } = render(<BooleanField source="is_active" />);

    const indicator = getByTestId('status-indicator');
    expect(indicator.getAttribute('data-type')).toBe('not-started');
  });

  it('should render label when showLabel is true', () => {
    const record = { is_active: true };
    (useRecordContext as any).mockReturnValue(record);
    (useFieldValue as any).mockReturnValue(true);

    const { getByText } = render(<BooleanField source="is_active" showLabel />);

    expect(getByText('Yes')).toBeDefined();
  });

  it('should render custom labels', () => {
    const record = { is_active: false };
    (useRecordContext as any).mockReturnValue(record);
    (useFieldValue as any).mockReturnValue(false);

    const { getByText } = render(
      <BooleanField source="is_active" showLabel trueLabel="Enabled" falseLabel="Disabled" />,
    );

    expect(getByText('Disabled')).toBeDefined();
  });
});
