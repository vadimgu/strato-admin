import { createContext, useContext, ReactNode } from 'react';

/**
 * Context for the input schema.
 * Stores an array of React elements (inputs) defined in the InputSchema.
 */
export const InputSchemaContext = createContext<ReactNode[]>([]);

/**
 * Hook to access the input schema elements.
 */
export const useInputSchema = () => {
  return useContext(InputSchemaContext);
};

export interface InputSchemaProps {
  children: ReactNode;
}

/**
 * A marker component to define the form inputs of a resource.
 * It doesn't render anything by itself, it's used by StratoResource to capture the schema.
 */
export const InputSchema = (_props: InputSchemaProps) => {
  return null;
};
