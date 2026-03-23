import * as React from 'react';
import { ComponentType, isValidElement } from 'react';
import { isValidElementType } from 'react-is';

import {
  ResourceProps,
  ResourceContextProvider,
  RestoreScrollPosition,
  useRouterProvider,
  Resource as RaResource,
} from '@strato-admin/ra-core';

/**
 * Strato version of Resource that implements the new routing scheme:
 * - Edit: /:id/edit
 * - Detail (Show): /:id (no suffix)
 *
 * This allows for nested resources to be defined under /:id/:subresource
 * without conflicting with the standard 'show' action.
 */
export const Resource = (props: ResourceProps) => {
  const { create, edit, list, name, show } = props;
  const { Route, Routes } = useRouterProvider();

  return (
    <ResourceContextProvider value={name}>
      <Routes>
        {create && <Route path="create/*" element={getElement(create)} />}
        {edit && <Route path=":id/edit/*" element={getElement(edit)} />}
        {props.children}
        {show && <Route path=":id/*" element={getElement(show)} />}
        {list && (
          <Route
            path="/*"
            element={
              <RestoreScrollPosition storeKey={`${name}.list.scrollPosition`}>
                {getElement(list)}
              </RestoreScrollPosition>
            }
          />
        )}
      </Routes>
    </ResourceContextProvider>
  );
};

const getElement = (ElementOrComponent: ComponentType<any> | React.ReactNode) => {
  if (isValidElement(ElementOrComponent)) {
    return ElementOrComponent;
  }

  if (isValidElementType(ElementOrComponent)) {
    const Element = ElementOrComponent as ComponentType<any>;
    return <Element />;
  }

  return null;
};

Resource.raName = 'Resource';

// We must delegate to ra-core's registerResource so that the Admin component
// can correctly discover and register the resource.
Resource.registerResource = (RaResource as any).registerResource;
