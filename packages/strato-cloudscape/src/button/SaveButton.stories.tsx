import type { Meta, StoryObj } from '@storybook/react';
import { SaveButton } from './SaveButton';
import { withRaContext } from '../stories/RaStoryDecorator';

const meta: Meta<typeof SaveButton> = {
  title: 'Components/SaveButton',
  component: SaveButton,
  tags: ['autodocs'],
  decorators: [withRaContext()],
};

export default meta;
type Story = StoryObj<typeof SaveButton>;

export const Default: Story = {
  args: {},
};

export const CustomLabel: Story = {
  args: {
    label: 'Commit Changes',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};
