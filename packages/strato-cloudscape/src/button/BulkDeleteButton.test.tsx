
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BulkDeleteButton } from './BulkDeleteButton';
import { useListContext, useBulkDeleteController, useTranslate, useResourceDefinition } from '@strato-admin/core';

vi.mock('@strato-admin/core', () => ({
  useListContext: vi.fn(),
  useBulkDeleteController: vi.fn(),
  useTranslate: vi.fn(),
  useResourceDefinition: vi.fn(),
}));

describe('BulkDeleteButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslate as any).mockReturnValue((key: string, options: any) => options?._ || key);
    (useBulkDeleteController as any).mockReturnValue({
      handleDelete: vi.fn(),
      isPending: false,
      isLoading: false,
    });
    (useResourceDefinition as any).mockReturnValue({ options: {} });
  });

  afterEach(() => {
    cleanup();
  });

  it('should be disabled when no ids are selected', () => {
    (useListContext as any).mockReturnValue({ selectedIds: [] });
    render(<BulkDeleteButton />);
    expect(screen.getByRole('button')).toHaveProperty('disabled', true);
  });

  it('should render when ids are selected', () => {
    (useListContext as any).mockReturnValue({ selectedIds: [1, 2] });
    render(<BulkDeleteButton />);
    expect(screen.getByRole('button')).toBeDefined();
    expect(screen.getByText('Delete')).toBeDefined();
  });

  it('should return null when canDelete is false', () => {
    (useResourceDefinition as any).mockReturnValue({ options: { canDelete: false } });
    (useListContext as any).mockReturnValue({ selectedIds: [1, 2] });
    const { container } = render(<BulkDeleteButton />);
    expect(container.firstChild).toBeNull();
  });

  it('should call handleDelete on click', () => {
    const handleDelete = vi.fn();
    (useBulkDeleteController as any).mockReturnValue({
      handleDelete,
      isPending: false,
      isLoading: false,
    });
    (useListContext as any).mockReturnValue({ selectedIds: [1, 2] });

    render(<BulkDeleteButton />);
    fireEvent.click(screen.getByRole('button'));

    expect(handleDelete).toHaveBeenCalled();
  });
});
