import React from 'react';
import Header, { HeaderProps } from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useListContext, useTranslate, useLocale } from '@strato-admin/ra-core';
import { BulkDeleteButton } from '../button/BulkDeleteButton';
import { CreateButton } from '../button/CreateButton';

export interface TableHeaderProps extends Pick<
  HeaderProps,
  'variant' | 'counter' | 'actions' | 'description' | 'info' | 'headingTagOverride'
> {
  title?: React.ReactNode;
}

export const TableHeader = ({
  title,
  actions,
  description,
  counter,
  info,
  variant = 'h2',
  headingTagOverride,
}: TableHeaderProps) => {
  const translate = useTranslate();
  const locale = useLocale();
  const { defaultTitle } = useListContext();

  const headerTitle = React.useMemo(() => {
    if (title !== undefined) {
      return typeof title === 'string' ? translate(title, { _: title }) : title;
    }
    return defaultTitle;
  }, [title, defaultTitle, translate, locale]);

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
    <Header
      variant={variant}
      actions={headerActions}
      counter={counter}
      description={description}
      info={info}
      headingTagOverride={headingTagOverride}
    >
      {headerTitle}
    </Header>
  );
};

export default TableHeader;
