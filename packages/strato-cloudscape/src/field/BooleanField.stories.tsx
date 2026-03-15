import type { Meta, StoryObj } from '@storybook/react';
import BooleanField from './BooleanField';
import { withRaContext } from '../stories/RaStoryDecorator';

const meta: Meta<typeof BooleanField> = {
  title: 'Fields/BooleanField',
  component: BooleanField,
  tags: ['autodocs'],
  decorators: [withRaContext({ id: 1, isTrue: true, isFalse: false, isUndefined: undefined })],
};

export default meta;
type Story = StoryObj<typeof BooleanField>;

export const TrueValue: Story = {
  args: {
    source: 'isTrue',
  },
};

export const FalseValue: Story = {
  args: {
    source: 'isFalse',
  },
};

export const UndefinedValue: Story = {
  args: {
    source: 'isUndefined',
  },
};

export const WithLabel: Story = {
  args: {
    source: 'isTrue',
    showLabel: true,
  },
};

export const CustomLabels: Story = {
  args: {
    source: 'isTrue',
    showLabel: true,
    trueLabel: 'Active',
    falseLabel: 'Inactive',
  },
};

export const CustomLabelsFalse: Story = {
  args: {
    source: 'isFalse',
    showLabel: true,
    trueLabel: 'Active',
    falseLabel: 'Inactive',
  },
};
