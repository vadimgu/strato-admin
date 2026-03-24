import React from 'react';
import {
  ShowBaseProps,
  ShowContextProvider,
  useShowController,
  useResourceSchema,
} from '@strato-admin/core';
import DetailHub from './DetailHub';

export interface DetailProps extends ShowBaseProps {
  /**
   * The title of the detail view.
   */
  title?: string;
  /**
   * The description of the detail view.
   */
  description?: string;
  /**
   * Custom fields or components to display in the detail view.
   */
  children?: React.ReactNode;
  /**
   * Custom actions to display in the header.
   */
  actions?: React.ReactNode;
}

/**
 * A detail view component that displays a single record's details.
 * It uses the detailComponent defined in the schema (defaults to DetailHub)
 * to organize fields into sections.
 *
 * @example
 * <Detail>
 *   <TextField source="name" />
 *   <TextField source="description" />
 * </Detail>
 */
export const Detail = (props: DetailProps) => {
  const { children, ...rest } = props;
  const { queryOptions, detailComponent: DetailComponent = DetailHub } = useResourceSchema(props.resource);
  const controllerProps = useShowController({ queryOptions, ...rest });

  return (
    <ShowContextProvider value={controllerProps}>
      <DetailComponent {...props} />
    </ShowContextProvider>
  );
};

export default Detail;
