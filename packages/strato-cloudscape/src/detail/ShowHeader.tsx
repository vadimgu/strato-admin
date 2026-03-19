import React from 'react';
import Header, { HeaderProps } from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useShowContext, useTranslate } from '@strato-admin/core';
import { EditButton } from '../button/EditButton';

export interface ShowHeaderProps extends Omit<HeaderProps, 'children'> {
  title?: React.ReactNode;
}

export const ShowHeader = ({ title, actions, ...props }: ShowHeaderProps) => {
  const translate = useTranslate();
  const { record, defaultTitle } = useShowContext();

  const headerTitle = React.useMemo(() => {
    if (title !== undefined) {
      return typeof title === 'string' ? translate(title, { _: title }) : title;
    }
    return defaultTitle;
  }, [title, defaultTitle, translate]);

  const headerActions = actions || (
    <SpaceBetween direction="horizontal" size="xs">
      <EditButton record={record} />
    </SpaceBetween>
  );

  return (
    <Header variant="h2" {...props} actions={headerActions}>
      {headerTitle}
    </Header>
  );
};

export default ShowHeader;
