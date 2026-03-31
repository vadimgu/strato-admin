import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useTranslate, useTranslateLabel } from '@strato-admin/ra-core';
import { useResourceSchema } from '@strato-admin/core';
import { useCollection } from '../collection-hooks';
import Cards from './Cards';
import CloudscapeCards from '@cloudscape-design/components/cards';
import KeyValuePairs from '../detail/KeyValuePairs';

vi.mock('@strato-admin/ra-core', () => import('../__mocks__/ra-core'));
vi.mock('@strato-admin/core', () => import('../__mocks__/strato-core'));

// Mock useCollection
vi.mock('../collection-hooks', () => ({
  useCollection: vi.fn(),
}));

// Mock Cloudscape components
vi.mock('@cloudscape-design/components/cards', () => ({
  default: vi.fn(({ items, cardDefinition, header, selectionType, filter, preferences }: any) => (
    <div data-testid="cloudscape-cards" data-selection-type={selectionType}>
      {header && <div data-testid="cards-header">{header}</div>}
      {filter && <div data-testid="cards-filter">{filter}</div>}
      {preferences && <div data-testid="cards-preferences">{preferences}</div>}
      {items.map((item: any, index: number) => (
        <div key={index} data-testid="card">
          {cardDefinition.sections.map((section: any) => (
            <div key={section.id} data-testid={`section-${section.id}`}>
              {section.content(item)}
            </div>
          ))}
        </div>
      ))}
    </div>
  )),
}));

vi.mock('@cloudscape-design/components/pagination', () => ({
  default: () => <div data-testid="pagination" />,
}));

vi.mock('@cloudscape-design/components/text-filter', () => ({
  default: vi.fn(({ filteringPlaceholder }: any) => (
    <div data-testid="text-filter">{filteringPlaceholder}</div>
  )),
}));

vi.mock('@cloudscape-design/components/collection-preferences', () => ({
  default: vi.fn(() => <div data-testid="collection-preferences" />),
}));

vi.mock('../detail/KeyValuePairs', () => ({
  default: vi.fn(({ children }: any) => <div data-testid="key-value-pairs">{children}</div>),
}));

vi.mock('./TableHeader', () => ({
  default: vi.fn(({ title, description, actions }: any) => (
    <div data-testid="mock-table-header">
      <div data-testid="header-title">{title}</div>
      <div data-testid="header-description">{description}</div>
      <div data-testid="header-actions">{actions}</div>
    </div>
  )),
}));

describe('Cards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCollection as any).mockReturnValue({
      items: [{ id: 1, name: 'Product 1', price: 100, description: 'Desc 1' }],
      paginationProps: {},
      collectionProps: {},
      filterProps: { filteringPlaceholder: 'Search...' },
      preferencesProps: {
        preferences: {},
        onConfirm: vi.fn(),
      },
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('should honor listInclude from resource schema', () => {
    (useResourceSchema as any).mockReturnValue({
      fieldSchema: [
        <div key="name" source="name" data-testid="field-name" />,
        <div key="price" source="price" data-testid="field-price" />,
        <div key="description" source="description" data-testid="field-description" />,
      ],
      listInclude: ['name', 'price'],
    });

    render(<Cards />);

    // Check that KeyValuePairs received only name and price fields
    const keyValuePairsProps = (KeyValuePairs as any).mock.calls[0][0];
    const children = React.Children.toArray(keyValuePairsProps.children);
    
    expect(children).toHaveLength(2);
    expect((children[0] as any).props.source).toBe('name');
    expect((children[1] as any).props.source).toBe('price');
  });

  it('should honor listExclude from resource schema', () => {
    (useResourceSchema as any).mockReturnValue({
      fieldSchema: [
        <div key="name" source="name" data-testid="field-name" />,
        <div key="price" source="price" data-testid="field-price" />,
        <div key="description" source="description" data-testid="field-description" />,
      ],
      listExclude: ['description'],
    });

    render(<Cards />);

    const keyValuePairsProps = (KeyValuePairs as any).mock.calls[0][0];
    const children = React.Children.toArray(keyValuePairsProps.children);
    
    expect(children).toHaveLength(2);
    expect((children[0] as any).props.source).toBe('name');
    expect((children[1] as any).props.source).toBe('price');
  });

  it('should honor include prop over listInclude from schema', () => {
    (useResourceSchema as any).mockReturnValue({
      fieldSchema: [
        <div key="name" source="name" data-testid="field-name" />,
        <div key="price" source="price" data-testid="field-price" />,
        <div key="description" source="description" data-testid="field-description" />,
      ],
      listInclude: ['name'],
    });

    render(<Cards include={['price', 'description']} />);

    const keyValuePairsProps = (KeyValuePairs as any).mock.calls[0][0];
    const children = React.Children.toArray(keyValuePairsProps.children);
    
    expect(children).toHaveLength(2);
    expect((children[0] as any).props.source).toBe('price');
    expect((children[1] as any).props.source).toBe('description');
  });

  it('should support declarative children', () => {
    (useResourceSchema as any).mockReturnValue({
      fieldSchema: [
        <div key="name" source="name" data-testid="field-name" />,
      ],
    });

    render(
      <Cards>
        <div source="custom" data-testid="field-custom" />
      </Cards>
    );

    const keyValuePairsProps = (KeyValuePairs as any).mock.calls[0][0];
    const children = React.Children.toArray(keyValuePairsProps.children);
    
    expect(children).toHaveLength(1);
    expect((children[0] as any).props.source).toBe('custom');
  });

  it('should render TableHeader with correct title and description', () => {
    (useResourceSchema as any).mockReturnValue({
      fieldSchema: [],
      label: 'Products',
    });

    const { getByTestId } = render(<Cards title="Custom Title" description="Custom Description" />);

    expect(getByTestId('header-title').textContent).toBe('Custom Title');
    expect(getByTestId('header-description').textContent).toBe('Custom Description');
  });

  it('should use schema label as default title', () => {
    (useResourceSchema as any).mockReturnValue({
      fieldSchema: [],
      label: 'Schema Products',
    });

    const { getByTestId } = render(<Cards />);

    expect(getByTestId('header-title').textContent).toBe('Schema Products');
  });

  it('should pass selectionType to CloudscapeCards', () => {
    (useResourceSchema as any).mockReturnValue({
      fieldSchema: [],
    });

    const { getByTestId } = render(<Cards selectionType="multi" />);

    expect(getByTestId('cloudscape-cards').getAttribute('data-selection-type')).toBe('multi');
  });

  it('should default selectionType to multi if canDelete is true', () => {
    (useResourceSchema as any).mockReturnValue({
      fieldSchema: [],
      definition: {
        options: { canDelete: true }
      }
    });

    const { getByTestId } = render(<Cards />);

    expect(getByTestId('cloudscape-cards').getAttribute('data-selection-type')).toBe('multi');
  });

  it('should render TextFilter by default', () => {
    (useResourceSchema as any).mockReturnValue({
      fieldSchema: [],
    });

    const { getByTestId } = render(<Cards />);

    expect(getByTestId('text-filter')).toBeDefined();
  });

  it('should not render TextFilter if filtering is false', () => {
    (useResourceSchema as any).mockReturnValue({
      fieldSchema: [],
    });

    const { queryByTestId } = render(<Cards filtering={false} />);

    expect(queryByTestId('text-filter')).toBeNull();
  });

  it('should pass filteringPlaceholder to TextFilter', () => {
    (useResourceSchema as any).mockReturnValue({
      fieldSchema: [],
    });

    const { getByTestId } = render(<Cards filteringPlaceholder="Custom Search" />);

    expect(getByTestId('text-filter').textContent).toBe('Custom Search');
  });

  it('should render CollectionPreferences by default', () => {
    (useResourceSchema as any).mockReturnValue({
      fieldSchema: [],
    });

    const { getByTestId } = render(<Cards />);

    expect(getByTestId('collection-preferences')).toBeDefined();
  });

  it('should pass pageSizeOptions to useCollection', () => {
    (useResourceSchema as any).mockReturnValue({
      fieldSchema: [],
    });

    const pageSizeOptions = [{ value: 5, label: '5 items' }];
    render(<Cards pageSizeOptions={pageSizeOptions} />);

    expect(useCollection).toHaveBeenCalledWith(expect.objectContaining({
      preferences: expect.objectContaining({
        pageSizeOptions
      } as any)
    }));
  });

  it('should filter children based on visibleContent preference', () => {
    (useResourceSchema as any).mockReturnValue({
      fieldSchema: [
        <div key="name" source="name" data-testid="field-name" />,
        <div key="price" source="price" data-testid="field-price" />,
      ],
    });

    (useCollection as any).mockReturnValue({
      items: [{ id: 1, name: 'Product 1', price: 100 }],
      paginationProps: {},
      collectionProps: {},
      filterProps: {},
      preferencesProps: {
        preferences: {
          visibleContent: ['name'],
        },
      },
    });

    render(<Cards />);

    const keyValuePairsProps = (KeyValuePairs as any).mock.calls[0][0];
    const children = React.Children.toArray(keyValuePairsProps.children);
    
    expect(children).toHaveLength(1);
    expect((children[0] as any).props.source).toBe('name');
  });

  it('should not filter children if visibleContent preference is not set', () => {
    (useResourceSchema as any).mockReturnValue({
      fieldSchema: [
        <div key="name" source="name" data-testid="field-name" />,
        <div key="price" source="price" data-testid="field-price" />,
      ],
    });

    (useCollection as any).mockReturnValue({
      items: [{ id: 1, name: 'Product 1', price: 100 }],
      paginationProps: {},
      collectionProps: {},
      filterProps: {},
      preferencesProps: {
        preferences: {},
      },
    });

    render(<Cards />);

    const keyValuePairsProps = (KeyValuePairs as any).mock.calls[0][0];
    const children = React.Children.toArray(keyValuePairsProps.children);
    
    expect(children).toHaveLength(2);
  });
});
