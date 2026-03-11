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
      let finalKey = key;
      let finalOptions = options;

      // Handle React Admin's special validation error format
      if (typeof key === 'string' && key.startsWith('@@react-admin@@')) {
        try {
          const parsed = JSON.parse(key.substring(15)); // 15 is the length of '@@react-admin@@'
          if (typeof parsed === 'object' && parsed !== null) {
            finalKey = parsed.message;
            finalOptions = { ...options, ...parsed.args };
          } else {
            finalKey = parsed;
          }
        } catch (e) {
          // Fallback to original key if parsing fails
        }
      }

      const { _: defaultMessage, ...values } = finalOptions;

      const message = (messages as any)[finalKey];

      if (message === undefined) {
        return defaultMessage !== undefined ? defaultMessage : finalKey;
      }

      if (typeof message !== 'string') {
        return finalKey;
      }

      const cacheKey = `${locale}_${finalKey}`;
      let formatter = formatters.get(cacheKey);

      if (!formatter) {
        try {
          formatter = new IntlMessageFormat(message, locale);
          formatters.set(cacheKey, formatter);
        } catch (error) {
          console.error(`Error parsing message for key "${finalKey}":`, error);
          return defaultMessage !== undefined ? defaultMessage : finalKey;
        }
      }

      try {
        return formatter.format(values) as string;
      } catch (error) {
        console.error(`Error formatting message for key "${finalKey}":`, error);
        return defaultMessage !== undefined ? defaultMessage : finalKey;
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
