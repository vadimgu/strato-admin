import React, { useMemo } from 'react';
import { useInput, RecordContextProvider, useResourceContext } from '@strato-admin/ra-core';
import { useFieldArray, useFormContext } from 'react-hook-form';
import CloudscapeAttributeEditor, {
  AttributeEditorProps as CloudscapeAttributeEditorProps,
} from '@cloudscape-design/components/attribute-editor';
import Box from '@cloudscape-design/components/box';
import { FieldTitle } from './FieldTitle';
import TextInput from './TextInput';
import FormField from './FormField';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';
import { InputProps } from './types';

export interface ArrayInputItemProps {
  source: string;
  label?: string | false;
  field?: React.ComponentType<any>;
  validate?: any;
  defaultValue?: any;
  children?: React.ReactNode;
}

export const Item = (_props: ArrayInputItemProps) => {
  // This is a placeholder component used to collect props.
  // The actual rendering is handled by the ArrayInput.
  return null;
};

export interface ArrayInputProps extends Omit<InputProps, 'source'> {
  source?: string;
  children?: React.ReactNode;
  addButtonText?: string;
  removeButtonText?: string;
  empty?: React.ReactNode;
  disableAddButton?: boolean;
  hideAddButton?: boolean;
  /**
   * Optionally specifies the layout of the attributes.
   */
  gridLayout?: ReadonlyArray<CloudscapeAttributeEditorProps.GridLayout>;
}

/**
 * ArrayInput component that uses Cloudscape's AttributeEditor to edit arrays of objects.
 */
export const ArrayInput = (props: ArrayInputProps) => {
  const {
    children,
    label,
    source: sourceProp,
    validate,
    defaultValue,
    addButtonText = 'Add item',
    removeButtonText = 'Remove item',
    empty,
    disableAddButton,
    hideAddButton,
    gridLayout,
    ...rest
  } = props;

  const { control } = useFormContext();
  const contextValue = useFormFieldContext();
  const resource = useResourceContext();

  // Attempt to get source from context if not provided
  const source = sourceProp || contextValue?.source || '';

  const inputState =
    contextValue ??
    useInput({
      source,
      validate,
      defaultValue,
      ...rest,
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: source,
  });

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
      const childSource = childProps.source;
      const childLabel = childProps.label;
      const childValidate = childProps.validate;
      const childDescription = childProps.description;
      const childInfo = childProps.info;

      // Determine if the field is required by checking validators
      const isRequired = Array.isArray(childValidate)
        ? childValidate.some((v: any) => v.isRequired || v.name === 'required')
        : childValidate?.isRequired || childValidate?.name === 'required' || childProps.isRequired;

      return {
        label: (
          <FieldTitle
            label={childLabel}
            source={childSource}
            resource={childProps.resource || resource}
            isRequired={isRequired}
          />
        ),
        description: childDescription,
        info: childInfo,
        control: (item: any, index: number) => {
          const prefixedSource = `${source}.${index}.${childSource}`;

          let content;
          if (child.type === Item) {
            const {
              field: FieldComponent,
              children: itemChildren,
              validate: itemValidate,
              defaultValue: itemDefaultValue,
            } = childProps;
            content = itemChildren ? (
              <FormField source={prefixedSource} label={false} validate={itemValidate} defaultValue={itemDefaultValue}>
                {itemChildren}
              </FormField>
            ) : FieldComponent ? (
              <FieldComponent
                source={prefixedSource}
                label={false}
                validate={itemValidate}
                defaultValue={itemDefaultValue}
              />
            ) : (
              <TextInput
                source={prefixedSource}
                label={false}
                validate={itemValidate}
                defaultValue={itemDefaultValue}
              />
            );
          } else {
            // Standard child (e.g. TextInput)
            content = React.cloneElement(
              child as React.ReactElement<any>,
              {
                source: prefixedSource,
                label: false,
              } as any,
            );
          }

          return <RecordContextProvider value={item}>{content}</RecordContextProvider>;
        },
      };
    })?.filter(Boolean) as any[];
  }, [children, source, resource]);

  const inner = (
    <FormFieldContext.Provider value={undefined}>
      <CloudscapeAttributeEditor
        items={fields}
        definition={definition}
        onAddButtonClick={handleAdd}
        onRemoveButtonClick={({ detail: { itemIndex } }) => handleRemove(itemIndex)}
        empty={
          empty || (
            <Box textAlign="center" color="inherit">
              No items added yet.
            </Box>
          )
        }
        addButtonText={addButtonText}
        removeButtonText={removeButtonText}
        disableAddButton={disableAddButton}
        hideAddButton={hideAddButton}
        gridLayout={gridLayout}
      />
    </FormFieldContext.Provider>
  );

  if (contextValue) {
    return inner;
  }

  return (
    <FormFieldContext.Provider value={{ ...inputState, source }}>
      <FormField {...props} source={source}>
        {inner}
      </FormField>
    </FormFieldContext.Provider>
  );
};

ArrayInput.Item = Item;

export default ArrayInput;
