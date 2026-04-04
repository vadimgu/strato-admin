import { ReactNode } from 'react';
import { useListContext, useTranslate } from '@strato-admin/ra-core';
import { useResourceSchema } from '../resource/SchemaRegistry';
import { useSettings } from '../settings/SettingsContext';

export interface UseBulkDeleteMetaProps {
  title?: string;
  description?: string;
  successMessage?: string | ReactNode;
  mutationMode?: 'pessimistic' | 'optimistic' | 'undoable';
}

export function useBulkDeleteMeta(props?: UseBulkDeleteMetaProps) {
  const { bulkDeleteTitle, bulkDeleteDescription, bulkDeleteSuccessMessage, mutationMode } = useResourceSchema();
  const { selectedIds } = useListContext();
  const translate = useTranslate();
  const settings = useSettings();
  const smart_count = selectedIds?.length ?? 0;

  const titleKey = props?.title ?? bulkDeleteTitle;
  const title = titleKey
    ? translate(titleKey, { smart_count, _: titleKey })
    : translate('strato.message.bulk_delete_title', {
        smart_count,
        _: '{smart_count, plural, one {Delete this item} other {Delete these # items}}',
      });

  const descKey = props?.description ?? bulkDeleteDescription;
  const description = descKey
    ? translate(descKey, { smart_count, _: descKey })
    : translate('strato.message.bulk_delete_content', {
        smart_count,
        _: '{smart_count, plural, one {Are you sure you want to delete this item?} other {Are you sure you want to delete these # items?}}',
      });

  return {
    title,
    description,
    successMessage:
      props?.successMessage ??
      bulkDeleteSuccessMessage ??
      (settings.bulkDeleteSuccessMessage as string | ReactNode | ((count: number) => ReactNode) | undefined),
    mutationMode: props?.mutationMode ?? mutationMode ?? settings.mutationMode,
  };
}
