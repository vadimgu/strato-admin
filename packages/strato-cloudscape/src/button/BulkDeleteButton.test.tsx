import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BulkDeleteButton } from './BulkDeleteButton';
import {
  useListContext,
  useBulkDeleteController,
  useTranslate,
  useResourceDefinition,
  useResourceContext,
  useGetResourceLabel,
} from '@strato-admin/ra-core';

vi.mock('@strato-admin/ra-core', () => ({
  useListContext: vi.fn(),
  useBulkDeleteController: vi.fn(),
  useTranslate: vi.fn(),
  useResourceDefinition: vi.fn(),
  useResourceContext: vi.fn(),
  useGetResourceLabel: vi.fn(),
}));

vi.mock('@strato-admin/core', () => ({
  useSchemaRegistry: vi.fn(() => ({ defaultComponents: {} })),
  useSettings: vi.fn(() => ({})),
  useSettingValue: vi.fn(() => (propValue: any, _settingKey: any, schemaValue?: any) => {
    if (propValue !== undefined) return propValue;
    if (schemaValue !== undefined) return schemaValue;
    return undefined;
  }),
}));

describe('BulkDeleteButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslate as any).mockReturnValue((key: string, options: any) => {
      if (key === 'strato.message.bulk_delete_title') return 'Delete 2 items';
      if (key === 'strato.message.bulk_delete_content') return 'Are you sure you want to delete these 2 items?';
      return options?._ || key;
    });
    (useBulkDeleteController as any).mockReturnValue({
      handleDelete: vi.fn(),
      isPending: false,
      isLoading: false,
    });
    (useResourceDefinition as any).mockReturnValue({ options: {} });
    (useResourceContext as any).mockReturnValue('posts');
    (useGetResourceLabel as any).mockReturnValue(() => 'Posts');
  });

  afterEach(() => {
    cleanup();
  });

  it('should be disabled when no ids are selected', () => {
    (useListContext as any).mockReturnValue({ selectedIds: [] });
    render(<BulkDeleteButton />);
    expect(screen.getByText('Delete').closest('button')).toHaveProperty('disabled', true);
  });

  it('should render when ids are selected', () => {
    (useListContext as any).mockReturnValue({ selectedIds: [1, 2] });
    render(<BulkDeleteButton />);
    expect(screen.getByText('Delete')).toBeDefined();
  });

  it('should return null when canDelete is false', () => {
    (useResourceDefinition as any).mockReturnValue({ options: { canDelete: false } });
    (useListContext as any).mockReturnValue({ selectedIds: [1, 2] });
    const { container } = render(<BulkDeleteButton />);
    expect(container.firstChild).toBeNull();
  });

  it('should open dialog on click and call handleDelete on confirm', () => {
    const handleDelete = vi.fn();
    (useBulkDeleteController as any).mockReturnValue({
      handleDelete,
      isPending: false,
      isLoading: false,
    });
    (useListContext as any).mockReturnValue({ selectedIds: [1, 2] });

    render(<BulkDeleteButton />);
    fireEvent.click(screen.getByText('Delete'));

    expect(handleDelete).not.toHaveBeenCalled();
    expect(screen.getByText('Delete 2 items')).toBeDefined();
    expect(screen.getByText('Are you sure you want to delete these 2 items?')).toBeDefined();

    fireEvent.click(screen.getByTestId('confirm-bulk-delete'));
    expect(handleDelete).toHaveBeenCalled();
  });

  it('should use custom dialogTitle and dialogDescription', () => {
    (useListContext as any).mockReturnValue({ selectedIds: [1, 2] });
    render(<BulkDeleteButton dialogTitle="Custom Title" dialogDescription="Custom Description" />);
    fireEvent.click(screen.getByText('Delete'));

    expect(screen.getByText('Custom Title')).toBeDefined();
    expect(screen.getByText('Custom Description')).toBeDefined();
  });
});
