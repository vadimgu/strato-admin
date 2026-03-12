import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AttributeEditor } from './AttributeEditor';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { useInput, useResourceContext } from 'ra-core';
import { useFormFieldContext } from './FormFieldContext';

// Mock Cloudscape components
vi.mock('@cloudscape-design/components/attribute-editor', () => ({
    default: ({ items, definition, onAddButtonClick, disableAddButton, hideAddButton }: any) => (
        <div data-testid="attribute-editor">
            {!hideAddButton && (
                <button 
                    onClick={onAddButtonClick} 
                    disabled={disableAddButton}
                    data-testid="add-button"
                >
                    Add item
                </button>
            )}
            {items.map((item: any, index: number) => (
                <div key={index} data-testid={`item-${index}`}>
                    {definition.map((def: any, defIndex: number) => (
                        <div key={defIndex} data-testid={`field-${defIndex}`}>
                            {def.control(item, index)}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    ),
}));

vi.mock('@cloudscape-design/components/box', () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));

// Mock ra-core hooks
vi.mock('ra-core', () => ({
    useInput: vi.fn(),
    useResourceContext: vi.fn(),
    RecordContextProvider: ({ children }: any) => <>{children}</>,
    ArrayInputContext: {
        Provider: ({ children }: any) => <>{children}</>,
    },
}));

// Mock react-hook-form hooks
vi.mock('react-hook-form', () => ({
    useFormContext: vi.fn(),
    useFieldArray: vi.fn(),
}));

// Mock local components and contexts
vi.mock('./FormFieldContext', () => ({
    useFormFieldContext: vi.fn(),
    FormFieldContext: {
        Provider: ({ children }: any) => <>{children}</>,
    },
}));

vi.mock('./FieldTitle', () => ({
    FieldTitle: () => <div data-testid="field-title" />,
}));

vi.mock('./TextInput', () => ({
    default: ({ source }: any) => <div data-testid="text-input" data-source={source} />,
}));

vi.mock('./FormField', () => ({
    default: ({ children }: any) => <div data-testid="form-field">{children}</div>,
}));

describe('AttributeEditor', () => {
    const defaultFormContext = { control: {} };
    const defaultFieldArray = {
        fields: [{}],
        append: vi.fn(),
        remove: vi.fn(),
    };
    const defaultInput = {
        id: 'test',
        field: { name: 'test', value: [], onChange: vi.fn(), onBlur: vi.fn() },
        fieldState: { error: undefined, isTouched: false, isDirty: false },
        formState: { isSubmitted: false },
        isRequired: false,
    };

    beforeEach(() => {
        vi.mocked(useFormContext).mockReturnValue(defaultFormContext as any);
        vi.mocked(useFieldArray).mockReturnValue(defaultFieldArray as any);
        vi.mocked(useInput).mockReturnValue(defaultInput as any);
        vi.mocked(useFormFieldContext).mockReturnValue(undefined);
        vi.mocked(useResourceContext).mockReturnValue('test-resource');
    });

    it('should prefix source prop of immediate children', () => {
        const Child = ({ source }: any) => <div data-testid="child">{source}</div>;
        
        const { getByTestId } = render(
            <AttributeEditor source="products">
                <Child source="id" />
            </AttributeEditor>
        );

        expect(getByTestId('child').textContent).toBe('products.0.id');
    });

    it('should NOT add source prop to children that do not have one', () => {
        const NonInput = ({ children }: any) => <div data-testid="non-input">{children}</div>;
        
        const { getByTestId } = render(
            <AttributeEditor source="products">
                <NonInput />
            </AttributeEditor>
        );

        expect(getByTestId('non-input').getAttribute('source')).toBeNull();
    });

    it('should disable the add button when disableAddButton is true', () => {
        vi.mocked(useFieldArray).mockReturnValue({
            ...defaultFieldArray,
            fields: [],
        } as any);

        const { getByTestId } = render(
            <AttributeEditor source="products" disableAddButton>
                <div source="id" />
            </AttributeEditor>
        );

        expect(getByTestId('add-button').hasAttribute('disabled')).toBe(true);
    });

    it('should hide the add button when hideAddButton is true', () => {
        vi.mocked(useFieldArray).mockReturnValue({
            ...defaultFieldArray,
            fields: [],
        } as any);

        const { queryByTestId } = render(
            <AttributeEditor source="products" hideAddButton>
                <div source="id" />
            </AttributeEditor>
        );

        expect(queryByTestId('add-button')).toBeNull();
    });
});
