import { Table, List, FieldSchema, Show, KeyValuePairs, TextField } from '@strato-admin/admin';

export const categorySchema = (
  <FieldSchema>
    <TextField source="id" label="ID" link="show" />
    <TextField source="name" label="Category Name" link="show" />
  </FieldSchema>
);

export function CategoryList() {
  return (
    <List>
      <Table title="Categories" selectionType="multi" />
    </List>
  );
}

export function CategoryShow() {
  return (
    <Show title="Category Details">
      <KeyValuePairs columns={2} />
    </Show>
  );
}
