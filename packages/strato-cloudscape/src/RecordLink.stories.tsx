import type { Meta, StoryObj } from '@storybook/react';
import RecordLink from './RecordLink';
import { withRaContext } from './stories/RaStoryDecorator';

const meta: Meta<typeof RecordLink> = {
  title: 'Components/RecordLink',
  component: RecordLink,
  tags: ['autodocs'],
  decorators: [withRaContext({ id: 123, name: 'Sample Record' }, 'samples')],
};

export default meta;
type Story = StoryObj<typeof RecordLink>;

export const Default: Story = {
  args: {
    link: 'edit',
    children: 'Edit this record',
  },
};

export const Show: Story = {
  args: {
    link: 'show',
    children: 'Show details',
  },
};

export const CustomString: Story = {
  args: {
    link: '/custom-path/123',
    children: 'Go to custom path',
  },
};

export const FunctionLink: Story = {
  args: {
    link: (record) => `/records/${record.id}/manage`,
    children: 'Manage Record',
  },
};

export const NoLink: Story = {
  args: {
    link: false,
    children: 'Plain text (link=false)',
  },
};

export const ResourceOverride: Story = {
  args: {
    link: 'edit',
    resource: 'other-resource',
    children: 'Edit other-resource',
  },
};
