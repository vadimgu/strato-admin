import React from 'react';
import Header, { HeaderProps } from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useListContext, useTranslate, useLocale } from '@strato-admin/ra-core';
import { BulkDeleteButton } from '../button/BulkDeleteButton';
import { CreateButton } from '../button/CreateButton';

export interface TableHeaderProps extends Omit<HeaderProps, 'children'> {
  title?: React.ReactNode;
}

export const TableHeader = ({ title, actions, ...props }: TableHeaderProps) => {
  const translate = useTranslate();
  const locale = useLocale();
  const { defaultTitle } = useListContext();

  const headerTitle = React.useMemo(() => {
    if (title !== undefined) {
      return typeof title === 'string' ? translate(title, { _: title }) : title;
    }
    return defaultTitle;
  }, [title, defaultTitle, translate, locale]);

  const counter = props.counter;

  const headerActions =
    actions !== undefined ? (
      actions
    ) : (
      <SpaceBetween direction="horizontal" size="xs">
        <BulkDeleteButton />
        <CreateButton />
      </SpaceBetween>
    );

  return (
    <Header variant="h2" {...props} actions={headerActions} counter={counter}>
      {headerTitle}
    </Header>
  );
};

export default TableHeader;
