import React from 'react';
import Header, { HeaderProps } from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import {
    useResourceContext,
    useShowContext,
    useTranslate,
    useResourceDefinitions,
} from 'ra-core';
import { EditButton } from '../button/EditButton';

export interface ShowHeaderProps extends Omit<HeaderProps, 'children'> {
    title?: React.ReactNode;
}

export const ShowHeader = ({ title, actions, ...props }: ShowHeaderProps) => {
    const resource = useResourceContext();
    const translate = useTranslate();
    const definitions = useResourceDefinitions();
    const { record } = useShowContext();

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
            <EditButton record={record} />
        </SpaceBetween>
    );

    return (
        <Header
            variant="h2"
            {...props}
            actions={headerActions}
        >
            {headerTitle}
        </Header>
    );
};

export default ShowHeader;
