import React from 'react';
import CloudscapeCards, { CardsProps } from '@cloudscape-design/components/cards';
import Pagination from '@cloudscape-design/components/pagination';
import { RaRecord, RecordContextProvider, useFieldSchema } from '@strato-admin/core';
import { useCollection } from '../collection-hooks';
import KeyValuePairs from '../detail/KeyValuePairs';

export interface ListCardsProps<T extends RaRecord = any> extends Omit<CardsProps<T>, 'items' | 'cardDefinition'> {
  renderItem?: (item: T) => React.ReactNode;
  include?: string[];
  exclude?: string[];
}

export const ListCards = <T extends RaRecord = any>({ 
  renderItem, 
  include,
  exclude,
  ...props 
}: ListCardsProps<T>) => {
  const { items, paginationProps, collectionProps } = useCollection<T>({
    filtering: {},
    pagination: {},
    sorting: {},
  });

  const schemaChildren = useFieldSchema();

  const defaultRenderItem = (_item: T) => (
    <KeyValuePairs include={include} exclude={exclude}>
      {schemaChildren}
    </KeyValuePairs>
  );

  const finalRenderItem = renderItem || defaultRenderItem;

  const cardDefinition: CardsProps.CardDefinition<T> = {
    sections: [
      {
        id: 'main',
        content: (item: T) => <RecordContextProvider value={item}>{finalRenderItem(item) as any}</RecordContextProvider>,
      },
    ],
  };

  return (
    <CloudscapeCards
      {...collectionProps}
      {...props}
      items={items || []}
      cardDefinition={cardDefinition}
      pagination={<Pagination {...paginationProps} />}
    />
  );
};

export const Cards = ListCards;

export default ListCards;
