import { useMemo, isValidElement, ReactNode } from 'react';
import { useEditContext, useTranslate } from '@strato-admin/ra-core';
import { useResourceSchema } from '../resource/SchemaRegistry';
import { useSettings } from '../settings/SettingsContext';
import { useConstructedPageTitle } from '../resource/useConstructedPageTitle';

export interface UseEditMetaProps {
  title?: ReactNode | ((record: any) => ReactNode);
  description?: ReactNode | ((record: any) => ReactNode);
}

export function useEditMeta(props?: UseEditMetaProps) {
  const { editTitle, editDescription, editSuccessMessage, editRedirect, mutationMode } = useResourceSchema();
  const { record, isLoading } = useEditContext();
  const { label } = useResourceSchema();
  const constructedTitle = useConstructedPageTitle('edit', label);
  const translate = useTranslate();
  const settings = useSettings();

  const title = useMemo(() => {
    if (isLoading || !record) return '';
    const raw = props?.title ?? editTitle ?? constructedTitle;
    if (typeof raw === 'function') return raw(record);
    if (isValidElement(raw)) return raw;
    return raw ? translate(raw as string, { _: raw }) : raw;
  }, [isLoading, record, props?.title, editTitle, constructedTitle, translate]);

  const description = useMemo(() => {
    if (isLoading || !record) return undefined;
    const raw = props?.description ?? editDescription;
    if (typeof raw === 'function') return raw(record);
    if (isValidElement(raw)) return raw;
    return raw ? translate(raw as string, { _: raw }) : undefined;
  }, [isLoading, record, props?.description, editDescription, translate]);

  return {
    title,
    description,
    successMessage: editSuccessMessage ?? (settings.editSuccessMessage as string | ReactNode | undefined),
    redirect: editRedirect !== undefined ? editRedirect : settings.editRedirect,
    mutationMode: mutationMode ?? settings.mutationMode,
  };
}
