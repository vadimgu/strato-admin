
import { render } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { ReferenceInput } from './ReferenceInput';

// Mock ra-core
vi.mock('strato-core', () => ({
  ReferenceInputBase: ({ children }: any) => <div data-testid="reference-input-base">{children}</div>,
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
