---
sidebar_position: 4
---

# `<NumberField>`

Displays a numeric value, formatted according to the user's locale using `Intl.NumberFormat`.

import PropsTable from '@site/src/components/PropsTable';

## Usage

```tsx
<NumberField source="price" options={{ style: 'currency', currency: 'USD' }} />
```

### Percentage Formatting

```tsx
<NumberField source="taxRate" options={{ style: 'percent', minimumFractionDigits: 2 }} />
```

## Props

<PropsTable name="NumberField" />
