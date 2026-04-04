import React from 'react';
import Header, { HeaderProps } from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useShowContext, useTranslate } from '@strato-admin/ra-core';
import { EditButton } from '../button/EditButton';

export interface DetailHeaderProps extends Pick<
  HeaderProps,
  'variant' | 'counter' | 'actions' | 'description' | 'info' | 'headingTagOverride'
> {
  title?: React.ReactNode;
}

/** @deprecated Use DetailHeader instead */
export type ShowHeaderProps = DetailHeaderProps;

/** @deprecated Use DetailHeader instead */
export const ShowHeader = (props: DetailHeaderProps) => <DetailHeader {...props} />;

export const DetailHeader = ({
  title,
  actions,
  description,
  counter,
  info,
  variant = 'h2',
  headingTagOverride,
}: DetailHeaderProps) => {
  const translate = useTranslate();
  const { record, defaultTitle } = useShowContext();

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
      <EditButton record={record} variant="primary" />
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

export default DetailHeader;
