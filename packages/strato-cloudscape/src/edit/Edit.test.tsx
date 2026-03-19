import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useEditContext, useResourceContext } from '@strato-admin/core';
import { Edit } from './Edit';

// Mock ra-core
vi.mock('@strato-admin/core', () => import('../__mocks__/strato-core'));

// Mock Cloudscape components
vi.mock('@cloudscape-design/components/container', () => ({
  default: ({ children, header }: any) => (
    <div data-testid="container">
      <div data-testid="container-header">{header}</div>
      <div data-testid="container-content">{children}</div>
    </div>
  ),
}));

vi.mock('@cloudscape-design/components/header', () => ({
  default: ({ children, actions }: any) => (
    <header>
      <div>{children}</div>
      <div>{actions}</div>
    </header>
  ),
}));

vi.mock('@cloudscape-design/components/space-between', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@cloudscape-design/components/button', () => ({
  default: ({ children }: any) => <button>{children}</button>,
}));

describe('Edit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing when loading', () => {
    (useEditContext as any).mockReturnValue({
      isLoading: true,
      record: undefined,
    });

    const { queryByTestId } = render(
      <Edit>
        <div data-testid="content" />
      </Edit>,
    );

    expect(queryByTestId('container')).toBeNull();
  });

  it('should render content and title when record is loaded', () => {
    (useEditContext as any).mockReturnValue({
      isLoading: false,
      record: { id: 1 }, defaultTitle: 'Products',
      resource: 'products',
    });
    (useResourceContext as any).mockReturnValue('products');

    const { getByTestId, getByText } = render(
      <Edit>
        <div data-testid="content">Hello World</div>
      </Edit>,
    );

    expect(getByTestId('container')).toBeDefined();
    expect(getByTestId('content').textContent).toBe('Hello World');
    expect(getByText(/Products/)).toBeDefined();
  });

  it('should use provided title', () => {
    (useEditContext as any).mockReturnValue({
      isLoading: false,
      record: { id: 1 }, defaultTitle: 'Products',
      resource: 'products',
    });

    const { getByText } = render(
      <Edit title="My Product">
        <div />
      </Edit>,
    );

    expect(getByText('My Product')).toBeDefined();
  });
});
