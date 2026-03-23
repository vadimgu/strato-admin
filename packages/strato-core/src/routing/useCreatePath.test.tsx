import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCreatePath } from './useCreatePath';
import { Identifier } from '@strato-admin/ra-core';

describe('useCreatePath (Strato)', () => {
  const UseCreatePath = ({ resource, type, id }: { resource: string; type: any; id?: Identifier }) => {
    const createPath = useCreatePath();
    const path = createPath({ resource, type, id });
    return <div>{path}</div>;
  };

  it('creates links for list views', () => {
    render(<UseCreatePath resource="posts" type="list" />);
    screen.getByText('/posts');
  });

  it('creates links for create views', () => {
    render(<UseCreatePath resource="posts" type="create" />);
    screen.getByText('/posts/create');
  });

  it('creates links for edit views using the new scheme', () => {
    render(<UseCreatePath resource="posts" type="edit" id="1234" />);
    screen.getByText('/posts/1234/edit');
  });

  it('creates links for show views using the new scheme (no suffix)', () => {
    render(<UseCreatePath resource="posts" type="show" id="1234" />);
    screen.getByText('/posts/1234');
  });

  it('removes double slashes', () => {
    render(<UseCreatePath resource="/posts" type="edit" id="1234" />);
    screen.getByText('/posts/1234/edit');
  });
});
