import React from 'react';
import Header, { HeaderProps } from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useEditContext, useTranslate } from '@strato-admin/ra-core';
import { DeleteButton } from '../button/DeleteButton';

export interface EditHeaderProps extends Pick<
  HeaderProps,
  'variant' | 'counter' | 'actions' | 'description' | 'info' | 'headingTagOverride'
> {
  title?: React.ReactNode;
}

export const EditHeader = ({
  title,
  actions,
  description,
  counter,
  info,
  variant = 'h2',
  headingTagOverride,
}: EditHeaderProps) => {
  const translate = useTranslate();
  const { defaultTitle } = useEditContext();

  const headerTitle = React.useMemo(() => {
    if (title !== undefined) {
      return typeof title === 'string' ? translate(title, { _: title }) : title;
    }
    return defaultTitle;
  }, [title, defaultTitle, translate]);

  const headerDescription = React.useMemo(() => {
    return typeof description === 'string' ? translate(description, { _: description }) : description;
  }, [description, translate]);

  const headerActions = actions || (
    <SpaceBetween direction="horizontal" size="xs">
      <DeleteButton />
    </SpaceBetween>
  );

  return (
    <Header
      variant={variant}
      actions={headerActions}
      description={headerDescription}
      counter={counter}
      info={info}
      headingTagOverride={headingTagOverride}
    >
      {headerTitle}
    </Header>
  );
};

export default EditHeader;
