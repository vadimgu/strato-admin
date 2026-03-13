import type { Meta, StoryObj } from '@storybook/react';
import { EditButton } from './EditButton';
import { withRaContext } from '../stories/RaStoryDecorator';

const meta: Meta<typeof EditButton> = {
  title: 'Components/EditButton',
  component: EditButton,
  tags: ['autodocs'],
  decorators: [withRaContext({ id: 123, title: 'Sample Record' }, 'posts')],
};

export default meta;
type Story = StoryObj<typeof EditButton>;

export const Default: Story = {
  args: {},
};

export const CustomLabel: Story = {
  args: {
    label: 'Modify Post',
  },
};

export const Normal: Story = {
  args: {
    variant: 'normal',
  },
};
