import type { Meta, StoryObj } from '@storybook/react';
import { BulkDeleteButton } from './BulkDeleteButton';
import { withRaContext } from '../stories/RaStoryDecorator';

const meta: Meta<typeof BulkDeleteButton> = {
  title: 'Components/BulkDeleteButton',
  component: BulkDeleteButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BulkDeleteButton>;

export const Default: Story = {
  decorators: [
    withRaContext(
      undefined,
      'posts',
      { posts: { name: 'posts' } },
      {
        selectedIds: [1, 2, 3],
        resource: 'posts',
      },
    ),
  ],
  args: {},
};

export const Disabled: Story = {
  decorators: [
    withRaContext(
      undefined,
      'posts',
      { posts: { name: 'posts' } },
      {
        selectedIds: [],
        resource: 'posts',
      },
    ),
  ],
  args: {},
};

export const Loading: Story = {
  decorators: [
    withRaContext(
      undefined,
      'posts',
      { posts: { name: 'posts' } },
      {
        selectedIds: [1, 2, 3],
        resource: 'posts',
      },
    ),
  ],
  args: {
    label: 'Deleting...',
  },
};
