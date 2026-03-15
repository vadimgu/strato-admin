import type { Meta, StoryObj } from '@storybook/react';
import TextField from './TextField';
import { withRaContext } from '../stories/RaStoryDecorator';

const meta: Meta<typeof TextField> = {
  title: 'Fields/TextField',
  component: TextField,
  tags: ['autodocs'],
  decorators: [withRaContext({ id: 1, title: 'Sample Title', description: 'This is a description', empty: '' })],
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Basic: Story = {
  args: {
    source: 'title',
  },
};

export const WithDescription: Story = {
  args: {
    source: 'description',
  },
};

export const Empty: Story = {
  args: {
    source: 'empty',
  },
};

export const WithEmptyText: Story = {
  args: {
    source: 'missing_field',
    emptyText: 'No value provided',
  },
};

export const WithLink: Story = {
  args: {
    source: 'title',
    link: 'show',
  },
};
