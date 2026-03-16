import React, { createContext, useContext, ReactNode, useState, useCallback, useMemo, ComponentType } from 'react';

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
