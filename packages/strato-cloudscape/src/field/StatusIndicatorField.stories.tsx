import type { Meta, StoryObj } from '@storybook/react';
import StatusIndicatorField from './StatusIndicatorField';
import { withRaContext } from '../stories/RaStoryDecorator';

const meta: Meta<typeof StatusIndicatorField> = {
  title: 'Fields/StatusIndicatorField',
  component: StatusIndicatorField,
  tags: ['autodocs'],
  decorators: [
    withRaContext({
      id: 1,
      status: 'active',
      error_status: 'error',
      warning_status: 'warning',
      loading_status: 'loading',
      custom_value: 'Ready',
    }),
  ],
};

export default meta;
type Story = StoryObj<typeof StatusIndicatorField>;

export const Basic: Story = {
  args: {
    source: 'status',
  },
};

export const Success: Story = {
  args: {
    source: 'status',
    type: 'success',
  },
};

export const Error: Story = {
  args: {
    source: 'error_status',
    type: 'error',
  },
};

export const Warning: Story = {
  args: {
    source: 'warning_status',
    type: 'warning',
  },
};

export const Loading: Story = {
  args: {
    source: 'loading_status',
    type: 'loading',
  },
};

export const WithMapping: Story = {
  args: {
    source: 'status',
    mapping: {
      active: 'success',
      inactive: 'stopped',
    },
  },
};

export const DynamicType: Story = {
  args: {
    source: 'status',
    type: (value) => (value === 'active' ? 'success' : 'error'),
  },
};

export const ColorOverride: Story = {
  args: {
    source: 'custom_value',
    type: 'success',
    colorOverride: 'blue',
  },
};

export const WithLabelChildren: Story = {
  render: (args) => (
    <StatusIndicatorField {...args}>
      <StatusIndicatorField.Label value="active" type="success" label="Is Active" />
      <StatusIndicatorField.Label value="inactive" type="stopped" label="Is Inactive" />
    </StatusIndicatorField>
  ),
  args: {
    source: 'status',
  },
};
