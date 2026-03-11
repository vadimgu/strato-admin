import { createContext, useContext } from 'react';

export interface FieldContextValue {
  source?: string;
}

export const FieldContext = createContext<FieldContextValue | undefined>(undefined);

export const useFieldContext = () => useContext(FieldContext);
