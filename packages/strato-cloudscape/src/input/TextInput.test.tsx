import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useInput, useResourceContext } from '@strato-admin/ra-core';
import { TextInput } from './TextInput';

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
vi.mock('@cloudscape-design/components/input', () => ({
  default: ({ value, onChange, id }: any) => (
    <input
      data-testid="cloudscape-input"
      id={id}
      value={value}
      onChange={(e) => onChange({ detail: { value: e.target.value } })}
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

describe('TextInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly', () => {
    (useInput as any).mockReturnValue({
      id: 'test-input',
      field: { value: 'test value', onChange: vi.fn(), onBlur: vi.fn() },
      fieldState: { isTouched: false, invalid: false, error: null },
      formState: { isSubmitted: false },
      isRequired: false,
    });
    (useResourceContext as any).mockReturnValue('products');

    const { getByTestId, getByText } = render(<TextInput source="title" label="Product Title" />);

    expect(getByTestId('cloudscape-input')).toBeDefined();
    expect((getByTestId('cloudscape-input') as HTMLInputElement).value).toBe('test value');
    expect(getByText('Product Title')).toBeDefined();
  });

  it('should show error when touched and invalid', () => {
    (useInput as any).mockReturnValue({
      id: 'test-input',
      field: { value: '', onChange: vi.fn(), onBlur: vi.fn() },
      fieldState: { isTouched: true, invalid: true, error: { message: 'Required' } },
      formState: { isSubmitted: false },
      isRequired: true,
    });

    const { getByTestId } = render(<TextInput source="title" />);

    expect(getByTestId('error-text').textContent).toBe('Required');
  });

  it('should show error when submitted and invalid', () => {
    (useInput as any).mockReturnValue({
      id: 'test-input',
      field: { value: '', onChange: vi.fn(), onBlur: vi.fn() },
      fieldState: { isTouched: false, invalid: true, error: { message: 'Required' } },
      formState: { isSubmitted: true },
      isRequired: true,
    });

    const { getByTestId } = render(<TextInput source="title" />);

    expect(getByTestId('error-text').textContent).toBe('Required');
  });
});
