import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useEditContext, useResourceContext } from 'ra-core';
import { Edit } from './Edit';

// Mock ra-core
vi.mock('ra-core', () => ({
  EditBase: ({ children }: any) => <div data-testid="edit-base">{children}</div>,
  useEditContext: vi.fn(),
  useTranslate: vi.fn(() => (key: string, options: any) => options?._ || key),
  useRecordContext: vi.fn((record) => record),
  useResourceContext: vi.fn(),
  useResourceDefinitions: vi.fn(() => ({})),
  useFieldValue: vi.fn(({ source, record }) => record?.[source]),
  useCreatePath: vi.fn(() => (params: any) => `/${params.resource}/${params.id}/${params.type}`),
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
      record: { id: 1 },
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
    expect(getByText('Products')).toBeDefined();
  });

  it('should use provided title', () => {
    (useEditContext as any).mockReturnValue({
      isLoading: false,
      record: { id: 1 },
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
