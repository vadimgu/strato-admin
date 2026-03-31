import { createContext, useContext } from 'react';
import { UseInputValue } from '@strato-admin/ra-core';

export interface FormFieldContextValue extends UseInputValue {
  source?: string;
}

export const FormFieldContext = createContext<FormFieldContextValue | undefined>(undefined);
export const useFormFieldContext = () => useContext(FormFieldContext);
