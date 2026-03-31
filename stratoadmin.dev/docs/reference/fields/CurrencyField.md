---
sidebar_position: 5
---

# `<CurrencyField>`

Displays a currency value, formatted according to the user's locale using `Intl.NumberFormat`.
It's a specialization of the [`<NumberField>`](./NumberField.md) and accepts the same props, except that the `style` option of the `options` prop is always set to `currency`.

import PropsTable from '@site/src/components/PropsTable';

## Usage

```tsx
<CurrencyField source="price" currency="USD" />
```

By default, the `CurrencyField` uses the locale from the application context. You can override it with the `locales` prop:

```tsx
<CurrencyField source="price" currency="USD" locales="en-US" />
```

You can also use the `options` prop to customize the formatting, just like for the `<NumberField>`:

```tsx
<CurrencyField source="price" currency="USD" options={{ minimumFractionDigits: 2 }} />
```

## Props

<PropsTable name="CurrencyField" />
