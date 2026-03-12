import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useResourceContext, useListContext, useResourceDefinitions } from 'ra-core';
import { TableHeader } from './TableHeader';

// Mock ra-core
vi.mock('ra-core', () => ({
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

describe('TableHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render title and counter', () => {
    (useResourceContext as any).mockReturnValue('products');
    (useListContext as any).mockReturnValue({ total: 10, isPending: false, selectedIds: [] });
    (useResourceDefinitions as any).mockReturnValue({ products: { hasCreate: false } });

    const { getByTestId, getByText } = render(<TableHeader />);

    expect(getByTestId('header-title').textContent).toBe('Products');
    expect(getByTestId('header-counter').textContent).toBe('(10)');
  });

  it('should render CreateButton when resource has create', () => {
    (useResourceContext as any).mockReturnValue('products');
    (useListContext as any).mockReturnValue({ total: 10, isPending: false, selectedIds: [] });
    (useResourceDefinitions as any).mockReturnValue({ products: { hasCreate: true } });

    const { getByText } = render(<TableHeader />);

    expect(getByText('Create')).toBeDefined();
  });

  it('should NOT render CreateButton when resource does NOT have create', () => {
    (useResourceContext as any).mockReturnValue('products');
    (useListContext as any).mockReturnValue({ total: 10, isPending: false, selectedIds: [] });
    (useResourceDefinitions as any).mockReturnValue({ products: { hasCreate: false } });

    const { queryByText } = render(<TableHeader />);

    expect(queryByText('Create')).toBeNull();
  });

  it('should NOT render actions when actions={null}', () => {
    (useResourceContext as any).mockReturnValue('products');
    (useListContext as any).mockReturnValue({ total: 10, isPending: false, selectedIds: [] });
    (useResourceDefinitions as any).mockReturnValue({ products: { hasCreate: true } });

    const { queryByText, getByTestId } = render(<TableHeader actions={null} />);

    expect(queryByText('Create')).toBeNull();
    expect(getByTestId('header-actions').children.length).toBe(0);
  });
});
