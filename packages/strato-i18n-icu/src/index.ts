import { IntlMessageFormat } from 'intl-messageformat';
import type { I18nProvider, TranslationMessages } from 'ra-core';

export const icuI18nProvider = (
  getMessages: (locale: string) => TranslationMessages | Promise<TranslationMessages>,
  initialLocale: string = 'en',
  availableLocales: any[] = [{ locale: 'en', name: 'English' }],
): I18nProvider => {
  let locale = initialLocale;
  let messages = getMessages(initialLocale);
  const formatters = new Map<string, IntlMessageFormat>();

  if (messages instanceof Promise) {
    throw new Error(
      `The i18nProvider returned a Promise for the messages of the default locale (${initialLocale}). Please update your i18nProvider to return the messages of the default locale in a synchronous way.`,
    );
  }

  return {
    translate: (key: string, options: any = {}) => {
      const { _: defaultMessage, ...values } = options;

      const message = (messages as any)[key];

      if (message === undefined) {
        return defaultMessage !== undefined ? defaultMessage : key;
      }

      if (typeof message !== 'string') {
        return key;
      }

      const cacheKey = `${locale}_${key}`;
      let formatter = formatters.get(cacheKey);

      if (!formatter) {
        try {
          formatter = new IntlMessageFormat(message, locale);
          formatters.set(cacheKey, formatter);
        } catch (error) {
          console.error(`Error parsing message for key "${key}":`, error);
          return defaultMessage !== undefined ? defaultMessage : key;
        }
      }

      try {
        return formatter.format(values) as string;
      } catch (error) {
        console.error(`Error formatting message for key "${key}":`, error);
        return defaultMessage !== undefined ? defaultMessage : key;
      }
    },
    changeLocale: (newLocale: string) => {
      const newMessages = getMessages(newLocale);
      if (newMessages instanceof Promise) {
        return newMessages.then((resolvedMessages) => {
          locale = newLocale;
          messages = resolvedMessages;
          formatters.clear();
        });
      } else {
        locale = newLocale;
        messages = newMessages;
        formatters.clear();
        return Promise.resolve();
      }
    },
    getLocale: () => locale,
    getLocales: () => availableLocales,
  };
};
