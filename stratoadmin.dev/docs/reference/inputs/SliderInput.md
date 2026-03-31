# `<SliderInput>`

The `<SliderInput>` component allows users to select a single value from a range using a slider, wrapping Cloudscape's `<Slider>` component.

## Usage

```tsx
import { SliderInput } from '@strato-admin/admin';

<SliderInput source="rating" label="Rating" min={0} max={100} step={1} />;
```

## Props

import PropsTable from '@site/src/components/PropsTable';

<PropsTable name="SliderInput" />

### `min`

The minimum value of the slider.
**Default:** `0`

### `max`

The maximum value of the slider.
**Default:** `100`

### `step`

The granularity of the slider.
**Default:** `1`

### `ticks`

An array of values where tick marks should be displayed.

### `referenceLines`

Adds visual reference lines.

### `disabled`

If `true`, the slider is disabled.
