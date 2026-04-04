import { useMemo, isValidElement, ReactNode } from 'react';
import { useTranslate } from '@strato-admin/ra-core';
import { useResourceSchema } from '../resource/SchemaRegistry';
import { useSettings } from '../settings/SettingsContext';
import { useConstructedPageTitle } from '../resource/useConstructedPageTitle';

export interface UseCreateMetaProps {
  title?: ReactNode | ((record: any) => ReactNode);
  description?: ReactNode | ((record: any) => ReactNode);
}

export function useCreateMeta(props?: UseCreateMetaProps) {
  const { createTitle, createDescription, createSuccessMessage, createRedirect } = useResourceSchema();
  const { label } = useResourceSchema();
  const constructedTitle = useConstructedPageTitle('create', label);
  const translate = useTranslate();
  const settings = useSettings();

  const title = useMemo(() => {
    const raw = props?.title ?? createTitle ?? constructedTitle;
    if (typeof raw === 'function') return raw({});
    if (isValidElement(raw)) return raw;
    return raw ? translate(raw as string, { _: raw }) : raw;
  }, [props?.title, createTitle, constructedTitle, translate]);

  const description = useMemo(() => {
    const raw = props?.description ?? createDescription;
    if (typeof raw === 'function') return raw({});
    if (isValidElement(raw)) return raw;
    return raw ? translate(raw as string, { _: raw }) : undefined;
  }, [props?.description, createDescription, translate]);

  return {
    title,
    description,
    successMessage: createSuccessMessage,
    redirect: createRedirect !== undefined ? createRedirect : settings.createRedirect,
  };
}
