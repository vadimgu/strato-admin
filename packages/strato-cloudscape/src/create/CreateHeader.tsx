import React from 'react';
import Header, { HeaderProps } from '@cloudscape-design/components/header';
import { useCreateContext, useTranslate } from '@strato-admin/ra-core';

export interface CreateHeaderProps extends Pick<
  HeaderProps,
  'variant' | 'counter' | 'actions' | 'description' | 'info' | 'headingTagOverride'
> {
  title?: React.ReactNode;
}

export const CreateHeader = ({
  title,
  actions,
  description,
  counter,
  info,
  variant = 'h2',
  headingTagOverride,
}: CreateHeaderProps) => {
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
    <Header
      variant={variant}
      actions={headerActions}
      description={description}
      counter={counter}
      info={info}
      headingTagOverride={headingTagOverride}
    >
      {headerTitle}
    </Header>
  );
};

export default CreateHeader;
