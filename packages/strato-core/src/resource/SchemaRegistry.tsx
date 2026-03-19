import React, { createContext, useContext, ReactNode, useState, useCallback, useMemo, ComponentType, Fragment } from 'react';
import { required, useResourceContext, useResourceDefinition, useGetResourceLabel } from '@strato-admin/ra-core';
import { FieldSchema, useFieldSchema } from './FieldSchema';
import { InputSchema, useInputSchema } from './InputSchema';

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

/**
 * Hook to access all schema-related information for a resource.
 * It combines information from ResourceContext, FieldSchemaContext, InputSchemaContext,
 * and the central SchemaRegistry.
 */
export const useResourceSchema = (resourceProp?: string) => {
  const resourceContext = useResourceContext();
  const resource = resourceProp || resourceContext;

  const fieldSchemaFromContext = useFieldSchema();
  const inputSchemaFromContext = useInputSchema();
  const { getSchemas } = useSchemaRegistry();
  const definition = useResourceDefinition({ resource });
  const getResourceLabel = useGetResourceLabel();

  return useMemo(() => {
    const isDifferentResource = resourceProp && resourceProp !== resourceContext;

    let fieldSchema = fieldSchemaFromContext;
    let inputSchema = inputSchemaFromContext;

    // Use registry if we are looking for a different resource,
    // or if the current context has empty schemas (fallback).
    if (resource && (isDifferentResource || fieldSchema.length === 0 || inputSchema.length === 0)) {
      const registrySchemas = getSchemas(resource);
      if (registrySchemas) {
        if (isDifferentResource || fieldSchema.length === 0) {
          fieldSchema = registrySchemas.fieldSchema ? React.Children.toArray(registrySchemas.fieldSchema) : [];
        }
        if (isDifferentResource || inputSchema.length === 0) {
          inputSchema = registrySchemas.inputSchema ? React.Children.toArray(registrySchemas.inputSchema) : [];
        }
      }
    }

    return {
      resource,
      fieldSchema,
      inputSchema,
      definition,
      label: resource ? getResourceLabel(resource, 2) : undefined, // TODO: stop hardcoding pluralization - translation issues in some languages. 
      getField: (source: string) => fieldSchema.find(
        (child) => React.isValidElement(child) && (child.props as any).source === source
      ),
      getInput: (source: string) => inputSchema.find(
        (child) => React.isValidElement(child) && (child.props as any).source === source
      ),
    };
  }, [resource, resourceProp, resourceContext, fieldSchemaFromContext, inputSchemaFromContext, getSchemas, definition, getResourceLabel]);
};
