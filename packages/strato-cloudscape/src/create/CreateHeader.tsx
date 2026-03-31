import React from 'react';
import Header, { HeaderProps } from '@cloudscape-design/components/header';
import { useCreateContext, useTranslate } from '@strato-admin/ra-core';

export interface CreateHeaderProps extends Omit<HeaderProps, 'children'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export const CreateHeader = ({ title, actions, ...props }: CreateHeaderProps) => {
  const translate = useTranslate();
  const { defaultTitle } = useCreateContext();

  const headerTitle = React.useMemo(() => {
    if (title !== undefined) {
      return typeof title === 'string' ? translate(title, { _: title }) : title;
    }
    return defaultTitle;
  }, [title, defaultTitle, translate]);

  const headerActions = actions ?? null;

  return (
    <Header variant="h2" {...props} actions={headerActions}>
      {headerTitle}
    </Header>
  );
};

export default CreateHeader;
