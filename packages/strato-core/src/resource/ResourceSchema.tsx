import { ReactNode } from 'react';
import { ExtractRecordPaths, type ResourceProps } from '@strato-admin/ra-core';
import { ResourceSchemaProvider } from './ResourceSchemaProvider';
import { Resource } from './Resource';
import {
  registerGlobalSchemas,
  useSchemaRegistry,
  getDefaultResourceComponents,
  parseUnifiedSchema,
} from './SchemaRegistry';

export interface ResourceSchemaProps<RecordType extends Record<string, any> = any> extends Omit<
  ResourceProps,
  'list' | 'create' | 'edit' | 'show'
> {
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
  detail?: ResourceProps['show'] | boolean;

  /**
   * Title for the list page. Accepts a string or ReactNode.
   * If not provided, falls back to `label`.
   */
  listTitle?: ReactNode;
  /**
   * Title for the create page. Accepts a string or ReactNode.
   */
  createTitle?: ReactNode;
  /**
   * Title for the edit page. Accepts a string, ReactNode, or a function receiving the record.
   *
   * When a string is provided it is treated as an ICU message and all record fields are
   * available as named variables.
   *
   * @example "Edit Product - {name}"
   * @example (record) => `Edit ${record.name}`
   */
  editTitle?: ReactNode | ((record?: any) => ReactNode);
  /**
   * Title for the detail page. Accepts a string, ReactNode, or a function receiving the record.
   *
   * When a string is provided it is treated as an ICU message and all record fields are
   * available as named variables.
   *
   * @example "Product: {name}"
   * @example (record) => record.name
   */
  detailTitle?: ReactNode | ((record?: any) => ReactNode);
  /**
   * Description for the list page. Accepts a string or ReactNode.
   */
  listDescription?: ReactNode;
  /**
   * Description for the create page. Accepts a string or ReactNode.
   */
  createDescription?: ReactNode;
  /**
   * Description for the edit page. Accepts a string, ReactNode, or a function receiving the record.
   *
   * When a string is provided it is treated as an ICU message and all record fields are
   * available as named variables.
   *
   * @example "Editing {name} (ID: {id})"
   */
  editDescription?: ReactNode | ((record?: any) => ReactNode);
  /**
   * Description for the detail page. Accepts a string, ReactNode, or a function receiving the record.
   *
   * When a string is provided it is treated as an ICU message and all record fields are
   * available as named variables.
   *
   * @example "Viewing details for {name}"
   */
  detailDescription?: ReactNode | ((record?: any) => ReactNode);

  /**
   * Whether the resource can be deleted. Use false to disable the delete functionality.
   */
  delete?: boolean;
  /**
   * Success message shown after deleting a single record.
   * Accepts a plain string or an ICU message.
   */
  deleteSuccessMessage?: string;
  /**
   * Success message shown after bulk-deleting records.
   * Accepts a plain string or an ICU message with {smart_count} for the number of deleted items.
   *
   * @example "{smart_count, plural, =1 {Product deleted} other {# products deleted}}"
   */
  bulkDeleteSuccessMessage?: string;

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
   * List of fields to include in both create and edit forms.
   */
  formInclude?: ExtractRecordPaths<RecordType>[];
  /**
   * List of fields to exclude from both create and edit forms.
   */
  formExclude?: ExtractRecordPaths<RecordType>[];
  /**
   * List of fields to include in the edit form (takes priority over formInclude).
   */
  editInclude?: ExtractRecordPaths<RecordType>[];
  /**
   * List of fields to exclude from the edit form (takes priority over formExclude).
   */
  editExclude?: ExtractRecordPaths<RecordType>[];
  /**
   * List of fields to include in the create form (takes priority over formInclude).
   */
  createInclude?: ExtractRecordPaths<RecordType>[];
  /**
   * List of fields to exclude from the create form (takes priority over formExclude).
   */
  createExclude?: ExtractRecordPaths<RecordType>[];
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
  /**
   * Options passed to the data provider for all queries of this resource.
   */
  queryOptions?: any;
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
  detail,
  delete: deleteProp,
  deleteSuccessMessage,
  bulkDeleteSuccessMessage,
  listInclude,
  listExclude,
  listDisplay,
  detailInclude,
  detailExclude,
  formInclude,
  formExclude,
  editInclude,
  editExclude,
  createInclude,
  createExclude,
  defaultFilters,
  defaultSort,
  perPage,
  listComponent,
  detailComponent,
  queryOptions,
  ...props
}: ResourceSchemaProps<RecordType>) => {
  const { defaultComponents } = useSchemaRegistry();

  // Determine effective boolean flags
  const canList = list !== false;
  const canCreate = create !== false;
  const canEdit = edit !== false;
  const canShowDetails = detail !== false;
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
    queryOptions,
    deleteSuccessMessage,
    bulkDeleteSuccessMessage,
  };

  const getListComponent = () => {
    const listComponent = list === true || list === undefined ? defaultComponents.list : list;
    if (!listComponent) return undefined;

    // Wrap the list component to inject props from ResourceSchema
    return (listProps: any) => {
      const FinalList: any = listComponent;
      return <FinalList {...listProps} filter={defaultFilters} sort={defaultSort} perPage={perPage} />;
    };
  };

  const finalProps = {
    ...props,
    list: canList ? getListComponent() : undefined,
    create: canCreate ? (create === true || create === undefined ? defaultComponents.create : create) : undefined,
    edit: canEdit ? (edit === true || edit === undefined ? defaultComponents.edit : edit) : undefined,
    show: canShowDetails ? (detail === true || detail === undefined ? defaultComponents.show : detail) : undefined,
  };

  return (
    <ResourceSchemaProvider
      resource={props.name}
      fieldSchema={fieldSchema}
      inputSchema={inputSchema}
      queryOptions={queryOptions}
    >
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
  props: ResourceSchemaProps<RecordType>,
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
    detail,
    delete: deleteProp,
    deleteSuccessMessage,
    bulkDeleteSuccessMessage,
    listInclude,
    listExclude,
    listDisplay,
    detailInclude,
    detailExclude,
    formInclude,
    formExclude,
    editInclude,
    editExclude,
    createInclude,
    createExclude,
    defaultFilters,
    defaultSort,
    perPage,
    listComponent,
    detailComponent,
    queryOptions,
  } = props;

  // Determine effective boolean flags
  const canList = list !== false;
  const canCreate = create !== false;
  const canEdit = edit !== false;
  const canShowDetails = detail !== false;
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
      editInclude,
      editExclude,
      createInclude,
      createExclude,
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
      queryOptions,
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
    editInclude,
    editExclude,
    createInclude,
    createExclude,
    listComponent,
    detailComponent,
    queryOptions,
    deleteSuccessMessage,
    bulkDeleteSuccessMessage,
  };

  const getListComponent = () => {
    const listComponent = list === true || list === undefined ? defaultComponents.list : list;
    if (!listComponent) return undefined;

    return (listProps: any) => {
      const FinalList: any = listComponent;
      return <FinalList {...listProps} filter={defaultFilters} sort={defaultSort} perPage={perPage} />;
    };
  };

  const finalProps = {
    ...props,
    list: canList ? getListComponent() : undefined,
    create: canCreate ? (create === true || create === undefined ? defaultComponents.create : create) : undefined,
    edit: canEdit ? (edit === true || edit === undefined ? defaultComponents.edit : edit) : undefined,
    show: canShowDetails ? (detail === true || detail === undefined ? defaultComponents.show : detail) : undefined,
    options: mergedOptions,
  };

  return (Resource as any).registerResource(finalProps);
};
