import {
  ResourceSchema,
  TextField,
  DateField,
  ReferenceField,
  StatusIndicatorField,
  Cards,
} from '@strato-admin/admin';
import StarRatingField from '../components/StarRatingField';

export const reviewResource = (
  <ResourceSchema
    name="reviews"
    label="Reviews"
    delete={false}
    create={false}
    listComponent={Cards}
    perPage={16}
    listInclude={["id", "date", "rating", "comment"]}
  >
    <TextField source="id" label="ID" link="detail" sortable />
    <DateField source="date" label="Date" sortable />
    <ReferenceField source="customer_id" reference="customers" label="Customer" link="detail" />
    <ReferenceField source="product_id" reference="products" label="Product" link="detail" />
    <StarRatingField source="rating" label="Rating" sortable />
    <StatusIndicatorField source="status" label="Status" sortable>
      <StatusIndicatorField.Label value="accepted" type="success" label="Accepted" />
      <StatusIndicatorField.Label value="pending" type="pending" label="Pending" />
      <StatusIndicatorField.Label value="rejected" type="error" label="Rejected" />
    </StatusIndicatorField>
    <TextField source="comment" label="Comment" />
  </ResourceSchema>
);

