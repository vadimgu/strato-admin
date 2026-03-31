# `icuI18nProvider`

Creates an [`I18nProvider`](../../core-concepts/translation.md) that translates strings using **ICU MessageFormat**. Import it from `@strato-admin/i18n` and pass the result to `<Admin>`.

## Usage

```tsx
import { Admin } from '@strato-admin/admin';
import { icuI18nProvider } from '@strato-admin/i18n';
import englishMessages from '@strato-admin/language-en';
import frenchMessages from '@strato-admin/language-fr';
import enAppMessages from '../locales/en/messages.compiled.json';
import frAppMessages from '../locales/fr/messages.compiled.json';

const messages = {
  en: { ...englishMessages, ...enAppMessages },
  fr: { ...frenchMessages, ...frAppMessages },
};

const i18nProvider = icuI18nProvider(
  (locale) => messages[locale as keyof typeof messages],
  'en',
  [
    { locale: 'en', name: 'English' },
    { locale: 'fr', name: 'Français' },
  ],
);

export default function App() {
  return (
    <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
      {/* resources */}
    </Admin>
  );
}
```

## Signature

```ts
icuI18nProvider(
  getMessages: (locale: string) => MessageMap | Promise<MessageMap>,
  initialLocale?: string,
  availableLocales?: LocaleItem[],
): I18nProvider
```

## Parameters

| Parameter | Type | Default | Description |
| :--- | :--- | :------ | :---------- |
| `getMessages` | `(locale: string) => MessageMap \| Promise<MessageMap>` | | **Required.** Called with the requested locale; must return the compiled message map (or a Promise of one). The default locale must resolve synchronously. |
| `initialLocale` | `string` | `'en'` | The locale to activate on startup. |
| `availableLocales` | `LocaleItem[]` | `[{ locale: 'en', name: 'English' }]` | The list of locales shown in the locale switcher. Each item has a `locale` code and a display `name`. |

## How it translates

1. The source string (e.g. `"Product Name"`) is **hashed** at runtime with FNV-1a into a short stable ID (e.g. `1kdfstp`).
2. The ID is looked up in the compiled message map (`messages.compiled.json`).
3. If found, the translated string is formatted as an ICU message with any runtime variables substituted.
4. If not found, the original source string is returned as-is (English fallback).

For framework-internal keys (e.g. `ra.action.save`), the literal key is tried first before hashing.

## Asynchronous locale loading

The `getMessages` function may return a `Promise` for any locale **except the initial one**, which must be synchronous. This lets you load locale bundles on demand:

```tsx
const i18nProvider = icuI18nProvider(
  async (locale) => {
    const appMessages = await import(`../locales/${locale}/messages.compiled.json`);
    const frameworkMessages = await import(`@strato-admin/language-${locale}`);
    return { ...frameworkMessages.default, ...appMessages.default };
  },
  'en',
  [
    { locale: 'en', name: 'English' },
    { locale: 'fr', name: 'Français' },
    { locale: 'de', name: 'Deutsch' },
  ],
);
```

## Message map format

The compiled message map consumed by `icuI18nProvider` is a flat object of `hash → translated string` pairs produced by [`strato-compile`](./strato-compile.md):

```json
{
  "10kmuai": "Modifier le produit - {name}",
  "1kdfstp": "Produits",
  "1pdyg96": "Prix"
}
```

Framework messages from `@strato-admin/language-en` / `@strato-admin/language-fr` use conventional `ra.*` keys and must be spread **before** your app messages so your translations can override them:

```ts
const messages = {
  fr: { ...frenchMessages, ...frAppMessages },
};
```

## ICU MessageFormat

Variable interpolation and pluralization follow the [ICU Message Format](https://unicode-org.github.io/icu/userguide/format_parse/messages/) spec.

**Interpolation:**

```
"Edit Product - {name}"   →   "Edit Product - Laptop"
```

**Pluralization:**

```
"{count, plural, =0 {No items} one {One item} other {# items}}"
```

**Select:**

```
"{status, select, active {Active} inactive {Inactive} other {Unknown}}"
```
