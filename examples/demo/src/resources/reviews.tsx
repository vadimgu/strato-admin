import {
  Table,
  List,
  FieldSchema,
  Show,
  KeyValuePairs,
  TextField,
  DateField,
  ReferenceField,
  StatusIndicatorField,
} from 'strato-admin';
import StarRatingField from '../components/StarRatingField';

export const reviewSchema = (
  <FieldSchema>
    <TextField source="id" label="ID" link="show" />
    <DateField source="date" label="Date" sortable />
    <ReferenceField source="customer_id" reference="customers" label="Customer" link="show" />
    <ReferenceField source="product_id" reference="products" label="Product" link="show" />
    <StarRatingField source="rating" label="Rating" sortable />
    <StatusIndicatorField source="status" label="Status" sortable>
      <StatusIndicatorField.Label value="accepted" type="success" label="Accepted" />
      <StatusIndicatorField.Label value="pending" type="pending" label="Pending" />
      <StatusIndicatorField.Label value="rejected" type="error" label="Rejected" />
    </StatusIndicatorField>
    <TextField source="comment" label="Comment" />
  </FieldSchema>
);

export function ReviewList() {
  return (
    <List perPage={10}>
      <Table
        header="Reviews"
        selectionType="multi"
        filteringPlaceholder="Search reviews..."
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
