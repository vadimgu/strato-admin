import { ReactNode } from 'react';
import { useTranslate } from '@strato-admin/ra-core';
import { useResourceSchema } from '../resource/SchemaRegistry';
import { useSettings } from '../settings/SettingsContext';

export interface UseDeleteMetaProps {
  title?: string;
  description?: string;
  successMessage?: string | ReactNode;
  mutationMode?: 'pessimistic' | 'optimistic' | 'undoable';
}

export function useDeleteMeta(props?: UseDeleteMetaProps) {
  const { deleteTitle, deleteDescription, deleteSuccessMessage, mutationMode } = useResourceSchema();
  const translate = useTranslate();
  const settings = useSettings();

  const titleKey = props?.title ?? deleteTitle;
  const title = titleKey
    ? translate(titleKey, { _: titleKey })
    : translate('strato.message.delete_title', { _: 'Delete this item' });

  const descKey = props?.description ?? deleteDescription;
  const description = descKey
    ? translate(descKey, { _: descKey })
    : translate('strato.message.delete_content', { _: 'Are you sure you want to delete this item?' });

  return {
    title,
    description,
    successMessage:
      props?.successMessage ??
      deleteSuccessMessage ??
      (settings.deleteSuccessMessage as string | ReactNode | undefined),
    mutationMode: props?.mutationMode ?? mutationMode ?? settings.mutationMode,
  };
}
