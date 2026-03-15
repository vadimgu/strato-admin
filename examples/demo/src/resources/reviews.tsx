import {
  Table,
  List,
  FieldSchema,
  Show,
  KeyValuePairs,
  TextField,
  DateField,
  ReferenceField,
} from 'strato-admin';
import StarRatingField from '../components/StarRatingField';

export const reviewSchema = (
  <FieldSchema>
    <TextField source="id" label="ID" link="show" />
    <DateField source="date" label="Date" sortable />
    <ReferenceField source="customer_id" reference="customers" label="Customer" link="show" />
    <ReferenceField source="product_id" reference="products" label="Product" link="show" />
    <StarRatingField source="rating" label="Rating" sortable />
    <TextField source="status" label="Status" sortable />
    <TextField source="comment" label="Comment" />
  </FieldSchema>
);

export function ReviewList() {
  return (
    <List perPage={10}>
      <Table
        header="Reviews"
        selectionType="multi"
        filtering
        filteringPlaceholder="Search reviews..."
        preferences
        exclude={['comment']}
      />
    </List>
  );
}

export function ReviewShow() {
  return (
    <Show title="Review Details">
      <KeyValuePairs columns={3} />
    </Show>
  );
}
