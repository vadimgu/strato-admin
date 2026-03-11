import React, { type ReactNode } from 'react';
import { ReferenceInputBase, type ReferenceInputBaseProps } from 'ra-core';
// import { AutocompleteInput } from './AutocompleteInput';

// const defaultChildren = <AutocompleteInput />;
export const ReferenceInput = (props: ReferenceInputBaseProps) => {
    const { children, source, reference, ...rest } = props;

    return (
        <ReferenceInputBase source={source} reference={reference} {...rest}>
            {React.isValidElement(children)
                ? React.cloneElement(children as React.ReactElement<any>, {
                      source,
                  })
                : children}
        </ReferenceInputBase>
    );
};

export default ReferenceInput;
