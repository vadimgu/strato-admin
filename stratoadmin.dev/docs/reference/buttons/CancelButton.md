# `<CancelButton>`

`CancelButton` navigates back to the previous page. It is included in the default form toolbar alongside `<SaveButton>` in `<Create>` and `<Edit>` views.

## Usage

```tsx
import { CancelButton } from '@strato-admin/cloudscape';

// Already included by default — use only when customising the toolbar
<Create
  toolbar={
    <SpaceBetween direction="horizontal" size="xs">
      <CancelButton />
      <SaveButton />
    </SpaceBetween>
  }
>
  ...
</Create>;
```

### Custom label

The button label defaults to the translated string for `strato.action.cancel` ("Cancel").

```tsx
<CancelButton label="Discard changes" />
```

### Changing the variant

```tsx
<CancelButton variant="normal" />
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="CancelButton" />

### `label`

**Type:** `string`
**Default:** translated `"Cancel"`

Override the button label.

### `variant`

**Type:** `'primary' | 'normal' | 'link'`
**Default:** `'link'`

Controls the Cloudscape button style. Defaults to `link` to keep Cancel visually subordinate to the primary Save action.
