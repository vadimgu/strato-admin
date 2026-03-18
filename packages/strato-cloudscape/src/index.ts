export * from '@strato-admin/core';

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
export { type InputProps } from './input';
