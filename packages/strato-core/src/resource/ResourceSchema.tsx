import { ReactNode } from 'react';
import { Resource, ResourceProps } from '@strato-admin/ra-core';
import { ResourceSchemaProvider } from './ResourceSchemaProvider';
import { registerGlobalSchemas, useSchemaRegistry, getDefaultResourceComponents, parseUnifiedSchema } from './SchemaRegistry';

export interface ResourceSchemaProps extends ResourceProps {
  fieldSchema?: ReactNode;
  inputSchema?: ReactNode;
  children?: ReactNode;
  label?: string;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  canShowDetails?: boolean;
  canList?: boolean;

  /**
   * List of field sources to include in the list view (Table/Cards).
   */
  listFields?: string[];
  /**
   * List of field sources to exclude from the list view (Table/Cards).
   */
  excludeListFields?: string[];
  /**
   * List of field sources to include in the show view (KeyValuePairs).
   */
  showFields?: string[];
  /**
   * List of field sources to exclude from the show view (KeyValuePairs).
   */
  excludeShowFields?: string[];
  /**
   * List of field sources to include in the create/edit forms.
   */
  formFields?: string[];
  /**
   * List of field sources to exclude from the create/edit forms.
   */
  excludeFormFields?: string[];
}

/**
 * A wrapper around React-Admin's <Resource> that allows defining 
 * the field and input schemas via children or props.
 * 
 * @example
 * <ResourceSchema name="posts" list={PostList}>
 *   <TextField source="title" />
 * </ResourceSchema>
 */
export const ResourceSchema = ({
  fieldSchema: explicitFieldSchema,
  inputSchema: explicitInputSchema,
  children,
  label,
  options,
  canCreate = true,
  canEdit = true,
  canDelete = true,
  canShowDetails = true,
  canList = true,
  listFields,
  excludeListFields,
  showFields,
  excludeShowFields,
  formFields,
  excludeFormFields,
  ...props
}: ResourceSchemaProps) => {
  const { defaultComponents } = useSchemaRegistry();

  const parsedSchemas = children ? parseUnifiedSchema(children) : {};
  const fieldSchema = explicitFieldSchema || parsedSchemas.fieldSchema;
  const inputSchema = explicitInputSchema || parsedSchemas.inputSchema;

  const mergedOptions = {
    ...options,
    ...(label ? { label } : {}),
    canCreate,
    canEdit,
    canDelete,
    canShowDetails,
    canList,
    listFields,
    excludeListFields,
    showFields,
    excludeShowFields,
    formFields,
    excludeFormFields,
  };

  const finalProps = {
    ...props,
    list: canList ? (props.list || defaultComponents.list) : undefined,
    create: canCreate ? (props.create || defaultComponents.create) : undefined,
    edit: canEdit ? (props.edit || defaultComponents.edit) : undefined,
    show: canShowDetails ? (props.show || defaultComponents.show) : undefined,
  };

  return (
    <ResourceSchemaProvider resource={props.name} fieldSchema={fieldSchema} inputSchema={inputSchema}>
      <Resource {...finalProps} options={mergedOptions} />
    </ResourceSchemaProvider>
  );
};

ResourceSchema.raName = 'Resource';

/**
 * This is called by React-Admin during Admin initialization.
 * We use it to register schemas globally before any component renders.
 */
ResourceSchema.registerResource = (props: ResourceSchemaProps) => {
  const {
    name,
    fieldSchema: explicitFieldSchema,
    inputSchema: explicitInputSchema,
    children,
    label,
    options,
    canCreate = true,
    canEdit = true,
    canDelete = true,
    canShowDetails = true,
    canList = true,
    listFields,
    excludeListFields,
    showFields,
    excludeShowFields,
    formFields,
    excludeFormFields,
    list,
    create,
    edit,
    show,
  } = props;

  const parsedSchemas = children ? parseUnifiedSchema(children) : {};
  const fieldSchema = explicitFieldSchema || parsedSchemas.fieldSchema;
  const inputSchema = explicitInputSchema || parsedSchemas.inputSchema;

  if (name && (fieldSchema || inputSchema)) {
    registerGlobalSchemas(name, {
      fieldSchema,
      inputSchema,
      listFields,
      excludeListFields,
      showFields,
      excludeShowFields,
      formFields,
      excludeFormFields,
    });
  }

  const defaultComponents = getDefaultResourceComponents();
  const mergedOptions = {
    ...options,
    ...(label ? { label } : {}),
    canCreate,
    canEdit,
    canDelete,
    canShowDetails,
    canList,
    listFields,
    excludeListFields,
    showFields,
    excludeShowFields,
    formFields,
    excludeFormFields,
  };

  const finalProps = {
    ...props,
    list: canList ? (list || defaultComponents.list) : undefined,
    create: canCreate ? (create || defaultComponents.create) : undefined,
    edit: canEdit ? (edit || defaultComponents.edit) : undefined,
    show: canShowDetails ? (show || defaultComponents.show) : undefined,
    options: mergedOptions,
  };

  return (Resource as any).registerResource(finalProps);
};
