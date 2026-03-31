import { ResourceSchema, TextField } from '@strato-admin/admin';

export const categoryResource = (
  <ResourceSchema
    label="Categories"
    name="categories"
    list={false}
    delete={false}
    detail={false}
    recordRepresentation={(record: any) => record.name}
  >
    <TextField source="id" label="ID" link="detail" />
    <TextField source="name" label="Category Name" link="detail" />
  </ResourceSchema>
);
