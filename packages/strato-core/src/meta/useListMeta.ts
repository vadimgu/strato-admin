import { useMemo, isValidElement, ReactNode } from 'react';
import { useTranslate } from '@strato-admin/ra-core';
import { useResourceSchema } from '../resource/SchemaRegistry';
import { useSettings } from '../settings/SettingsContext';
import { useConstructedPageTitle } from '../resource/useConstructedPageTitle';

export interface UseListMetaProps {
  title?: ReactNode | ((record: any) => ReactNode);
  description?: ReactNode | ((record: any) => ReactNode);
}

export function useListMeta(props?: UseListMetaProps) {
  const { listTitle, listDescription, listComponent, perPage } = useResourceSchema();
  const { label } = useResourceSchema();
  const constructedTitle = useConstructedPageTitle('list', label);
  const translate = useTranslate();
  const settings = useSettings();

  const title = useMemo(() => {
    const raw = props?.title ?? listTitle ?? constructedTitle;
    if (typeof raw === 'function') return raw({});
    if (isValidElement(raw)) return raw;
    return raw ? translate(raw as string, { _: raw }) : raw;
  }, [props?.title, listTitle, constructedTitle, translate]);

  const description = useMemo(() => {
    const raw = props?.description ?? listDescription;
    if (typeof raw === 'function') return raw({});
    if (isValidElement(raw)) return raw;
    return raw ? translate(raw as string, { _: raw }) : undefined;
  }, [props?.description, listDescription, translate]);

  return {
    title,
    description,
    component: listComponent,
    perPage: perPage ?? settings.listPageSize,
    pageSizes: settings.listPageSizes,
    pageSizeLabel: settings.listPageSizeLabel,
  };
}
