import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { useFieldValue, useRecordContext } from 'ra-core';
import BooleanField from './BooleanField';

// Mock ra-core
vi.mock('ra-core', () => ({
  useRecordContext: vi.fn(),
  useFieldValue: vi.fn(),
}));

// Mock Cloudscape components
vi.mock('@cloudscape-design/components/box', () => ({
  default: ({ children, display }: any) => (
    <div data-testid="box" style={{ display }}>
      {children}
    </div>
  ),
}));

vi.mock('@cloudscape-design/components/icon', () => ({
  default: ({ name, variant }: any) => <span data-testid="icon" data-name={name} data-variant={variant} />,
}));

describe('BooleanField', () => {
  it('should render check icon for true value', () => {
    const record = { is_active: true };
    (useRecordContext as any).mockReturnValue(record);
    (useFieldValue as any).mockReturnValue(true);

    const { getByTestId } = render(<BooleanField source="is_active" />);

    const icon = getByTestId('icon');
    expect(icon.getAttribute('data-name')).toBe('check');
    expect(icon.getAttribute('data-variant')).toBe('success');
  });

  it('should render close icon for false value', () => {
    const record = { is_active: false };
    (useRecordContext as any).mockReturnValue(record);
    (useFieldValue as any).mockReturnValue(false);

    const { getByTestId } = render(<BooleanField source="is_active" />);

    const icon = getByTestId('icon');
    expect(icon.getAttribute('data-name')).toBe('close');
    expect(icon.getAttribute('data-variant')).toBe('error');
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
