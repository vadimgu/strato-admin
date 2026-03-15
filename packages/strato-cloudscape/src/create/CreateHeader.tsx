import React from 'react';
import Header, { HeaderProps } from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import { useResourceContext, useTranslate, useResourceDefinitions } from 'strato-core';

export interface CreateHeaderProps extends Omit<HeaderProps, 'children'> {
  title?: React.ReactNode;
}

export const CreateHeader = ({ title, actions, ...props }: CreateHeaderProps) => {
  const resource = useResourceContext();
  const translate = useTranslate();
  const definitions = useResourceDefinitions();

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

    return translate(`resources.${resource}.name`, {
      smart_count: 1,
      _: defaultLabel,
    });
  }, [title, resource, definitions, translate]);

  const headerActions = actions || (
    <SpaceBetween direction="horizontal" size="xs">
      {/* Add default create actions here if needed */}
    </SpaceBetween>
  );

  return (
    <Header variant="h2" {...props} actions={headerActions}>
      {headerTitle}
    </Header>
  );
};

export default CreateHeader;
