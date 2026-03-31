import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useInput, useResourceContext } from '@strato-admin/ra-core';
import { SliderInput } from './SliderInput';

vi.mock('@strato-admin/ra-core', () => ({
  useInput: vi.fn(),
  useResourceContext: vi.fn(),
  useTranslate: () => (key: string) => key,
  ValidationError: ({ error }: any) => <span>{error}</span>,
}));

// Mock FieldTitle
vi.mock('./FieldTitle', () => ({
  FieldTitle: ({ label, source }: any) => <span data-testid="field-title">{label || source}</span>,
}));

// Mock Cloudscape components
vi.mock('@cloudscape-design/components/slider', () => ({
  default: ({ value, onChange, id, min, max, step }: any) => (
    <input
      type="range"
      data-testid="cloudscape-slider"
      id={id}
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange({ detail: { value: Number(e.target.value) } })}
    />
  ),
}));

vi.mock('@cloudscape-design/components/form-field', () => ({
  default: ({ children, label, errorText, id }: any) => (
    <div data-testid="form-field" id={id}>
      <label>{label}</label>
      {children}
      {errorText && <span data-testid="error-text">{errorText}</span>}
    </div>
  ),
}));

describe('SliderInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render correctly', () => {
    (useInput as any).mockReturnValue({
      id: 'test-slider',
      field: { value: 50, onChange: vi.fn(), onBlur: vi.fn() },
      fieldState: { isTouched: false, invalid: false, error: null },
      formState: { isSubmitted: false },
      isRequired: false,
    });
    (useResourceContext as any).mockReturnValue('products');

    const { getByTestId, getByText } = render(<SliderInput source="rating" label="Rating" min={0} max={100} />);

    expect(getByTestId('cloudscape-slider')).toBeDefined();
    expect((getByTestId('cloudscape-slider') as HTMLInputElement).value).toBe('50');
    expect(getByText('Rating')).toBeDefined();
  });

  it('should use min value if field value is null', () => {
    (useInput as any).mockReturnValue({
      id: 'test-slider',
      field: { value: null, onChange: vi.fn(), onBlur: vi.fn() },
      fieldState: { isTouched: false, invalid: false, error: null },
      formState: { isSubmitted: false },
      isRequired: false,
    });

    const { getByTestId } = render(<SliderInput source="rating" min={10} />);

    expect((getByTestId('cloudscape-slider') as HTMLInputElement).value).toBe('10');
  });

  it('should call onChange with numeric value', () => {
    const onChange = vi.fn();
    (useInput as any).mockReturnValue({
      id: 'test-slider',
      field: { value: 50, onChange, onBlur: vi.fn() },
      fieldState: { isTouched: false, invalid: false, error: null },
      formState: { isSubmitted: false },
      isRequired: false,
    });

    const { getByTestId } = render(<SliderInput source="rating" />);
    const slider = getByTestId('cloudscape-slider');

    fireEvent.change(slider, { target: { value: '75' } });

    expect(onChange).toHaveBeenCalledWith(75);
  });
});
