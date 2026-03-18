import React from 'react';
import Header, { HeaderProps } from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useResourceContext, useEditContext, useTranslate, useResourceDefinitions } from '@strato-admin/core';

export interface EditHeaderProps extends Omit<HeaderProps, 'children'> {
  title?: React.ReactNode;
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
      {/* Add default edit actions here if needed */}
    </SpaceBetween>
  );

  return (
    <Header variant="h2" {...props} actions={headerActions}>
      {headerTitle}
    </Header>
  );
};

export default EditHeader;
