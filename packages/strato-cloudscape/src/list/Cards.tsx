import React from 'react';
import CloudscapeCards, { CardsProps } from '@cloudscape-design/components/cards';
import Pagination from '@cloudscape-design/components/pagination';
import TextFilter from '@cloudscape-design/components/text-filter';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import { RaRecord, RecordContextProvider, useTranslateLabel, useTranslate } from '@strato-admin/ra-core';
import { useResourceSchema, useSettings } from '@strato-admin/core';
import { useCollection } from '../collection-hooks';
import { useSchemaFields } from '../hooks/useSchemaFields';
import KeyValuePairs from '../detail/KeyValuePairs';
import TableHeader from './TableHeader';

export interface ListCardsProps<T extends RaRecord = any>
  extends Omit<CardsProps<T>, 'items' | 'cardDefinition' | 'preferences'> {
  renderItem?: (item: T) => React.ReactNode;
  include?: string[];
  exclude?: string[];
  children?: React.ReactNode;
  title?: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  selectionType?: 'single' | 'multi';
  /**
   * Whether to enable text filtering.
   * @default true
   */
  filtering?: boolean;
  /**
   * Placeholder text for the filter input.
   * @default "Search..."
   */
  filteringPlaceholder?: string;
  /**
   * Options for the page size selector.
   */
  pageSizeOptions?: ReadonlyArray<{ value: number; label?: string }>;
  /**
   * Whether to show the preferences button or custom preferences content.
   * @default true
   */
  preferences?: boolean | React.ReactNode;
}

export const ListCards = <T extends RaRecord = any>({
  renderItem,
  include,
  exclude,
  children,
  title,
  description,
  actions,
  selectionType,
  filtering = true,
  filteringPlaceholder,
  pageSizeOptions,
  preferences = true,
  ...props
}: ListCardsProps<T>) => {
  const translate = useTranslate();
  const { listPageSizes, listPageSizeLabel } = useSettings();

  const resolvedPageSizeOptions = pageSizeOptions ?? (
    listPageSizes && listPageSizeLabel
      ? listPageSizes.map((value) => ({ value, label: listPageSizeLabel(value) }))
      : undefined
  );
  const translateLabel = useTranslateLabel();
  const {
    resource,
    label: schemaLabel,
    definition,
  } = useResourceSchema();

  const { getListFields } = useSchemaFields();

  const finalSelectionType = selectionType ?? (definition?.options?.canDelete ? 'multi' : undefined);

  const finalChildren = React.useMemo(
    () => getListFields(children, { include, exclude }),
    [getListFields, children, include, exclude],
  );

  const visibleContentOptions = React.useMemo(() => {
    const options: { id: string; label: string }[] = [];
    finalChildren.forEach((child, index) => {
      if (!React.isValidElement(child)) return;
      const { source, label } = child.props as any;
      const headerLabel = translateLabel({ label, resource, source });
      if (typeof headerLabel === 'string') {
        options.push({
          id: source || `section-${index}`,
          label: headerLabel,
        });
      }
    });
    return options;
  }, [finalChildren, resource, translateLabel]);

  const { items, paginationProps, collectionProps, filterProps, preferencesProps } = useCollection<T>({
    preferences: {
      pageSizeOptions: resolvedPageSizeOptions,
      visibleContentOptions: visibleContentOptions.length > 0 ? visibleContentOptions : undefined,
    },
  });

  const displayedChildren = React.useMemo(() => {
    const { visibleContent } = preferencesProps.preferences;
    if (!visibleContent) return finalChildren;

    return finalChildren.filter((child) => {
      if (!React.isValidElement(child)) return true;
      const { source } = child.props as any;
      // If the child doesn't have a source, we don't know how to toggle it, so we keep it.
      if (!source) return true;
      // If it's not in the options, it's not toggleable, so we keep it.
      if (!visibleContentOptions.some((opt) => opt.id === source)) return true;

      return visibleContent.includes(source);
    });
  }, [finalChildren, preferencesProps.preferences.visibleContent, visibleContentOptions]);

  const defaultRenderItem = (_item: T) => <KeyValuePairs>{displayedChildren}</KeyValuePairs>;

  const finalRenderItem = renderItem || defaultRenderItem;

  const cardDefinition: CardsProps.CardDefinition<T> = {
    sections: [
      {
        id: 'main',
        content: (item: T) => (
          <RecordContextProvider value={item}>{finalRenderItem(item) as any}</RecordContextProvider>
        ),
      },
    ],
  };

  const cardsHeader = React.useMemo(() => {
    if (React.isValidElement(title)) {
      return title;
    }
    const finalTitle = title !== undefined ? title : schemaLabel;
    return <TableHeader title={finalTitle} description={description} actions={actions} />;
  }, [title, description, actions, schemaLabel]);

  return (
    <CloudscapeCards
      {...collectionProps}
      {...props}
      items={items || []}
      cardDefinition={cardDefinition}
      pagination={<Pagination {...paginationProps} />}
      header={cardsHeader}
      selectionType={finalSelectionType}
      filter={filtering && <TextFilter {...filterProps} filteringPlaceholder={filteringPlaceholder} />}
      preferences={
        preferences === true || resolvedPageSizeOptions ? (
          <CollectionPreferences
            {...preferencesProps}
            pageSizePreference={
              resolvedPageSizeOptions
                ? {
                    options: resolvedPageSizeOptions,
                  }
                : undefined
            }
            visibleContentPreference={
              visibleContentOptions.length > 0
                ? {
                    title: translate('strato.action.select_sections', { _: 'Select visible sections' }),
                    options: [
                      {
                        label: translate('strato.action.select_sections', { _: 'Select visible sections' }),
                        options: visibleContentOptions,
                      },
                    ],
                  }
                : undefined
            }
          />
        ) : React.isValidElement(preferences) ? (
          preferences
        ) : undefined
      }
    />
  );
};

export const Cards = ListCards;

export default ListCards;
