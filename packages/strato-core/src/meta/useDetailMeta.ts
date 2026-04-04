import { useMemo, isValidElement, ReactNode } from 'react';
import { useShowContext, useTranslate } from '@strato-admin/ra-core';
import { useResourceSchema } from '../resource/SchemaRegistry';
import { useConstructedPageTitle } from '../resource/useConstructedPageTitle';

export interface UseDetailMetaProps {
  title?: ReactNode | ((record: any) => ReactNode);
  description?: ReactNode | ((record: any) => ReactNode);
}

export function useDetailMeta(props?: UseDetailMetaProps) {
  const { detailTitle, detailDescription, detailComponent } = useResourceSchema();
  const { record, isLoading } = useShowContext();
  const { label } = useResourceSchema();
  const constructedTitle = useConstructedPageTitle('show', label);
  const translate = useTranslate();

  const title = useMemo(() => {
    if (isLoading || !record) return '';
    const raw = props?.title ?? detailTitle ?? constructedTitle;
    if (typeof raw === 'function') return raw(record);
    if (isValidElement(raw)) return raw;
    return raw ? translate(raw as string, { _: raw }) : raw;
  }, [isLoading, record, props?.title, detailTitle, constructedTitle, translate]);

  const description = useMemo(() => {
    if (isLoading || !record) return undefined;
    const raw = props?.description ?? detailDescription;
    if (typeof raw === 'function') return raw(record);
    if (isValidElement(raw)) return raw;
    return raw ? translate(raw as string, { _: raw }) : undefined;
  }, [isLoading, record, props?.description, detailDescription, translate]);

  return {
    title,
    description,
    component: detailComponent,
  };
}
