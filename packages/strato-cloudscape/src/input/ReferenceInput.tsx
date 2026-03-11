import React from 'react';
import { ReferenceInputBase, type ReferenceInputBaseProps, useInput } from 'ra-core';
import { useFormFieldContext } from './FormFieldContext';

export const ReferenceInput = (props: ReferenceInputBaseProps) => {
    const { children, source: sourceProp, reference, ...rest } = props;
    const context = useFormFieldContext();
    
    // If we have a context, we use the source from it.
    const source = sourceProp || context?.source;

    if (!source) {
        throw new Error('ReferenceInput requires a source prop or a parent FormField Master');
    }

    const inner = (
        <ReferenceInputBase source={source} reference={reference} {...rest}>
            {React.isValidElement(children)
                ? React.cloneElement(children as React.ReactElement<any>, {
                      source,
                  })
                : children}
        </ReferenceInputBase>
    );

    // ReferenceInput is unique because it's a wrapper.
    // It doesn't use FormFieldContext for its state directly (ReferenceInputBase does),
    // but it needs to ensure its children can consume the state it provides via ReferenceInputBase.
    return inner;
};

export default ReferenceInput;
