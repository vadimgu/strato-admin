import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useShowController, useResourceContext, useShowContext } from '@strato-admin/ra-core';
import { Detail } from './Detail';

vi.mock('@strato-admin/ra-core', () => import('../__mocks__/ra-core'));
vi.mock('@strato-admin/core', () => import('../__mocks__/strato-core'));

// Mock Cloudscape components
vi.mock('@cloudscape-design/components/container', () => ({
  default: ({ children, header }: any) => (
    <div data-testid="container">
      {header && <div data-testid="container-header">{header}</div>}
      <div data-testid="container-content">{children}</div>
    </div>
  ),
}));

vi.mock('@cloudscape-design/components/header', () => ({
  default: ({ children }: any) => <header>{children}</header>,
}));

vi.mock('@cloudscape-design/components/space-between', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

// Mock KeyValuePairs
vi.mock('./KeyValuePairs', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

describe('Detail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useResourceContext as any).mockReturnValue('products');
    const controllerProps = {
      record: { id: 1, name: 'Test Product' },
      isLoading: false,
      resource: 'products',
      defaultTitle: 'Products',
    };
    (useShowController as any).mockReturnValue(controllerProps);
    (useShowContext as any).mockReturnValue(controllerProps);
  });

  afterEach(() => {
    cleanup();
  });

  it('should render nothing when loading', () => {
    const controllerProps = {
      isLoading: true,
      record: undefined,
      resource: 'products',
      defaultTitle: 'Products',
    };
    (useShowController as any).mockReturnValue(controllerProps);
    (useShowContext as any).mockReturnValue(controllerProps);

    const { queryByTestId } = render(
      <Detail>
        <div />
      </Detail>,
    );

    expect(queryByTestId('container')).toBeNull();
  });

  it('should render content and title when record is loaded', () => {
    const { getByTestId, getByText } = render(
      <Detail>
        <div data-testid="content">Product Content</div>
      </Detail>,
    );

    expect(getByTestId('container')).toBeDefined();
    expect(getByText('Product Content')).toBeDefined();
    expect(getByText(/Products/)).toBeDefined();
  });

  it('should use provided title', () => {
    const { getByText } = render(
      <Detail title="Custom Title">
        <div />
      </Detail>,
    );

    expect(getByText('Custom Title')).toBeDefined();
  });
});
