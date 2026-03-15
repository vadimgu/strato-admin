import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useResourceContext } from 'strato-core';
import { Create } from './Create';

// Mock ra-core
vi.mock('strato-core', () => ({
  CreateBase: ({ children }: any) => <div data-testid="create-base">{children}</div>,
  useTranslate: vi.fn(() => (key: string, options: any) => options?._ || key),
  useResourceContext: vi.fn(),
  useResourceDefinitions: vi.fn(() => ({})),
  useCreateContext: vi.fn(() => ({})),
}));

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

describe('Create', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render content and title', () => {
    (useResourceContext as any).mockReturnValue('products');

    const { getByTestId, getByText } = render(
      <Create>
        <div data-testid="content">Create New</div>
      </Create>,
    );

    expect(getByTestId('container')).toBeDefined();
    expect(getByTestId('content').textContent).toBe('Create New');
    expect(getByText('Products')).toBeDefined();
  });

  it('should use provided title', () => {
    (useResourceContext as any).mockReturnValue('products');

    const { getByText } = render(
      <Create title="Add New Product">
        <div />
      </Create>,
    );

    expect(getByText('Add New Product')).toBeDefined();
  });
});
