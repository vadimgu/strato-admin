import { render, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { useFieldValue, useRecordContext } from 'strato-core';
import StatusIndicatorField from './StatusIndicatorField';

// Mock ra-core
vi.mock('strato-core', () => ({
  useRecordContext: vi.fn(),
  useFieldValue: vi.fn(),
}));

// Mock Cloudscape components
vi.mock('@cloudscape-design/components/status-indicator', () => ({
  default: ({ children, type, colorOverride, iconAriaLabel }: any) => (
    <div
      data-testid="status-indicator"
      data-type={type}
      data-color={colorOverride}
      data-aria={iconAriaLabel}
    >
      {children}
    </div>
  ),
}));

describe('StatusIndicatorField', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render value with default info type', () => {
    const record = { status: 'active' };
    (useRecordContext as any).mockReturnValue(record);
    (useFieldValue as any).mockReturnValue('active');

    const { getByTestId, getByText } = render(<StatusIndicatorField source="status" />);

    const indicator = getByTestId('status-indicator');
    expect(indicator.getAttribute('data-type')).toBe('info');
    expect(getByText('active')).toBeDefined();
  });

  it('should render with specified type', () => {
    const record = { status: 'active' };
    (useRecordContext as any).mockReturnValue(record);
    (useFieldValue as any).mockReturnValue('active');

    const { getByTestId } = render(<StatusIndicatorField source="status" type="success" />);

    const indicator = getByTestId('status-indicator');
    expect(indicator.getAttribute('data-type')).toBe('success');
  });

  it('should render with mapping', () => {
    const record = { status: 'inactive' };
    (useRecordContext as any).mockReturnValue(record);
    (useFieldValue as any).mockReturnValue('inactive');

    const { getByTestId } = render(
      <StatusIndicatorField source="status" mapping={{ active: 'success', inactive: 'stopped' }} />,
    );

    const indicator = getByTestId('status-indicator');
    expect(indicator.getAttribute('data-type')).toBe('stopped');
  });

  it('should render with dynamic type function', () => {
    const record = { status: 'error' };
    (useRecordContext as any).mockReturnValue(record);
    (useFieldValue as any).mockReturnValue('error');

    const { getByTestId } = render(
      <StatusIndicatorField
        source="status"
        type={(val) => (val === 'error' ? 'error' : 'info')}
      />,
    );

    const indicator = getByTestId('status-indicator');
    expect(indicator.getAttribute('data-type')).toBe('error');
  });

  it('should render nothing when value is missing', () => {
    (useRecordContext as any).mockReturnValue({});
    (useFieldValue as any).mockReturnValue(undefined);

    const { queryByTestId } = render(<StatusIndicatorField source="status" />);

    expect(queryByTestId('status-indicator')).toBeNull();
  });

  it('should render emptyText when value is missing', () => {
    (useRecordContext as any).mockReturnValue({});
    (useFieldValue as any).mockReturnValue(undefined);

    const { getByText } = render(
      <StatusIndicatorField source="status" emptyText="No Status" />,
    );

    expect(getByText('No Status')).toBeDefined();
  });

  it('should render with colorOverride', () => {
    const record = { status: 'custom' };
    (useRecordContext as any).mockReturnValue(record);
    (useFieldValue as any).mockReturnValue('custom');

    const { getByTestId } = render(
      <StatusIndicatorField source="status" type="success" colorOverride="blue" />,
    );

    const indicator = getByTestId('status-indicator');
    expect(indicator.getAttribute('data-color')).toBe('blue');
  });

  it('should render with iconAriaLabel', () => {
    const record = { status: 'active' };
    (useRecordContext as any).mockReturnValue(record);
    (useFieldValue as any).mockReturnValue('active');

    const { getByTestId } = render(
      <StatusIndicatorField source="status" iconAriaLabel="Active status" />,
    );

    const indicator = getByTestId('status-indicator');
    expect(indicator.getAttribute('data-aria')).toBe('Active status');
  });

  it('should render with Label children mapping', () => {
    const record = { status: 'rejected' };
    (useRecordContext as any).mockReturnValue(record);
    (useFieldValue as any).mockReturnValue('rejected');

    const { getByTestId, getByText } = render(
      <StatusIndicatorField source="status">
        <StatusIndicatorField.Label value="accepted" type="success" label="Accepted" />
        <StatusIndicatorField.Label value="rejected" type="error" label="Rejected" color="red" />
      </StatusIndicatorField>,
    );

    const indicator = getByTestId('status-indicator');
    expect(indicator.getAttribute('data-type')).toBe('error');
    expect(indicator.getAttribute('data-color')).toBe('red');
    expect(getByText('Rejected')).toBeDefined();
  });
});
