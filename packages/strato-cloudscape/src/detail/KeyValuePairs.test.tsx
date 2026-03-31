import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useResourceContext, useTranslate, useRecordContext } from '@strato-admin/ra-core';
import KeyValuePairs from './KeyValuePairs';
import CloudscapeKeyValuePairs from '@cloudscape-design/components/key-value-pairs';

vi.mock('@strato-admin/ra-core', () => import('../__mocks__/ra-core'));
vi.mock('@strato-admin/core', () => import('../__mocks__/strato-core'));

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

// Mock Cloudscape components
vi.mock('@cloudscape-design/components/key-value-pairs', () => ({
  default: vi.fn(({ items }: any) => (
    <div data-testid="cloudscape-kvp">
      {items.map((item: any, index: number) => (
        <div key={index} data-testid={`kv-item-${index}`}>
          <span data-testid={`kv-label-${index}`}>{item.label}</span>
          <div data-testid={`kv-value-${index}`}>{item.value}</div>
        </div>
      ))}
    </div>
  )),
}));

vi.mock('@cloudscape-design/components/box', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

describe('KeyValuePairs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useResourceContext as any).mockReturnValue('products');
    (useRecordContext as any).mockReturnValue({ id: 1, name: 'Gadget', price: 100 });
  });

  it('should render children and automatically generate labels', () => {
    render(
      <KeyValuePairs>
        <KeyValuePairs.Field source="name" />
        <KeyValuePairs.Field source="price" label="Cost" />
      </KeyValuePairs>,
    );

    const kvpProps = (CloudscapeKeyValuePairs as any).mock.calls[0][0];
    expect(kvpProps.items).toHaveLength(2);
    // We check the source/label props of the FieldTitle component
    expect(kvpProps.items[0].label.props.source).toBe('name');
    expect(kvpProps.items[1].label.props.label).toBe('Cost');
  });

  it('should use translation for labels if available', () => {
    const translate = vi.fn((key) => {
      if (key === 'resources.products.fields.name') return 'Product Name';
      return key;
    });
    (useTranslate as any).mockReturnValue(translate);

    render(
      <KeyValuePairs>
        <KeyValuePairs.Field source="name" />
      </KeyValuePairs>,
    );

    const kvpProps = (CloudscapeKeyValuePairs as any).mock.calls[0][0];
    expect(kvpProps.items[0].label.props.source).toBe('name');
  });

  it('should pass columns and minColumnWidth props to CloudscapeKeyValuePairs', () => {
    render(
      <KeyValuePairs columns={3} minColumnWidth={200}>
        <KeyValuePairs.Field source="name" />
      </KeyValuePairs>,
    );

    const kvpProps = (CloudscapeKeyValuePairs as any).mock.calls[0][0];
    expect(kvpProps.columns).toBe(3);
    expect(kvpProps.minColumnWidth).toBe(200);
  });

  it('should provide record context to children', () => {
    const record = { id: 1, name: 'Gadget' };
    (useRecordContext as any).mockReturnValue(record);

    // TextField should render 'Gadget' because we mocked useFieldValue to return record[source]
    const { getByTestId } = render(
      <KeyValuePairs>
        <KeyValuePairs.Field source="name" />
      </KeyValuePairs>,
    );

    expect(getByTestId('kv-value-0').textContent).toBe('Gadget');
  });
});
