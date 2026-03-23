import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useResourceContext, useShowContext } from '@strato-admin/core';
import { DetailHeader } from './DetailHeader';

// Mock strato-core
vi.mock('@strato-admin/core', () => import('../__mocks__/strato-core'));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

// Mock Cloudscape components
vi.mock('@cloudscape-design/components/header', () => ({
  default: ({ children, actions }: any) => (
    <header>
      <div data-testid="header-title">{children}</div>
      <div data-testid="header-actions">{actions}</div>
    </header>
  ),
}));

vi.mock('@cloudscape-design/components/space-between', () => ({
  default: ({ children }: any) => <div data-testid="space-between">{children}</div>,
}));

vi.mock('@cloudscape-design/components/button', () => ({
  default: ({ children, variant }: any) => (
    <button data-testid="button" data-variant={variant}>
      {children}
    </button>
  ),
}));

describe('DetailHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render title from resource', () => {
    (useResourceContext as any).mockReturnValue('products');
    (useShowContext as any).mockReturnValue({ record: { id: 1 }, defaultTitle: 'Products' });

    const { getByTestId } = render(<DetailHeader />);

    expect(getByTestId('header-title').textContent).toBe('Products');
  });

  it('should render provided title', () => {
    (useResourceContext as any).mockReturnValue('products');
    (useShowContext as any).mockReturnValue({ record: { id: 1 }, defaultTitle: 'Products' });

    const { getByTestId } = render(<DetailHeader title="My Product" />);

    expect(getByTestId('header-title').textContent).toBe('My Product');
  });

  it('should render EditButton by default as primary', () => {
    (useResourceContext as any).mockReturnValue('products');
    (useShowContext as any).mockReturnValue({ record: { id: 1 }, defaultTitle: 'Products' });

    const { getByText } = render(<DetailHeader />);

    const editButton = getByText('Edit');
    expect(editButton).toBeDefined();
    expect(editButton.getAttribute('data-variant')).toBe('primary');
  });

  it('should render custom actions if provided', () => {
    (useResourceContext as any).mockReturnValue('products');
    (useShowContext as any).mockReturnValue({ record: { id: 1 }, defaultTitle: 'Products' });

    const { getByTestId, queryByText } = render(<DetailHeader actions={<div data-testid="custom-action">Custom</div>} />);

    expect(getByTestId('custom-action')).toBeDefined();
    expect(queryByText("strato.action.edit")).toBeNull();
  });
});
