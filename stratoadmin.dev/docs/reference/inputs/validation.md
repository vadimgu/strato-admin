---
sidebar_position: 2
---

# Validation

All input components accept a `validate` prop. Pass a single validator function
or an array of validators; errors are displayed automatically below the input.

```tsx
import { TextInput, required, minLength } from '@strato-admin/admin';

<TextInput source="title" validate={required()} />
<TextInput source="slug" validate={[required(), minLength(3)]} />
```

## Built-in Validators

### `required(message?)`

Fails when the value is empty (`null`, `undefined`, `''`, or `[]`).

```tsx
<TextInput source="name" validate={required()} />
<TextInput source="name" validate={required('Name is required')} />
```

The validated field is also marked with a required indicator in the form UI. This is the same effect as setting `isRequired` on a `ResourceSchema` field.

### `minLength(min, message?)`

Fails when the string length is less than `min`. Passes when the value is empty (combine with `required()` if the field is mandatory).

```tsx
<TextInput source="password" validate={minLength(8)} />
<TextInput source="password" validate={[required(), minLength(8, 'At least 8 characters')]} />
```

### `maxLength(max, message?)`

Fails when the string length exceeds `max`.

```tsx
<TextInput source="bio" validate={maxLength(280)} />
```

### `minValue(min, message?)`

Fails when the numeric value is less than `min`. Passes when empty.

```tsx
<NumberInput source="quantity" validate={minValue(1)} />
```

### `maxValue(max, message?)`

Fails when the numeric value exceeds `max`. Passes when empty.

```tsx
<NumberInput source="discount" validate={maxValue(100)} />
<NumberInput source="price" validate={[minValue(0), maxValue(10000)]} />
```

### `number(message?)`

Fails when the value cannot be parsed as a number. Useful on `<TextInput>` when you want numeric content without a dedicated number field.

```tsx
<TextInput source="zip_code" validate={number()} />
```

### `email(message?)`

Fails when the value is not a valid email address. Passes when empty.

```tsx
<TextInput source="email" validate={[required(), email()]} />
```

### `regex(pattern, message)`

Fails when the string does not match the regular expression. Passes when empty.

```tsx
<TextInput source="zip" validate={regex(/^\d{5}$/, 'Must be a 5-digit ZIP code')} />
```

### `choices(list, message?)`

Fails when the value is not in the provided list. Most useful for custom inputs; `<SelectInput>` validates choices automatically.

```tsx
<TextInput source="status" validate={choices(['draft', 'published', 'archived'])} />
```

## Combining Validators

Pass an array to apply multiple validators. They run in order and stop at the first failure.

```tsx
import { TextInput, required, minLength, maxLength } from '@strato-admin/admin';

<TextInput source="username" validate={[required(), minLength(3), maxLength(20)]} />;
```

## Custom Validators

A validator is a function with the signature `(value, allValues) => string | undefined`. Return an error message string to fail, or `undefined` to pass.

```tsx
const mustBePositive = (value) => (value > 0 ? undefined : 'Must be a positive number');

<NumberInput source="price" validate={mustBePositive} />;
```

You can access the entire form state via the second argument:

```tsx
const passwordsMatch = (value, allValues) => (value !== allValues.password ? 'Passwords do not match' : undefined);

<TextInput source="password_confirm" validate={passwordsMatch} />;
```

## Async Validators

Return a `Promise` to perform asynchronous validation (e.g. an API check). The input shows a loading state while the promise is pending.

```tsx
const isSlugAvailable = async (value) => {
  const res = await fetch(`/api/check-slug?slug=${value}`);
  const { available } = await res.json();
  return available ? undefined : 'This slug is already taken';
};

<TextInput source="slug" validate={[required(), isSlugAvailable]} />;
```

:::tip Memoize inline validators
Defining a validator function directly in JSX creates a new function reference on every render, which can cause performance issues. Either define validators outside the component or use the built-in memoized helpers. The built-in validators (`required()`, `minLength()`, etc.) are already memoized.
:::

## `useUnique` — Uniqueness Validation

`useUnique` is a hook that returns an async validator checking that no other record in the resource has the same value for a field. It calls `dataProvider.getList` with a filter under the hood.

```tsx
import { useUnique, TextInput } from '@strato-admin/admin';

const UserCreate = () => {
  const unique = useUnique();

  return <TextInput source="username" validate={[required(), unique()]} />;
};
```

### Options

Options can be passed to `useUnique()` at declaration time or to the returned `unique()` call. Call-time options take precedence.

```tsx
// At declaration time
const unique = useUnique({ message: 'This email is already registered' });
<TextInput source="email" validate={unique()} />;

// At call time
const unique = useUnique();
<TextInput source="email" validate={unique({ message: 'Already taken' })} />;
```

| Option     | Type     | Description                                                                       |
| ---------- | -------- | --------------------------------------------------------------------------------- |
| `message`  | `string` | Error message when uniqueness fails. Default: `'ra.validation.unique'`            |
| `filter`   | `object` | Additional filters applied to the uniqueness check (e.g. scoping by tenant).      |
| `debounce` | `number` | Milliseconds to debounce the API call. **Default:** `1000`                        |
| `resource` | `string` | Override the resource to check against. Defaults to the current resource context. |

**Scoping uniqueness with a filter:**

```tsx
const unique = useUnique();

// username unique within the user's organization
<TextInput source="username" validate={unique({ filter: { organization_id: formData.organization_id } })} />;
```

## Form-Level Validation

Instead of per-field validators, you can validate the whole form at once by passing a `validate` function to `<Create>` or `<Edit>`. Return an object mapping field names to error messages.

```tsx
const validateOrder = (values) => {
  const errors: Record<string, string> = {};
  if (!values.customer_id) errors.customer_id = 'Required';
  if (values.quantity < 1) errors.quantity = 'Must order at least one item';
  return errors;
};

<Create validate={validateOrder}>...</Create>;
```

Form-level validation runs on every submit attempt. Per-field and form-level validation can be used together.
