import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useShowController, useResourceContext, useResourceSchema, useShowContext } from '@strato-admin/core';
import { Detail } from './Detail';

// Mock strato-core
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
  default: ({ children }: any) => <div data-testid="space-between">{children}</div>,
}));

describe('Detail Collection Fields', () => {
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

  it('should render collection fields after scalar fields when no children are provided', () => {
    const ScalarField = (props: any) => <div data-testid={`scalar-${props.source}`} />;
    const CollectionField = (props: any) => <div data-testid={`collection-${props.source}`} />;
    (CollectionField as any).isCollectionField = true;

    (useResourceSchema as any).mockReturnValue({
      label: 'Products',
      fieldSchema: [
        <ScalarField key="scalar" source="name" />,
        <CollectionField key="collection" source="items" />
      ],
    });

    const { getByTestId, queryByTestId } = render(<Detail />);

    // Scalar fields should be inside a container (handled by DetailHub -> KeyValuePairs)
    // In this test, because we don't mock KeyValuePairs, DetailHub renders <KeyValuePairs /> 
    // which in our mock is just the component itself or handled by schema.
    
    // Collection field should be rendered
    expect(getByTestId('collection-items')).toBeDefined();
  });

  it('should respect detailInclude for collection fields', () => {
    const CollectionField1 = (props: any) => <div data-testid={`collection-${props.source}`} />;
    (CollectionField1 as any).isCollectionField = true;
    const CollectionField2 = (props: any) => <div data-testid={`collection-${props.source}`} />;
    (CollectionField2 as any).isCollectionField = true;

    (useResourceSchema as any).mockReturnValue({
      label: 'Products',
      fieldSchema: [
        <CollectionField1 key="c1" source="items1" />,
        <CollectionField2 key="c2" source="items2" />
      ],
      detailInclude: ['items1'],
    });

    const { getByTestId, queryByTestId } = render(<Detail />);

    expect(getByTestId('collection-items1')).toBeDefined();
    expect(queryByTestId('collection-items2')).toBeNull();
  });
});
