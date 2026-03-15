import {
  Create,
  Form,
  NumberInput,
  AttributeEditor,
  AutocompleteInput,
  ReferenceInput,
  required,
  minValue,
  minLength,
} from 'strato-admin';

export const CartCreate = () => (
  <Create title="Add Cart">
    <Form>
      <Form.Field source="userId" label="User" validate={required()}>
        <ReferenceInput reference="users">
          <AutocompleteInput />
        </ReferenceInput>
      </Form.Field>
      <AttributeEditor source="products" label="Products" validate={[required(), minLength(2)]}>
        <AttributeEditor.Item source="id" label="Product" validate={[required(), minValue(1)]}>
          <ReferenceInput reference="products">
            <AutocompleteInput />
          </ReferenceInput>
        </AttributeEditor.Item>
        <AttributeEditor.Item
          source="quantity"
          label="Quantity"
          field={NumberInput}
          validate={[required(), minValue(1)]}
        />
      </AttributeEditor>
    </Form>
  </Create>
);

export default CartCreate;
