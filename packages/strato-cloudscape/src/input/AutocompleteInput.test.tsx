import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useInput, useResourceContext, useChoicesContext } from 'ra-core';
import { AutocompleteInput } from './AutocompleteInput';

// Mock ra-core
vi.mock('ra-core', () => ({
  useInput: vi.fn(),
  useResourceContext: vi.fn(),
  useChoicesContext: vi.fn().mockReturnValue({ allChoices: [], isPending: false }),
  useTranslate: () => (key: string) => key,
  useGetRecordRepresentation: () => (record: any) => record?.name || record?.id || record,
  ValidationError: ({ error }: any) => <span>{error}</span>,
}));

// Mock FieldTitle
vi.mock('./FieldTitle', () => ({
  FieldTitle: ({ label, source }: any) => <span data-testid="field-title">{label || source}</span>,
}));

// Mock Cloudscape components
vi.mock('@cloudscape-design/components/autosuggest', () => ({
  default: ({ value, onChange, id, options, onBlur, onSelect }: any) => (
    <div data-testid="cloudscape-autosuggest">
      <input
        id={id}
        value={value}
        onChange={(e) => onChange({ detail: { value: e.target.value } })}
        onBlur={() => onBlur()}
      />
      <ul>
        {options.map((opt: any) => (
          <li 
            key={opt.value} 
            onClick={() => onSelect({ detail: { value: opt.value } })}
            data-testid={`option-${opt.value}`}
          >
            {opt.label}
          </li>
        ))}
      </ul>
    </div>
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

describe('AutocompleteInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useChoicesContext as any).mockReturnValue({ allChoices: [], isPending: false });
  });

  const choices = [
    { id: '1', name: 'Option 1' },
    { id: '2', name: 'Option 2' },
  ];

  it('should render correctly and resolve ID to label', () => {
    (useInput as any).mockReturnValue({
      id: 'test-autocomplete',
      field: { value: '1', onChange: vi.fn(), onBlur: vi.fn() },
      fieldState: { isTouched: false, invalid: false, error: null },
      formState: { isSubmitted: false },
      isRequired: false,
    });
    (useChoicesContext as any).mockReturnValue({ allChoices: choices, isPending: false });
    (useResourceContext as any).mockReturnValue('products');

    const { getByTestId, getByText } = render(
      <AutocompleteInput source="category" label="Category" choices={choices} />
    );

    expect(getByTestId('cloudscape-autosuggest')).toBeDefined();
    const input = getByTestId('cloudscape-autosuggest').querySelector('input');
    expect(input?.value).toBe('Option 1');
    expect(getByText('Category')).toBeDefined();
    expect(getByText('Option 1')).toBeDefined();
    expect(getByText('Option 2')).toBeDefined();
  });

  it('should not display the ID while loading choices', () => {
    (useChoicesContext as any).mockReturnValue({ allChoices: [], isPending: true });

    (useInput as any).mockReturnValue({
      id: 'test-autocomplete',
      field: { value: '1', onChange: vi.fn(), onBlur: vi.fn() },
      fieldState: { isTouched: false, invalid: false, error: null },
      formState: { isSubmitted: false },
      isRequired: false,
    });

    const { getByTestId } = render(
      <AutocompleteInput source="category" />
    );

    const input = getByTestId('cloudscape-autosuggest').querySelector('input');
    expect(input?.value).toBe('');
  });

  it('should show error when touched and invalid', () => {
    (useInput as any).mockReturnValue({
      id: 'test-autocomplete',
      field: { value: '', onChange: vi.fn(), onBlur: vi.fn() },
      fieldState: { isTouched: true, invalid: true, error: { message: 'Required' } },
      formState: { isSubmitted: false },
      isRequired: true,
    });

    const { getByTestId } = render(
      <AutocompleteInput source="category" choices={choices} />
    );

    expect(getByTestId('error-text').textContent).toBe('Required');
  });

  it('should call field.onChange when an option is selected', () => {
    const onChange = vi.fn();
    (useInput as any).mockReturnValue({
      id: 'test-autocomplete',
      field: { value: '', onChange, onBlur: vi.fn() },
      fieldState: { isTouched: false, invalid: false, error: null },
      formState: { isSubmitted: false },
      isRequired: false,
    });
    (useChoicesContext as any).mockReturnValue({ allChoices: choices, isPending: false });

    const { getByTestId } = render(
      <AutocompleteInput source="category" choices={choices} />
    );

    const option = getByTestId('option-1');
    fireEvent.click(option);
    
    expect(onChange).toHaveBeenCalledWith('1');
  });

  it('should call field.onChange with null when input is cleared', () => {
    const onChange = vi.fn();
    (useInput as any).mockReturnValue({
      id: 'test-autocomplete',
      field: { value: '1', onChange, onBlur: vi.fn() },
      fieldState: { isTouched: false, invalid: false, error: null },
      formState: { isSubmitted: false },
      isRequired: false,
    });

    const { getByTestId } = render(
      <AutocompleteInput source="category" choices={choices} />
    );

    const input = getByTestId('cloudscape-autosuggest').querySelector('input');
    if (input) {
      fireEvent.change(input, { target: { value: '' } });
    }
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('should call field.onBlur when input is blurred', () => {
    const onBlur = vi.fn();
    (useInput as any).mockReturnValue({
      id: 'test-autocomplete',
      field: { value: '', onChange: vi.fn(), onBlur },
      fieldState: { isTouched: false, invalid: false, error: null },
      formState: { isSubmitted: false },
      isRequired: false,
    });

    const { getByTestId } = render(
      <AutocompleteInput source="category" choices={choices} />
    );

    const input = getByTestId('cloudscape-autosuggest').querySelector('input');
    if (input) {
      fireEvent.blur(input);
    }
    expect(onBlur).toHaveBeenCalled();
  });
});
