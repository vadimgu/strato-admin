import { render, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { useFieldValue, useRecordContext, useResourceDefinition } from '@strato-admin/core';
import IdField from './IdField';

// Mock strato-core
vi.mock('@strato-admin/core', () => ({
  useRecordContext: vi.fn(),
  useFieldValue: vi.fn(),
  useResourceDefinition: vi.fn(),
}));

// Mock RecordLink
vi.mock('../RecordLink', () => ({
  default: ({ children, link }: any) => (
    <a data-testid="record-link" data-link={link}>
      {children}
    </a>
  ),
}));

describe('IdField', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render the ID and link to show by default if hasShow is true', () => {
    const record = { id: '123' };
    (useRecordContext as any).mockReturnValue(record);
    (useFieldValue as any).mockImplementation(({ source }: any) => (record as any)[source]);
    (useResourceDefinition as any).mockReturnValue({ hasShow: true });

    const { getByTestId, getByText } = render(<IdField />);

    expect(getByText('123')).toBeDefined();
    const link = getByTestId('record-link');
    expect(link.getAttribute('data-link')).toBe('show');
  });

  it('should not link by default if hasShow is false', () => {
    const record = { id: '123' };
    (useRecordContext as any).mockReturnValue(record);
    (useFieldValue as any).mockImplementation(({ source }: any) => (record as any)[source]);
    (useResourceDefinition as any).mockReturnValue({ hasShow: false });

    const { getByTestId, getByText } = render(<IdField />);

    expect(getByText('123')).toBeDefined();
    const link = getByTestId('record-link');
    expect(link.getAttribute('data-link')).toBe(null);
  });

  it('should use custom source if provided', () => {
    const record = { identifier: 'abc' };
    (useRecordContext as any).mockReturnValue(record);
    (useFieldValue as any).mockImplementation(({ source }: any) => (record as any)[source]);
    (useResourceDefinition as any).mockReturnValue({ hasShow: true });

    const { getByText } = render(<IdField source="identifier" />);

    expect(getByText('abc')).toBeDefined();
  });

  it('should allow overriding link', () => {
    const record = { id: '123' };
    (useRecordContext as any).mockReturnValue(record);
    (useFieldValue as any).mockImplementation(({ source }: any) => (record as any)[source]);
    (useResourceDefinition as any).mockReturnValue({ hasShow: true });

    const { getByTestId } = render(<IdField link="edit" />);

    const link = getByTestId('record-link');
    expect(link.getAttribute('data-link')).toBe('edit');
  });
});
