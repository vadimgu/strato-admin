import React from 'react';
import { ReferenceInputBase, type ReferenceInputBaseProps, useInput } from '@strato-admin/core';
import { FormField } from './FormField';
import { FormFieldContext, useFormFieldContext } from './FormFieldContext';
import { AutocompleteInput } from './AutocompleteInput';

export const ReferenceInput = (props: ReferenceInputBaseProps) => {
  const { children, source: sourceProp, reference, isRequired, validate, defaultValue, label, ...rest } = props;
  const context = useFormFieldContext();

  // If we have a context, we use the source from it.
  const source = sourceProp || context?.source;

  if (!source) {
    throw new Error('ReferenceInput requires a source prop or a parent FormField Master');
  }

  const inputState =
    context ??
    useInput({
      source,
      defaultValue,
      validate,
      isRequired,
      ...rest,
    });

  const finalChildren = children || <AutocompleteInput source={source} />;

  const inner = (
    <ReferenceInputBase source={source} reference={reference} isRequired={isRequired} {...rest}>
      <FormFieldContext.Provider value={inputState}>
        {React.isValidElement(finalChildren)
          ? React.cloneElement(finalChildren as React.ReactElement<any>, {
              source,
              isRequired,
            })
          : (finalChildren as any)}
      </FormFieldContext.Provider>
    </ReferenceInputBase>
  );

  if (context) {
    return inner;
  }

  return (
    <FormFieldContext.Provider value={inputState}>
      <FormField {...props}>{inner}</FormField>
    </FormFieldContext.Provider>
  );
};

export default ReferenceInput;
