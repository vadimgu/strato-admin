import React from 'react';
import Header, { HeaderProps } from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useEditContext, useTranslate } from '@strato-admin/ra-core';
import { DeleteButton } from '../button/DeleteButton';

export interface EditHeaderProps extends Omit<HeaderProps, 'children'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export const EditHeader = ({ title, actions, ...props }: EditHeaderProps) => {
  const translate = useTranslate();
  const { defaultTitle } = useEditContext();

  const headerTitle = React.useMemo(() => {
    if (title !== undefined) {
      return typeof title === 'string' ? translate(title, { _: title }) : title;
    }
    return defaultTitle;
  }, [title, defaultTitle, translate]);

  const headerActions = actions || (
    <SpaceBetween direction="horizontal" size="xs">
      <DeleteButton />
    </SpaceBetween>
  );

  return (
    <Header variant="h2" {...props} actions={headerActions}>
      {headerTitle}
    </Header>
  );
};

export default EditHeader;
