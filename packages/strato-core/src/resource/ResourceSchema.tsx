import React, { ReactNode } from 'react';
import { Resource, ResourceProps } from 'ra-core';
import { ResourceSchemaProvider } from './ResourceSchemaProvider';
import { registerGlobalSchemas } from './SchemaRegistry';

export interface ResourceSchemaProps extends ResourceProps {
  fieldSchema?: ReactNode;
  inputSchema?: ReactNode;
  label?: string;
}

/**
 * A wrapper around React-Admin's <Resource> that allows defining 
 * the field and input schemas via props.
 * 
 * @example
 * <ResourceSchema 
 *   name="posts" 
 *   list={PostList}
 *   fieldSchema={
 *     <FieldSchema>
 *       <TextField source="title" />
 *     </FieldSchema>
 *   }
 * />
 */
export const ResourceSchema = ({
  fieldSchema,
  inputSchema,
  label,
  options,
  ...props
}: ResourceSchemaProps) => {
  const mergedOptions = label ? { ...options, label } : options;
  return (
    <ResourceSchemaProvider resource={props.name} fieldSchema={fieldSchema} inputSchema={inputSchema}>
      <Resource {...props} options={mergedOptions} />
    </ResourceSchemaProvider>
  );
};

ResourceSchema.raName = 'Resource';

/**
 * This is called by React-Admin during Admin initialization.
 * We use it to register schemas globally before any component renders.
 */
ResourceSchema.registerResource = (props: ResourceSchemaProps) => {
  const { name, fieldSchema, inputSchema, label, options } = props;
  if (name && (fieldSchema || inputSchema)) {
    registerGlobalSchemas(name, { fieldSchema, inputSchema });
  }
  const mergedOptions = label ? { ...options, label } : options;
  return (Resource as any).registerResource({ ...props, options: mergedOptions });
};
