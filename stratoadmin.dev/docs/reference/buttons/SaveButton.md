# `<SaveButton>`

`SaveButton` submits the enclosing form. It sets `formAction="submit"` and renders as a native `type="submit"` button so it works with both Cloudscape form handling and standard HTML form submission. It is typically placed in the `actions` area of a `<Create>` or `<Edit>` view.

## Usage

```tsx
import { SaveButton } from '@strato-admin/cloudscape';

// Default usage inside Create/Edit — no props required
<Create actions={<SaveButton />}>
  ...
</Create>
```

`<Create>` and `<Edit>` already include a `SaveButton` by default. Use this component only when you need to customise the label, variant, or add additional actions alongside it.

### Custom label

The button label defaults to the translated string for `strato.action.save` ("Save").

```tsx
<SaveButton label="Publish" />
```

### Changing the variant

```tsx
<SaveButton variant="normal" />
```

### Alongside a cancel action

`<Create>` and `<Edit>` include both `<CancelButton>` and `<SaveButton>` in the default toolbar. To customise, pass your own `toolbar`:

```tsx
<Create toolbar={
  <SpaceBetween direction="horizontal" size="xs">
    <CancelButton />
    <SaveButton label="Publish" />
  </SpaceBetween>
}>
  ...
</Create>
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="SaveButton" />

### `label`

**Type:** `string`
**Default:** translated `"Save"`

Override the button label. Useful for domain-specific phrasing such as `"Publish"` or `"Place order"`.

### `variant`

**Type:** `'primary' | 'normal' | 'link'`
**Default:** `'primary'`

Controls the Cloudscape button style. `SaveButton` is almost always `primary` since it is the main form action.

