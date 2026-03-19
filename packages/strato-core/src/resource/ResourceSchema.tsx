import { ReactNode } from 'react';
import { Resource, ResourceProps } from '@strato-admin/ra-core';
import { ResourceSchemaProvider } from './ResourceSchemaProvider';
import { registerGlobalSchemas, useSchemaRegistry, getDefaultResourceComponents, parseUnifiedSchema } from './SchemaRegistry';

export interface ResourceSchemaProps extends ResourceProps {
  /**
   * React elements that define the schema for fields and inputs (e.g., <TextField />, <TextInput />).
   */
  children?: ReactNode;
  /**
   * The human-readable name of the resource. If not provided, the resource name will be used.
   */
  label?: string;
  /**
   * Whether the resource can be created. If true, the create view is enabled.
   * @default true
   */
  canCreate?: boolean;
  /**
   * Whether the resource can be edited. If true, the edit view is enabled.
   * @default true
   */
  canEdit?: boolean;
  /**
   * Whether the resource can be deleted. If true, the delete action is enabled.
   * @default true
   */
  canDelete?: boolean;
  /**
   * Whether the resource details can be shown. If true, the show view is enabled.
   * @default true
   */
  canShowDetails?: boolean;
  /**
   * Whether the resource can be listed. If true, the list view is enabled.
   * @default true
   */
  canList?: boolean;

  /**
   * List of field to include in the list view (Table/Cards).
   */
  listFields?: string[];
  /**
   * List of fields to exclude from the list view (Table/Cards).
   */
  excludeListFields?: string[];
  /**
   * List of fields to include in the show view (KeyValuePairs).
   */
  showFields?: string[];
  /**
   * List of fields to exclude from the show view (KeyValuePairs).
   */
  excludeShowFields?: string[];
  /**
   * List of fields to include in the create/edit forms.
   */
  formFields?: string[];
  /**
   * List of fields to exclude from the create/edit forms.
   */
  excludeFormFields?: string[];
}

/**
 * A wrapper around React-Admin's <Resource> that allows defining 
 * the field and input schemas via children.
 * 
 * @example
 * <ResourceSchema name="posts">
 *   <TextField source="title" />
 * </ResourceSchema>
 */
export const ResourceSchema = ({
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
  const { fieldSchema, inputSchema } = parsedSchemas;

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
  const { fieldSchema, inputSchema } = parsedSchemas;

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
