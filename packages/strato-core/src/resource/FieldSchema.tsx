import { createContext, useContext, ReactNode } from 'react';

/**
 * Context for the field schema.
 * Stores an array of React elements (fields) defined in the FieldSchema.
 */
export const FieldSchemaContext = createContext<ReactNode[]>([]);

/**
 * Hook to access the field schema elements.
 */
export const useFieldSchema = () => {
  return useContext(FieldSchemaContext);
};

export interface FieldSchemaProps {
  children: ReactNode;
}

/**
 * A marker component to define the fields of a resource.
 * It doesn't render anything by itself, it's used by StratoResource to capture the schema.
 */
export const FieldSchema = (_props: FieldSchemaProps) => {
  return null;
};
