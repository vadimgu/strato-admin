import { ResourceSchema, Table, List, Show, KeyValuePairs, TextField } from '@strato-admin/admin';

export const categoryResource = (
  <ResourceSchema
    label="Categories"
    name="categories"
    list={false}
    delete={false}
    details={false}
    recordRepresentation={(record: any) => record.name}
  >
    <TextField source="id" label="ID" link="show" />
    <TextField source="name" label="Category Name" link="show" />
  </ResourceSchema>
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
