import React, { useMemo, useContext } from 'react';
import { ArrayInputContext, RecordContextProvider, useResourceContext } from 'ra-core';
import AttributeEditor from '@cloudscape-design/components/attribute-editor';
import Box from '@cloudscape-design/components/box';
import { FieldTitle } from './FieldTitle';
import TextInput from './TextInput';
import FormField from './FormField';
import { FormFieldContext } from './FormFieldContext';

export interface SimpleFormIteratorItemProps {
    source: string;
    label?: string | false;
    field?: React.ComponentType<any>;
    children?: React.ReactNode;
    [key: string]: any;
}

export const Item = (props: SimpleFormIteratorItemProps) => {
    // This is a placeholder component used to collect props.
    // The actual rendering is handled by the SimpleFormIterator.
    return null;
};

export interface SimpleFormIteratorProps {
    children: React.ReactNode;
    addButtonText?: string;
    removeButtonText?: string;
    empty?: React.ReactNode;
    disableAddButton?: boolean;
    hideAddButton?: boolean;
}

export const SimpleFormIterator = (props: SimpleFormIteratorProps) => {
    const {
        children,
        addButtonText = 'Add item',
        removeButtonText = 'Remove item',
        empty,
        disableAddButton,
        hideAddButton,
    } = props;
    const context = useContext(ArrayInputContext) as any;

    if (!context) {
        throw new Error('SimpleFormIterator must be used inside an ArrayInput');
    }

    const { source: parentSource, fields, append, remove } = context;
    const resource = useResourceContext();

    const handleAdd = () => {
        append({});
    };

    const handleRemove = (index: number) => {
        remove(index);
    };

    const definition = useMemo(() => {
        return React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null;

            const childProps = child.props as any;
            const source = childProps.source;
            const label = childProps.label;
            const validate = childProps.validate;

            // Determine if the field is required by checking validators
            const isRequired = Array.isArray(validate)
                ? validate.some((v: any) => v.isRequired)
                : validate?.isRequired || childProps.isRequired;

            return {
                label: (
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                ),
                control: (item: any, index: number) => {
                    const prefixedSource = `${parentSource}.${index}.${source}`;
                    
                    let content;
                    if (child.type === Item) {
                        const { field: FieldComponent, children: itemChildren, ...itemProps } = childProps;
                        content = itemChildren ? (
                            <FormField {...itemProps} source={prefixedSource} label={false}>
                                {itemChildren}
                            </FormField>
                        ) : FieldComponent ? (
                            <FieldComponent {...itemProps} source={prefixedSource} label={false} />
                        ) : (
                            <TextInput {...itemProps} source={prefixedSource} label={false} />
                        );
                    } else {
                        // Standard child (e.g. TextInput)
                        content = React.cloneElement(child as React.ReactElement<any>, {
                            source: prefixedSource,
                            label: false,
                        } as any);
                    }

                    return (
                        <RecordContextProvider value={item}>
                            <Box padding={{ top: 's' }}>
                                {content}
                            </Box>
                        </RecordContextProvider>
                    );
                },
            };
        })?.filter(Boolean) as any[];
    }, [children, parentSource, resource]);

    return (
        <FormFieldContext.Provider value={undefined}>
            <AttributeEditor
                items={fields}
                definition={definition}
                onAddButtonClick={handleAdd}
                onRemoveButtonClick={({ detail: { itemIndex } }) => handleRemove(itemIndex)}
                empty={empty || <Box textAlign="center" color="inherit">No items added yet.</Box>}
                addButtonText={addButtonText}
                removeButtonText={removeButtonText}
                disableAddButton={disableAddButton}
                hideAddButton={hideAddButton}
            />
        </FormFieldContext.Provider>
    );
};

SimpleFormIterator.Item = Item;

export default SimpleFormIterator;
