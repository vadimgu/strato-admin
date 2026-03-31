import { render } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { ReferenceInput } from './ReferenceInput';

// Mock ra-core
vi.mock('@strato-admin/ra-core', () => ({
  ReferenceInputBase: ({ children }: any) => <div data-testid="reference-input-base">{children}</div>,
  useInput: vi.fn(() => ({
    id: 'test',
    field: { value: '', onChange: vi.fn(), onBlur: vi.fn() },
    fieldState: { isTouched: false, invalid: false, error: null },
    formState: { isSubmitted: false },
    isRequired: false,
  })),
  useResourceContext: vi.fn(() => 'products'),
  useTranslate: vi.fn(() => (key: string) => key),
  useResourceDefinitions: vi.fn(() => ({})),
  ValidationError: ({ error }: any) => <span>{error}</span>,
}));

describe('ReferenceInput', () => {
  it('should propagate source prop to children', () => {
    const Child = ({ source }: any) => <div data-testid="child">{source}</div>;

    const { getByTestId } = render(
      <ReferenceInput reference="products" source="productId">
        <Child />
      </ReferenceInput>,
    );

    expect(getByTestId('child').textContent).toBe('productId');
  });

  it('should overwrite child source prop with its own source prop', () => {
    const Child = ({ source }: any) => <div data-testid="child">{source}</div>;

    const { getByTestId } = render(
      <ReferenceInput reference="products" source="prefixed.productId">
        <Child source="productId" />
      </ReferenceInput>,
    );

    expect(getByTestId('child').textContent).toBe('prefixed.productId');
  });
});
