import React from 'react';
import CloudscapeCards, { CardsProps } from '@cloudscape-design/components/cards';
import Pagination from '@cloudscape-design/components/pagination';
import { RaRecord, RecordContextProvider } from 'ra-core';
import { useCollection } from '../collection-hooks';

export interface ListCardsProps<T extends RaRecord = any> extends Omit<CardsProps<T>, 'items'> {
    renderItem: (item: T) => React.ReactNode;
}

export const ListCards = <T extends RaRecord = any>({
    renderItem,
    ...props
}: ListCardsProps<T>) => {
    const { items, paginationProps, collectionProps } = useCollection<T>({
        filtering: {},
        pagination: {},
        sorting: {},
    });

    return (
        <CloudscapeCards
            {...collectionProps}
            {...props}
            items={items || []}
            renderItem={(item: T) => (
                <RecordContextProvider value={item}>
                    {renderItem(item)}
                </RecordContextProvider>
            )}
            pagination={<Pagination {...paginationProps} />}
        />
    );
};

export const Cards = ListCards;

export default ListCards;
