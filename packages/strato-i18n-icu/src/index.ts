import { IntlMessageFormat } from 'intl-messageformat';
import type { I18nProvider } from 'ra-core';

export type TranslationMessages = Record<string, any>;

// Helper to get nested value
const getNestedValue = (obj: any, path: string) => {
    if (!obj || typeof obj !== 'object') return undefined;
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
        if (value === undefined || value === null) return undefined;
        value = value[key];
    }
    return value;
};

export const icuI18nProvider = (
    getMessages: (locale: string) => TranslationMessages | Promise<TranslationMessages>,
    initialLocale: string = 'en',
    availableLocales: any[] = [{ locale: 'en', name: 'English' }]
): I18nProvider => {
    let locale = initialLocale;
    let messages = getMessages(initialLocale);
    const formatters = new Map<string, IntlMessageFormat>();

    if (messages instanceof Promise) {
        throw new Error(
            `The i18nProvider returned a Promise for the messages of the default locale (${initialLocale}). Please update your i18nProvider to return the messages of the default locale in a synchronous way.`
        );
    }

    return {
        translate: (key: string, options: any = {}) => {
            const { _, ...values } = options;
            let message = getNestedValue(messages, key);

            if (message === undefined) {
                return _ !== undefined ? _ : key;
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
                    return _ !== undefined ? _ : key;
                }
            }

            try {
                return formatter.format(values) as string;
            } catch (error) {
                console.error(`Error formatting message for key "${key}":`, error);
                return _ !== undefined ? _ : key;
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
