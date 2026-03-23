import { ReactNode } from 'react';
import { ExtractRecordPaths, type ResourceProps } from '@strato-admin/ra-core';
import { ResourceSchemaProvider } from './ResourceSchemaProvider';
import { Resource, } from './Resource';
import {
  registerGlobalSchemas,
  useSchemaRegistry,
  getDefaultResourceComponents,
  parseUnifiedSchema,
} from './SchemaRegistry';

export interface ResourceSchemaProps<RecordType extends Record<string, any> = any>
  extends Omit<ResourceProps, 'list' | 'create' | 'edit' | 'show'> {
  /**
   * React elements that define the schema for fields and inputs (e.g., <TextField />, <TextInput />).
   */
  children?: ReactNode;
  /**
   * The human-readable name of the resource. If not provided, the resource name will be used.
   */
  label?: string;
  /**
   * The component or element to use for the list view. Set to false to disable, true to use default.
   */
  list?: ResourceProps['list'] | boolean;
  /**
   * The component or element to use for the create view. Set to false to disable, true to use default.
   */
  create?: ResourceProps['create'] | boolean;
  /**
   * The component or element to use for the edit view. Set to false to disable, true to use default.
   */
  edit?: ResourceProps['edit'] | boolean;
  /**
   * The component or element to use for the detail view. Set to false to disable, true to use default.
   */
  details?: ResourceProps['show'] | boolean;

  /**
   * The label to use for the list view title. If not provided, the label will be used.
   */
  listTitle?: string;
  /**
   * The label to use for the create view title.
   */
  createTitle?: string;
  /**
   * The label to use for the edit view title.
   */
  editTitle?: string | ((record?: any) => string);
  /**
   * The label to use for the detail view title.
   */
  detailTitle?: string | ((record?: any) => string);
  /**
   * The description to use for the list view.
   */
  listDescription?: string;
  /**
   * The description to use for the create view.
   */
  createDescription?: string;
  /**
   * The description to use for the edit view.
   */
  editDescription?: string | ((record?: any) => string);
  /**
   * The description to use for the detail view.
   */
  detailDescription?: string | ((record?: any) => string);

  /**
   * Whether the resource can be deleted. Use false to disable the delete functionality.
   */
  delete?: boolean;

  /**
   * List of field to include in the list view (Table/Cards).
   */
  listInclude?: ExtractRecordPaths<RecordType>[];
  /**
   * List of fields to exclude from the list view (Table/Cards).
   */
  listExclude?: ExtractRecordPaths<RecordType>[];
  /**
   * List of fields to display by default in the list view (Table).
   */
  listDisplay?: ExtractRecordPaths<RecordType>[];
  /**
   * List of fields to include in the detail view (KeyValuePairs).
   */
  detailInclude?: ExtractRecordPaths<RecordType>[];
  /**
   * List of fields to exclude from the detail view (KeyValuePairs).
   */
  detailExclude?: ExtractRecordPaths<RecordType>[];
  /**
   * List of fields to include in the create/edit forms.
   */
  formInclude?: ExtractRecordPaths<RecordType>[];
  /**
   * List of fields to exclude from the create/edit forms.
   */
  formExclude?: ExtractRecordPaths<RecordType>[];
  /**
   * Permanent filters applied to the list view.
   */
  defaultFilters?: any;
  /**
   * Initial sort order for the list view.
   */
  defaultSort?: { field: string; order: 'ASC' | 'DESC' };
  /**
   * Number of records to display per page in the list view.
   */
  perPage?: number;
  /**
   * The default presentation component for the list view (e.g., Table, Cards).
   */
  listComponent?: React.ComponentType<any>;
  /**
   * The default presentation component for the detail view (e.g., KeyValuePairs).
   */
  detailComponent?: React.ComponentType<any>;
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
export const ResourceSchema = <RecordType extends Record<string, any> = any>({
  children,
  label,
  listTitle,
  createTitle,
  editTitle,
  detailTitle,
  listDescription,
  createDescription,
  editDescription,
  detailDescription,
  options,
  list,
  create,
  edit,
  details,
  delete: deleteProp,
  listInclude,
  listExclude,
  listDisplay,
  detailInclude,
  detailExclude,
  formInclude,
  formExclude,
  defaultFilters,
  defaultSort,
  perPage,
  listComponent,
  detailComponent,
  ...props
}: ResourceSchemaProps<RecordType>) => {
  const { defaultComponents } = useSchemaRegistry();

  // Determine effective boolean flags
  const canList = list !== false;
  const canCreate = create !== false;
  const canEdit = edit !== false;
  const canShowDetails = details !== false;
  const canDelete = deleteProp !== false;

  const parsedSchemas = children ? parseUnifiedSchema(children) : {};
  const { fieldSchema, inputSchema } = parsedSchemas;

  const mergedOptions = {
    ...options,
    ...(label ? { label } : {}),
    listTitle,
    createTitle,
    editTitle,
    detailTitle,
    listDescription,
    createDescription,
    editDescription,
    detailDescription,
    canCreate,
    canEdit,
    canDelete,
    canShowDetails,
    canList,
    listInclude,
    listExclude,
    listDisplay,
    detailInclude,
    detailExclude,
    formInclude,
    formExclude,
    listComponent,
    detailComponent,
  };

  const getListComponent = () => {
    const listComponent = list === true || list === undefined ? defaultComponents.list : list;
    if (!listComponent) return undefined;

    // Wrap the list component to inject props from ResourceSchema
    return (listProps: any) => {
      const FinalList: any = listComponent;
      return (
        <FinalList
          {...listProps}
          filter={defaultFilters}
          sort={defaultSort}
          perPage={perPage}
        />
      );
    };
  };

  const finalProps = {
    ...props,
    list: canList ? getListComponent() : undefined,
    create: canCreate ? (create === true || create === undefined ? defaultComponents.create : create) : undefined,
    edit: canEdit ? (edit === true || edit === undefined ? defaultComponents.edit : edit) : undefined,
    show: canShowDetails ? (details === true || details === undefined ? defaultComponents.show : details) : undefined,
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
ResourceSchema.registerResource = <RecordType extends Record<string, any> = any>(
  props: ResourceSchemaProps<RecordType>
) => {
  const {
    name,
    children,
    label,
    listTitle,
    createTitle,
    editTitle,
    detailTitle,
    listDescription,
    createDescription,
    editDescription,
    detailDescription,
    options,
    list,
    create,
    edit,
    details,
    delete: deleteProp,
    listInclude,
    listExclude,
    listDisplay,
    detailInclude,
    detailExclude,
    formInclude,
    formExclude,
    defaultFilters,
    defaultSort,
    perPage,
    listComponent,
    detailComponent,
  } = props;

  // Determine effective boolean flags
  const canList = list !== false;
  const canCreate = create !== false;
  const canEdit = edit !== false;
  const canShowDetails = details !== false;
  const canDelete = deleteProp !== false;

  const parsedSchemas = children ? parseUnifiedSchema(children) : {};
  const { fieldSchema, inputSchema } = parsedSchemas;

  if (name && (fieldSchema || inputSchema)) {
    registerGlobalSchemas(name, {
      fieldSchema,
      inputSchema,
      listInclude,
      listExclude,
      listDisplay,
      detailInclude,
      detailExclude,
      formInclude,
      formExclude,
      listTitle,
      createTitle,
      editTitle,
      detailTitle,
      listDescription,
      createDescription,
      editDescription,
      detailDescription,
      listComponent,
      detailComponent,
    });
  }

  const defaultComponents = getDefaultResourceComponents();
  const mergedOptions = {
    ...options,
    ...(label ? { label } : {}),
    listTitle,
    createTitle,
    editTitle,
    detailTitle,
    listDescription,
    createDescription,
    editDescription,
    detailDescription,
    canCreate,
    canEdit,
    canDelete,
    canShowDetails,
    canList,
    listInclude,
    listExclude,
    listDisplay,
    detailInclude,
    detailExclude,
    formInclude,
    formExclude,
    listComponent,
    detailComponent,
  };

  const getListComponent = () => {
    const listComponent = list === true || list === undefined ? defaultComponents.list : list;
    if (!listComponent) return undefined;

    return (listProps: any) => {
      const FinalList: any = listComponent;
      return (
        <FinalList
          {...listProps}
          filter={defaultFilters}
          sort={defaultSort}
          perPage={perPage}
        />
      );
    };
  };

  const finalProps = {
    ...props,
    list: canList ? getListComponent() : undefined,
    create: canCreate ? (create === true || create === undefined ? defaultComponents.create : create) : undefined,
    edit: canEdit ? (edit === true || edit === undefined ? defaultComponents.edit : edit) : undefined,
    show: canShowDetails
      ? details === true || details === undefined
        ? defaultComponents.show
        : details
      : undefined,
    options: mergedOptions,
  };

  return (Resource as any).registerResource(finalProps);
};
