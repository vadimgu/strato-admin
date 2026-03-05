import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useResourceContext } from 'ra-core';
import { useCollection } from '../collection-hooks';
import DataTable from './Table';
import CloudscapeTable from '@cloudscape-design/components/table';

// Mock ra-core
vi.mock('ra-core', () => ({
  useResourceContext: vi.fn(),
  useTranslate: vi.fn(() => (key: string, options: any) => options?._ || key),
  RecordContextProvider: ({ children }: any) => <>{children}</>,
  useRecordContext: vi.fn(),
  useFieldValue: vi.fn(({ source, record }) => record?.[source]),
  useCreatePath: vi.fn(() => (params: any) => `/${params.resource}/${params.id}/${params.type}`),
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
  default: vi.fn(() => <div data-testid="cloudscape-table" />),
}));

vi.mock('@cloudscape-design/components/pagination', () => ({
  default: () => <div data-testid="pagination" />,
}));

vi.mock('@cloudscape-design/components/header', () => ({
  default: ({ children }: any) => <header>{children}</header>,
}));

vi.mock('@cloudscape-design/components/box', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

describe('DataTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCollection as any).mockReturnValue({
      items: [],
      paginationProps: {},
    });
  });

  it('should generate column IDs with resource prefix', () => {
    (useResourceContext as any).mockReturnValue('products');

    render(
      <DataTable>
        <DataTable.Col source="name" label="Product Name" />
        <DataTable.Col source="price" label="Price" />
      </DataTable>
    );

    const tableProps = (CloudscapeTable as any).mock.calls[0][0];
    expect(tableProps.columnDefinitions[0].id).toBe('products___name');
    expect(tableProps.columnDefinitions[1].id).toBe('products___price');
  });

  it('should include sortingField in column definitions', () => {
    (useResourceContext as any).mockReturnValue('products');

    render(
      <DataTable>
        <DataTable.Col source="name" label="Product Name" />
      </DataTable>
    );

    const tableProps = (CloudscapeTable as any).mock.calls[0][0];
    expect(tableProps.columnDefinitions[0].sortingField).toBe('name');
  });

  it('should generate column IDs with index if source is missing', () => {
    (useResourceContext as any).mockReturnValue('categories');

    render(
      <DataTable>
        <DataTable.Col label="No Source" />
      </DataTable>
    );

    const tableProps = (CloudscapeTable as any).mock.calls[0][0];
    expect(tableProps.columnDefinitions[0].id).toBe('categories___col-0');
  });

  it('should generate column IDs without resource if resource is not available', () => {
    (useResourceContext as any).mockReturnValue(undefined);

    render(
      <DataTable>
        <DataTable.Col source="name" />
      </DataTable>
    );

    const tableProps = (CloudscapeTable as any).mock.calls[0][0];
    expect(tableProps.columnDefinitions[0].id).toBe('name');
  });
});
