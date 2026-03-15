import {
  Edit,
  Form,
  NumberInput,
  AttributeEditor,
  ReferenceInput,
  AutocompleteInput,
  required,
  minValue,
} from 'strato-admin';

export const CartEdit = () => (
  <Edit title="Edit Cart" mutationMode="pessimistic">
    <Form>
      <Form.Field source="userId" label="User" validate={[required()]}>
        <ReferenceInput reference="users">
          <AutocompleteInput />
        </ReferenceInput>
      </Form.Field>
      <AttributeEditor source="products" label="Products" validate={[required()]}>
        <AttributeEditor.Item source="id" label="Product ID" validate={[required()]}>
          <ReferenceInput reference="products">
            <AutocompleteInput />
          </ReferenceInput>
        </AttributeEditor.Item>
        <AttributeEditor.Item source="quantity" label="Quantity" validate={[required(), minValue(1)]}>
          <NumberInput />
        </AttributeEditor.Item>
      </AttributeEditor>
    </Form>
  </Edit>
);

export default CartEdit;
