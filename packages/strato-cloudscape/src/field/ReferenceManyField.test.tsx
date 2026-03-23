import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ReferenceManyField from './ReferenceManyField';
import Table from '../list/Table';

// Mock ra-core (via strato-core)
vi.mock('@strato-admin/core', () => ({
  ReferenceManyFieldBase: vi.fn(({ children }: any) => (
    <div data-testid="ra-reference-many-field-base">{children}</div>
  )),
  ResourceSchemaProvider: vi.fn(({ children }: any) => <div data-testid="resource-schema-provider">{children}</div>),
  ResourceContextProvider: ({ children }: any) => <div data-testid="resource-context-provider">{children}</div>,
  useResourceSchema: vi.fn((resource: string) => ({
    listComponent: resource === 'with-custom-list' ? MockCustomList : undefined,
  })),
}));

// Mock Table
vi.mock('../list/Table', () => ({
  default: vi.fn(({ title }: any) => <div data-testid="default-table">{title}</div>),
}));

const MockCustomList = vi.fn(({ title }: any) => <div data-testid="custom-list">{title}</div>);

describe('ReferenceManyField', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render children within providers if provided', () => {
    render(
      <ReferenceManyField reference="comments" target="post_id">
        <div data-testid="child">Child Content</div>
      </ReferenceManyField>,
    );

    expect(screen.getByTestId('ra-reference-many-field-base')).toBeDefined();
    expect(screen.getByTestId('resource-schema-provider')).toBeDefined();
    expect(screen.getByTestId('child')).toBeDefined();
    expect(screen.getByTestId('child').textContent).toBe('Child Content');
  });

  it('should render default Table if no children provided', () => {
    render(<ReferenceManyField reference="comments" target="post_id" title="Default Table Title" />);

    expect(screen.getByTestId('default-table')).toBeDefined();
    expect(screen.getByTestId('default-table').textContent).toBe('Default Table Title');
  });

  it('should render custom listComponent from schema if no children provided', () => {
    render(<ReferenceManyField reference="with-custom-list" target="post_id" title="Custom List Title" />);

    expect(screen.getByTestId('custom-list')).toBeDefined();
    expect(screen.getByTestId('custom-list').textContent).toBe('Custom List Title');
  });

  it('should pass list props to the default component', () => {
    render(
      <ReferenceManyField
        reference="comments"
        target="post_id"
        include={['id', 'name']}
        exclude={['date']}
        display={['id']}
        filtering={false}
        preferences={true}
      />,
    );

    expect(Table).toHaveBeenCalled();
    const props = (Table as any).mock.calls[0][0];
    expect(props).toMatchObject({
      include: ['id', 'name'],
      exclude: ['date'],
      display: ['id'],
      filtering: false,
      preferences: true,
    });
  });
});
