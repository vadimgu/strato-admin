import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useResourceContext, useListContext, useResourceDefinitions, useTranslate } from '@strato-admin/core';
import { TableHeader } from './TableHeader';

// Mock ra-core
vi.mock('@strato-admin/core', () => ({
  useResourceContext: vi.fn(),
  useListContext: vi.fn(),
  useTranslate: vi.fn(() => (key: string, options: any) => options?._ || key),
  useResourceDefinitions: vi.fn(() => ({})),
  useLocale: vi.fn(() => 'en'),
  useCreatePath: vi.fn(() => (params: any) => `/${params.resource}/${params.type}`),
  useBulkDeleteController: vi.fn(() => ({
    handleDelete: vi.fn(),
    isPending: false,
    isLoading: false,
  })),
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

// Mock Cloudscape components
vi.mock('@cloudscape-design/components/header', () => ({
  default: ({ children, actions, counter }: any) => (
    <header data-testid="list-header">
      <div data-testid="header-title">{children}</div>
      <div data-testid="header-actions">{actions}</div>
      {counter && <div data-testid="header-counter">{counter}</div>}
    </header>
  ),
}));

vi.mock('@cloudscape-design/components/space-between', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@cloudscape-design/components/button', () => ({
  default: ({ children }: any) => <button>{children}</button>,
}));

// Mock internal buttons
vi.mock('../button/BulkDeleteButton', () => ({
  BulkDeleteButton: () => <button data-testid="bulk-delete">Delete</button>,
}));

vi.mock('../button/CreateButton', () => ({
  CreateButton: () => <button data-testid="create-button">Create</button>,
}));

describe('TableHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset to default mocks
    (useResourceDefinitions as any).mockReturnValue({});
    (useTranslate as any).mockReturnValue((key: string, options: any) => options?._ || key);
  });

  afterEach(() => {
    cleanup();
  });

  it('should render title and counter', () => {
    (useResourceContext as any).mockReturnValue('products');
    (useListContext as any).mockReturnValue({
      total: 10,
      isPending: false,
      selectedIds: [],
      defaultTitle: 'Products',
    });
    (useResourceDefinitions as any).mockReturnValue({ products: { hasCreate: false } });

    const { getByTestId } = render(<TableHeader />);

    expect(getByTestId('header-title').textContent).toBe('Products');
    expect(getByTestId('header-counter').textContent).toBe('(10)');
  });

  it('should render actions by default', () => {
    (useResourceContext as any).mockReturnValue('products');
    (useListContext as any).mockReturnValue({ total: 10, isPending: false, selectedIds: [] });

    const { getByTestId } = render(<TableHeader />);

    expect(getByTestId('bulk-delete')).toBeDefined();
    expect(getByTestId('create-button')).toBeDefined();
  });

  it('should NOT render actions when actions={null}', () => {
    (useResourceContext as any).mockReturnValue('products');
    (useListContext as any).mockReturnValue({ total: 10, isPending: false, selectedIds: [] });

    const { queryByTestId, getByTestId } = render(<TableHeader actions={null} />);

    expect(queryByTestId('bulk-delete')).toBeNull();
    expect(queryByTestId('create-button')).toBeNull();
    expect(getByTestId('header-actions').children.length).toBe(0);
  });

  it('should translate string title', () => {
    const translate = vi.fn((key: string, options: any) => options?._ || key);
    (useTranslate as any).mockReturnValue(translate);
    (useResourceContext as any).mockReturnValue('products');
    (useListContext as any).mockReturnValue({ total: 10, isPending: false, selectedIds: [] });

    render(<TableHeader title="Custom Title" />);

    expect(translate).toHaveBeenCalledWith('Custom Title', { _: 'Custom Title' });
  });
});
