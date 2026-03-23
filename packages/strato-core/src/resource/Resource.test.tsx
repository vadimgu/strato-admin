import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  TestMemoryRouter,
  CoreAdminContext,
  useRouterProvider,
} from '@strato-admin/ra-core';
import { Resource } from './Resource';

const List = () => <div>List</div>;
const Create = () => <div>Create</div>;
const Edit = () => <div>Edit</div>;
const Show = () => <div>Show</div>;
const Nested = () => <div>Nested</div>;

const ResourceTestWrapper = ({ initialEntries, children }: { initialEntries: string[], children: React.ReactNode }) => {
  return (
    <TestMemoryRouter initialEntries={initialEntries}>
        <CoreAdminContext>
            <Wrapper path="/posts/*">
                {children}
            </Wrapper>
        </CoreAdminContext>
    </TestMemoryRouter>
  );
};

const Wrapper = ({ path, children }: { path: string, children: React.ReactNode }) => {
    const { Route, Routes } = useRouterProvider();
    return (
        <Routes>
            <Route path={path} element={children} />
        </Routes>
    );
}

describe('Resource (Strato)', () => {
  it('renders the list view at the base path', async () => {
    render(
      <ResourceTestWrapper initialEntries={['/posts']}>
        <Resource name="posts" list={List} />
      </ResourceTestWrapper>
    );
    await screen.findByText('List');
  });

  it('renders the create view at /create', async () => {
    render(
      <ResourceTestWrapper initialEntries={['/posts/create']}>
        <Resource name="posts" create={Create} />
      </ResourceTestWrapper>
    );
    await screen.findByText('Create');
  });

  it('renders the edit view at /:id/edit', async () => {
    render(
      <ResourceTestWrapper initialEntries={['/posts/123/edit']}>
        <Resource name="posts" edit={Edit} />
      </ResourceTestWrapper>
    );
    await screen.findByText('Edit');
  });

  it('renders the show view at /:id (base path)', async () => {
    render(
      <ResourceTestWrapper initialEntries={['/posts/123']}>
        <Resource name="posts" show={Show} />
      </ResourceTestWrapper>
    );
    await screen.findByText('Show');
  });

  it('renders nested resources before the base detail view', async () => {
    const NestedResource = () => {
        const { Route } = useRouterProvider();
        return <Resource name="posts" show={Show}>
            <Route path=":id/comments" element={<Nested />} />
        </Resource>;
    };

    render(
      <ResourceTestWrapper initialEntries={['/posts/123/comments']}>
        <NestedResource />
      </ResourceTestWrapper>
    );
    await screen.findByText('Nested');
    expect(screen.queryByText('Show')).toBeNull();
  });
});
