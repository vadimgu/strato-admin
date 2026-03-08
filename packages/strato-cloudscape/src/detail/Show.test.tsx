import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useShowContext, useResourceContext } from 'ra-core';
import Show from './Show';

// Mock ra-core
vi.mock('ra-core', () => ({
  ShowBase: ({ children }: any) => <div data-testid="show-base">{children}</div>,
  useShowContext: vi.fn(),
  useTranslate: vi.fn(() => (key: string, options: any) => options?._ || key),
  useRecordContext: vi.fn((record) => record),
  useResourceContext: vi.fn(),
  useResourceDefinitions: vi.fn(() => ({})),
  useFieldValue: vi.fn(({ source, record }) => record?.[source]),
  useCreatePath: vi.fn(() => (params: any) => `/${params.resource}/${params.id}/${params.type}`),
}));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
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

describe('Show', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing when loading', () => {
    (useShowContext as any).mockReturnValue({
      isLoading: true,
      record: undefined,
    });

    const { queryByTestId } = render(
      <Show>
        <div data-testid="content" />
      </Show>,
    );

    expect(queryByTestId('container')).toBeNull();
  });

  it('should render content and title when record is loaded', () => {
    (useShowContext as any).mockReturnValue({
      isLoading: false,
      record: { id: 1 },
      resource: 'products',
    });
    (useResourceContext as any).mockReturnValue('products');

    const { getByTestId, getByText } = render(
      <Show>
        <div data-testid="content">Hello World</div>
      </Show>,
    );

    expect(getByTestId('container')).toBeDefined();
    expect(getByTestId('content').textContent).toBe('Hello World');
    expect(getByText('Products')).toBeDefined();
  });

  it('should use provided title', () => {
    (useShowContext as any).mockReturnValue({
      isLoading: false,
      record: { id: 1 },
      resource: 'products',
    });

    const { getByText } = render(
      <Show title="My Product">
        <div />
      </Show>,
    );

    expect(getByText('My Product')).toBeDefined();
  });
});
