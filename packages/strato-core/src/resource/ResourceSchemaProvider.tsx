import React, { ReactNode, Children, useMemo, useContext } from 'react';
import { FieldSchemaContext } from './FieldSchema';
import { InputSchemaContext } from './InputSchema';
import { useSchemaRegistry } from './SchemaRegistry';
import { ResourceContext } from './ResourceContext';

export interface ResourceSchemaProviderProps {
  children: ReactNode;
  resource?: string;
  fieldSchema?: ReactNode;
  inputSchema?: ReactNode;
  queryOptions?: any;
}

/**
 * Provides the field and input schemas to its children via context.
 * This is a lightweight version of ResourceSchema that does not register
 * a React-Admin <Resource> or define routes.
 *
 * It can also look up schemas in the central registry if a resource name is provided.
 */
export const ResourceSchemaProvider = ({
  children,
  resource,
  fieldSchema,
  inputSchema,
  queryOptions,
}: ResourceSchemaProviderProps) => {
  const { registerSchemas, getSchemas } = useSchemaRegistry();
  const parentResource = useContext(ResourceContext);

  // 1. Register schemas synchronously during render.
  useMemo(() => {
    if (resource && (fieldSchema || inputSchema || queryOptions)) {
      registerSchemas(resource, { fieldSchema, inputSchema, queryOptions });
    }
  }, [resource, fieldSchema, inputSchema, queryOptions, registerSchemas]);

  // 2. Lookup schemas if not provided
  // We MUST check the registry if resource is provided, even if we have some schemas from props,
  // because props might only contain ONE of them (e.g. only fieldSchema).
  const registrySchemas = useMemo(() => {
    const effectiveResource = resource || parentResource;
    if (effectiveResource) {
      return getSchemas(effectiveResource);
    }
    return undefined;
  }, [resource, parentResource, getSchemas]);

  const finalFieldSchema = fieldSchema || registrySchemas?.fieldSchema;
  const finalInputSchema = inputSchema || registrySchemas?.inputSchema;

  // Extract children if the schemas are passed as <FieldSchema> or <InputSchema> elements
  const getChildren = (schema: ReactNode) => {
    if (React.isValidElement(schema)) {
      if ('children' in (schema.props as any)) {
        return (schema.props as any).children;
      }
    }
    return schema;
  };

  const fieldChildren = useMemo(
    () => (finalFieldSchema ? Children.toArray(getChildren(finalFieldSchema)) : undefined),
    [finalFieldSchema],
  );

  const inputChildren = useMemo(
    () => (finalInputSchema ? Children.toArray(getChildren(finalInputSchema)) : undefined),
    [finalInputSchema],
  );

  let content = children;

  // 3. Wrap in new ResourceContext if the resource changed.
  if (resource && resource !== parentResource) {
    content = <ResourceContext.Provider value={resource}>{content}</ResourceContext.Provider>;
  }

  // 4. Wrap in Schema Providers.
  // We provide a new context if:
  // - The resource changed (prevents leakage)
  // - OR we have explicit schema children to provide
  if (resource && resource !== parentResource) {
    // If resource changed, we MUST provide a context to isolate children.
    // If no schema found, we provide [] ONLY IF we are confident it's a known resource.
    // Actually, providing [] is safer to block leakage, but Table needs to handle it.
    content = (
      <FieldSchemaContext.Provider value={fieldChildren || []}>
        <InputSchemaContext.Provider value={inputChildren || []}>{content}</InputSchemaContext.Provider>
      </FieldSchemaContext.Provider>
    );
  } else {
    // Resource is the same (or not provided), only wrap if we have NEW schema content
    if (fieldChildren) {
      content = <FieldSchemaContext.Provider value={fieldChildren}>{content}</FieldSchemaContext.Provider>;
    }
    if (inputChildren) {
      content = <InputSchemaContext.Provider value={inputChildren}>{content}</InputSchemaContext.Provider>;
    }
  }

  return <>{content}</>;
};
