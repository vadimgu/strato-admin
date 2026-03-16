import { describe, it, expect } from 'vitest';
import { icuI18nProvider } from './index';

describe('icuI18nProvider', () => {
  const getMessages = (locale: string) => {
    if (locale === 'en') {
      return {
        simple: 'Hello',
        withParam: 'Hello {name}',
        plural: 'You have {count, plural, =0 {no messages} one {1 message} other {# messages}}.',
        'nested.key': 'Nested value',
      };
    }
    if (locale === 'fr') {
      return {
        simple: 'Bonjour',
      };
    }
    return {};
  };

  it('translates simple keys', () => {
    const i18n = icuI18nProvider(getMessages, 'en');
    expect(i18n.translate('simple')).toBe('Hello');
  });

  it('translates keys with parameters', () => {
    const i18n = icuI18nProvider(getMessages, 'en');
    expect(i18n.translate('withParam', { name: 'World' })).toBe('Hello World');
  });

  it('translates plural keys', () => {
    const i18n = icuI18nProvider(getMessages, 'en');
    expect(i18n.translate('plural', { count: 0 })).toBe('You have no messages.');
    expect(i18n.translate('plural', { count: 1 })).toBe('You have 1 message.');
    expect(i18n.translate('plural', { count: 2 })).toBe('You have 2 messages.');
  });

  it('translates keys with dots (flat)', () => {
    const i18n = icuI18nProvider(getMessages, 'en');
    expect(i18n.translate('nested.key')).toBe('Nested value');
  });

  it('uses fallback if key is missing', () => {
    const i18n = icuI18nProvider(getMessages, 'en');
    expect(i18n.translate('missing', { _: 'Fallback' })).toBe('Fallback');
  });

  it('returns key if missing and no fallback provided', () => {
    const i18n = icuI18nProvider(getMessages, 'en');
    expect(i18n.translate('missing')).toBe('missing');
  });

  it('changes locale and updates translations', async () => {
    const i18n = icuI18nProvider(getMessages, 'en');
    expect(i18n.getLocale()).toBe('en');
    expect(i18n.translate('simple')).toBe('Hello');

    await i18n.changeLocale('fr');
    expect(i18n.getLocale()).toBe('fr');
    expect(i18n.translate('simple')).toBe('Bonjour');
  });

  it('clears formatters cache when locale changes', async () => {
    const i18n = icuI18nProvider(getMessages, 'en');
    expect(i18n.translate('simple')).toBe('Hello');

    await i18n.changeLocale('fr');
    // If cache wasn't cleared, it would still return "Hello" (as it's keyed by key and locale but let's be sure)
    expect(i18n.translate('simple')).toBe('Bonjour');
  });
});
