import React, { ReactNode } from 'react';
import { Resource, ResourceProps } from 'ra-core';
import { ResourceSchemaProvider } from './ResourceSchemaProvider';
import { registerGlobalSchemas } from './SchemaRegistry';

export interface ResourceSchemaProps extends ResourceProps {
  fieldSchema?: ReactNode;
  inputSchema?: ReactNode;
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
  ...props 
}: ResourceSchemaProps) => {
  return (
    <ResourceSchemaProvider resource={props.name} fieldSchema={fieldSchema} inputSchema={inputSchema}>
      <Resource {...props} />
    </ResourceSchemaProvider>
  );
};

ResourceSchema.raName = 'Resource';

/**
 * This is called by React-Admin during Admin initialization.
 * We use it to register schemas globally before any component renders.
 */
ResourceSchema.registerResource = (props: ResourceSchemaProps) => {
  const { name, fieldSchema, inputSchema } = props;
  if (name && (fieldSchema || inputSchema)) {
    registerGlobalSchemas(name, { fieldSchema, inputSchema });
  }
  return (Resource as any).registerResource(props);
};
