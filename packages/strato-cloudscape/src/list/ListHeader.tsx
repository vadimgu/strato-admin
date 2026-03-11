import React from 'react';
import Header, { HeaderProps } from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useResourceContext, useListContext, useTranslate, useResourceDefinitions, useLocale } from 'ra-core';
import { BulkDeleteButton } from '../button/BulkDeleteButton';
import { CreateButton } from '../button/CreateButton';

export interface ListHeaderProps extends Omit<HeaderProps, 'children'> {
  title?: React.ReactNode;
}

export const ListHeader = ({ title, actions, ...props }: ListHeaderProps) => {
  const resource = useResourceContext();
  const translate = useTranslate();
  const definitions = useResourceDefinitions();
  const locale = useLocale();
  const { total, isPending } = useListContext();

  const headerTitle = React.useMemo(() => {
    if (title !== undefined) {
      return title;
    }
    if (!resource) {
      return '';
    }

    const definition = definitions[resource];
    const defaultLabel = definition?.options?.label
      ? translate(definition.options.label, { _: definition.options.label })
      : resource.charAt(0).toUpperCase() + resource.slice(1);

    return translate(`resources.${resource}.name`, { _: defaultLabel });
  }, [title, resource, definitions, translate, locale]);

  const counter =
    props.counter !== undefined ? props.counter : !isPending && total !== undefined ? `(${total})` : undefined;

  const headerActions = actions !== undefined ? actions : (
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

export default ListHeader;
