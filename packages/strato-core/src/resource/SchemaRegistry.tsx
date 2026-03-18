import React, { createContext, useContext, ReactNode, useState, useCallback, useMemo, ComponentType, Fragment } from 'react';
import { required } from '@strato-admin/ra-core';
import { FieldSchema } from './FieldSchema';
import { InputSchema } from './InputSchema';

export interface ResourceSchemas {
  fieldSchema?: ReactNode;
  inputSchema?: ReactNode;
}

export interface DefaultResourceComponents {
  list?: ComponentType<any>;
  create?: ComponentType<any>;
  edit?: ComponentType<any>;
  show?: ComponentType<any>;
}

export interface SchemaRegistryContextValue {
  registerSchemas: (resource: string, schemas: ResourceSchemas) => void;
  getSchemas: (resource: string) => ResourceSchemas | undefined;
  defaultComponents: DefaultResourceComponents;
}

const SchemaRegistryContext = createContext<SchemaRegistryContextValue | undefined>(undefined);

// Use a global store for schemas to ensure they are available even before 
// components have finished their first render/useEffect cycle.
const globalSchemaRegistry: Record<string, ResourceSchemas> = {};
let globalDefaultComponents: DefaultResourceComponents = {};
const globalFieldInputMapping = new Map<any, any>();

/**
 * Registers default input components for given field components.
 * This mapping is used by ResourceSchemaProvider to infer forms.
 */
export const registerFieldInputMapping = (mapping: Map<any, any>) => {
  mapping.forEach((value, key) => {
    globalFieldInputMapping.set(key, value);
  });
};

/**
 * Retrieves the registered default input component for a field.
 */
export const getDefaultInputForField = (fieldComponent: any) => {
  return globalFieldInputMapping.get(fieldComponent);
};

/**
 * Synchronously registers schemas for a resource.
 * Can be called during render or outside of React.
 */
export const registerGlobalSchemas = (resource: string, schemas: ResourceSchemas) => {
  if (!resource) return;
  
  const existing = globalSchemaRegistry[resource];
  
  // Only update if we actually have new schema content to avoid redundant re-renders
  if (schemas.fieldSchema || schemas.inputSchema) {
    globalSchemaRegistry[resource] = {
      ...existing,
      fieldSchema: schemas.fieldSchema || existing?.fieldSchema,
      inputSchema: schemas.inputSchema || existing?.inputSchema,
    };
    return true;
  }
  return false;
};

/**
 * Parses unified schema children (Field components) into separate
 * fieldSchema and inputSchema arrays.
 */
export const parseUnifiedSchema = (children: React.ReactNode): ResourceSchemas => {
  const fieldSchema: React.ReactNode[] = [];
  const inputSchema: React.ReactNode[] = [];

  const mergeValidation = (isRequired: boolean, validate: any) => {
    if (!isRequired) return validate;
    const requiredValidator = required();
    if (!validate) return requiredValidator;
    if (Array.isArray(validate)) {
      return validate.some((v) => (v as any).isRequired) ? validate : [requiredValidator, ...validate];
    }
    return (validate as any).isRequired ? validate : [requiredValidator, validate];
  };

  const walk = (nodes: React.ReactNode) => {
    React.Children.forEach(nodes, (child) => {
      if (!React.isValidElement(child)) return;

      // Handle Fragments and FieldSchema by recursing into their children
      if (child.type === Fragment || child.type === (FieldSchema as any)) {
        walk((child.props as any).children);
        return;
      }

      // Handle explicit InputSchema by only adding to inputSchema
      if (child.type === (InputSchema as any)) {
        React.Children.forEach((child.props as any).children, (inputChild) => {
          if (React.isValidElement(inputChild)) {
            inputSchema.push(inputChild);
          }
        });
        return;
      }

      // The field component itself goes into the field schema
      fieldSchema.push(child);

      // Extract input configuration
      const { source, input, isRequired, description, constraintText, ...rest } = child.props as any;

      if (input === false) {
        return; // Explicitly excluded from inputs
      }

      if (React.isValidElement(input)) {
        // Escape hatch: explicit input component provided
        const validate = mergeValidation(isRequired, (input.props as any).validate);
        inputSchema.push(React.cloneElement(input, { ...rest, source, isRequired, validate, description, constraintText }));
        return;
      }

      // Infer default input component
      const InputComponent = getDefaultInputForField(child.type);
      if (InputComponent) {
        const inputProps = input || {};
        const validate = mergeValidation(isRequired, inputProps.validate);
        inputSchema.push(<InputComponent key={source} {...rest} {...inputProps} source={source} isRequired={isRequired} validate={validate} description={description} constraintText={constraintText} />);
      }
    });
  };

  walk(children);

  return { 
    fieldSchema: fieldSchema.length > 0 ? fieldSchema : undefined, 
    inputSchema: inputSchema.length > 0 ? inputSchema : undefined 
  };
};

export const getGlobalSchemas = (resource: string) => globalSchemaRegistry[resource];

/**
 * Registers default components to be used by ResourceSchema when not explicitly provided.
 */
export const registerDefaultResourceComponents = (components: DefaultResourceComponents) => {
  globalDefaultComponents = { ...globalDefaultComponents, ...components };
};

export const getDefaultResourceComponents = () => globalDefaultComponents;

export const SchemaRegistryProvider = ({ children }: { children: ReactNode }) => {
  // We still use state to trigger re-renders when new schemas are registered dynamically
  const [, setTick] = useState(0);

  const registerSchemas = useCallback((resource: string, schemas: ResourceSchemas) => {
    const updated = registerGlobalSchemas(resource, schemas);
    if (updated) {
      setTick((t) => t + 1);
    }
  }, []);

  const getSchemas = useCallback((resource: string) => globalSchemaRegistry[resource], []);

  const value = useMemo(() => ({ 
    registerSchemas, 
    getSchemas, 
    defaultComponents: globalDefaultComponents 
  }), [registerSchemas, getSchemas]);

  return (
    <SchemaRegistryContext.Provider value={value}>
      {children}
    </SchemaRegistryContext.Provider>
  );
};

export const useSchemaRegistry = () => {
  const context = useContext(SchemaRegistryContext);
  if (!context) {
    return {
      registerSchemas: registerGlobalSchemas,
      getSchemas: getGlobalSchemas,
      defaultComponents: globalDefaultComponents,
    };
  }
  return context;
};
