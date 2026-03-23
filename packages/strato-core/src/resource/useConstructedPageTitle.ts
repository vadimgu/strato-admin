import { useResourceContext, useLocale, useTranslate } from '@strato-admin/ra-core';
import { humanize, singularize, pluralize } from 'inflection';

export function useConstructedPageTitle(type: 'create' | 'edit' | 'show' | 'list', customLabel?: string): string {
  const resource = useResourceContext();
  const locale = useLocale();
  const translate = useTranslate();

  const baseName = customLabel || resource || '';
  if (!baseName) return '';

  if (!locale.startsWith('en')) {
    switch (type) {
      case 'create':
        return translate('strato.pages.create.title');
      case 'edit':
        return translate('strato.pages.edit.title');
      case 'show':
        return translate('strato.pages.show.title');
      case 'list':
        return baseName;
      default:
        return baseName;
    }
    return translate(`strato.pages.${type}.title`, { _: `strato.pages.${type}.title` });
  }

  const humanized = humanize(baseName);
  const singular = singularize(humanized);
  const plural = pluralize(humanized);

  switch (type) {
    case 'create':
      return `Create ${singular}`;
    case 'edit':
      return `Edit ${singular}`;
    case 'show':
      return `${singular} Details`;
    case 'list':
      return plural;
    default:
      return singular;
  }
}
