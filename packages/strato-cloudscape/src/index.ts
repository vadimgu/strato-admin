import { registerDefaultResourceComponents } from 'strato-core';
import { List } from './list';
import { Create } from './create';
import { Edit } from './edit';
import { Show } from './detail';

export * from './collection-hooks';
export * from './list';
export * from './detail';
export * from './edit';
export * from './create';
export * from './field';
export * from './input';
export * from './form';
export * from './layout';
export * from './theme';
export * from './button';
export * from './Admin';
export { default as RecordLink } from './RecordLink';
export * from './RecordLink';

// Explicitly export themed components to resolve ambiguity with strato-core (ra-core) re-exports
export { Admin, type AdminProps } from './Admin';
export { Form, type FormProps } from './form';
export { List, type ListProps } from './list';
export { Create, type CreateProps } from './create';
export { Edit, type EditProps } from './edit';
export { Show, type ShowProps } from './detail';

export * from 'strato-core';

// Register Cloudscape themed components as defaults for ResourceSchema
registerDefaultResourceComponents({
  list: List,
  create: Create,
  edit: Edit,
  show: Show,
});
