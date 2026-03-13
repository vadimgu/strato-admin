import type { Meta, StoryObj } from '@storybook/react';
import { CreateButton } from './CreateButton';
import { withRaContext } from '../stories/RaStoryDecorator';

const meta: Meta<typeof CreateButton> = {
  title: 'Components/CreateButton',
  component: CreateButton,
  tags: ['autodocs'],
  decorators: [
    withRaContext(undefined, 'posts', {
      posts: { name: 'posts', hasCreate: true },
    }),
  ],
};

export default meta;
type Story = StoryObj<typeof CreateButton>;

export const Default: Story = {
  args: {},
};

export const CustomLabel: Story = {
  args: {
    label: 'New Post',
  },
};

export const Normal: Story = {
  args: {
    variant: 'normal',
  },
};

export const WithoutPermission: Story = {
  decorators: [
    withRaContext(undefined, 'posts', {
      posts: { name: 'posts', hasCreate: false },
    }),
  ],
  args: {},
};
