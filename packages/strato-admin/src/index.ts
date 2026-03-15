export * from 'strato-core';
export * from 'strato-cloudscape';

// Explicitly export components that conflict between strato-core and strato-cloudscape.
// This ensures the Cloudscape-themed versions are used when importing from strato-admin.
export {
  Admin,
  type AdminProps,
  Form,
  type FormProps,
  List,
  type ListProps,
  Create,
  type CreateProps,
  Edit,
  type EditProps,
  Show,
  type ShowProps,
  Resource,
  SaveButton,
  CreateButton,
  EditButton,
  BulkDeleteButton,
} from 'strato-cloudscape';
