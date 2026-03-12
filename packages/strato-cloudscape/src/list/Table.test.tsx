import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useResourceContext, useListContext, useResourceDefinitions } from 'ra-core';
import { useCollection } from '../collection-hooks';
import Table from './Table';
import CloudscapeTable from '@cloudscape-design/components/table';

// Mock ra-core
vi.mock('ra-core', () => ({
  useResourceContext: vi.fn(),
  useListContext: vi.fn(),
  useTranslate: vi.fn(() => (key: string, options: any) => options?._ || key),
  RecordContextProvider: ({ children }: any) => <>{children}</>,
  useRecordContext: vi.fn(),
  useFieldValue: vi.fn(({ source, record }) => record?.[source]),
  useCreatePath: vi.fn(() => (params: any) => `/${params.resource}/${params.id}/${params.type}`),
  useResourceDefinitions: vi.fn(() => ({})),
  useLocale: vi.fn(() => 'en'),
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

// Mock useCollection
vi.mock('../collection-hooks', () => ({
  useCollection: vi.fn(),
}));

// Mock Cloudscape components
vi.mock('@cloudscape-design/components/table', () => ({
  default: vi.fn(({ header }: any) => (
    <div data-testid="cloudscape-table">
      {header && <div data-testid="table-header">{header}</div>}
    </div>
  )),
}));

vi.mock('@cloudscape-design/components/pagination', () => ({
  default: () => <div data-testid="pagination" />,
}));

vi.mock('@cloudscape-design/components/header', () => ({
  default: ({ children, actions }: any) => (
    <header data-testid="header">
      <div data-testid="header-title">{children}</div>
      {actions && <div data-testid="header-actions">{actions}</div>}
    </header>
  ),
}));

vi.mock('@cloudscape-design/components/box', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@cloudscape-design/components/space-between', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

describe('DataTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCollection as any).mockReturnValue({
      items: [],
      paginationProps: {},
      collectionProps: {},
      filterProps: {},
      preferencesProps: {
        preferences: {
          stripedRows: false,
          wrapLines: false,
        },
      },
    });
    (useListContext as any).mockReturnValue({ total: 0, isPending: false });
  });

  it('should generate column IDs with resource prefix', () => {
    (useResourceContext as any).mockReturnValue('products');

    render(
      <Table>
        <Table.Column source="name" label="Product Name" />
        <Table.Column source="price" label="Price" />
        <Table.DateColumn source="lastRestocked" label="Last Restocked" />
        <Table.BooleanColumn source="isEcoFriendly" label="Eco-Friendly" />
      </Table>,
    );

    const tableProps = (CloudscapeTable as any).mock.calls[0][0];
    expect(tableProps.columnDefinitions[0].id).toBe('products___name');
    expect(tableProps.columnDefinitions[1].id).toBe('products___price');
    expect(tableProps.columnDefinitions[2].id).toBe('products___lastRestocked');
    expect(tableProps.columnDefinitions[3].id).toBe('products___isEcoFriendly');
  });

  it('should include sortingField in column definitions', () => {
    (useResourceContext as any).mockReturnValue('products');

    render(
      <Table>
        <Table.Column source="name" label="Product Name" />
      </Table>,
    );

    const tableProps = (CloudscapeTable as any).mock.calls[0][0];
    expect(tableProps.columnDefinitions[0].sortingField).toBe('name');
  });

  it('should generate column IDs with index if source is missing', () => {
    (useResourceContext as any).mockReturnValue('categories');

    render(
      <Table>
        <Table.Column label="No Source" />
      </Table>,
    );

    const tableProps = (CloudscapeTable as any).mock.calls[0][0];
    expect(tableProps.columnDefinitions[0].id).toBe('categories___col-0');
  });

  it('should generate column IDs without resource if resource is not available', () => {
    (useResourceContext as any).mockReturnValue(undefined);

    render(
      <Table>
        <Table.Column source="name" />
      </Table>,
    );

    const tableProps = (CloudscapeTable as any).mock.calls[0][0];
    expect(tableProps.columnDefinitions[0].id).toBe('name');
  });

  it('should reorder columns based on preferences', () => {
    (useResourceContext as any).mockReturnValue('products');
    (useCollection as any).mockReturnValue({
      items: [],
      paginationProps: {},
      collectionProps: {},
      filterProps: {},
      preferencesProps: {
        preferences: {
          contentDisplay: [
            { id: 'products___price', visible: true },
            { id: 'products___name', visible: true },
          ],
        },
      },
    });

    render(
      <Table>
        <Table.Column source="name" label="Product Name" />
        <Table.Column source="price" label="Price" />
      </Table>,
    );

    const tableProps = (CloudscapeTable as any).mock.calls[0][0];
    // Cloudscape handles the ordering via columnDisplay prop
    expect(tableProps.columnDisplay).toEqual([
      { id: 'products___price', visible: true },
      { id: 'products___name', visible: true },
    ]);
  });

  it('should pass actions to TableHeader', () => {
    (useResourceContext as any).mockReturnValue('products');

    const { getByTestId, queryByText } = render(
      <Table actions={<button>Custom Action</button>}>
        <Table.Column source="name" label="Product Name" />
      </Table>,
    );

    expect(getByTestId('header-actions')).toBeDefined();
    expect(queryByText('Custom Action')).toBeDefined();
  });

  it('should pass actions={null} to TableHeader', () => {
    (useResourceContext as any).mockReturnValue('products');

    const { queryByTestId } = render(
      <Table actions={null}>
        <Table.Column source="name" label="Product Name" />
      </Table>,
    );

    // TableHeader.test.tsx already verifies that it doesn't render children if actions={null}
    // Here we check that header-actions div is not rendered (because of our mock)
    expect(queryByTestId('header-actions')).toBeNull();
  });

  it('should pass selectionType to CloudscapeTable', () => {
    render(
      <Table selectionType="multi">
        <Table.Column source="name" label="Product Name" />
      </Table>,
    );

    const tableProps = (CloudscapeTable as any).mock.calls[0][0];
    expect(tableProps.selectionType).toBe('multi');
  });

  it('should hide header when header={null}', () => {
    const { queryByTestId } = render(
      <Table header={null}>
        <Table.Column source="name" label="Product Name" />
      </Table>,
    );

    expect(queryByTestId('table-header')).toBeNull();
  });
});
