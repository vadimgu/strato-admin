import type { Meta, StoryObj } from '@storybook/react';
import NumberField from './NumberField';
import { withRaContext } from '../stories/RaStoryDecorator';

const meta: Meta<typeof NumberField> = {
  title: 'Fields/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  decorators: [
    withRaContext({
      id: 1,
      price: 123.45,
      quantity: 10,
      score: 0.85,
      empty: null,
    }),
  ],
};

export default meta;
type Story = StoryObj<typeof NumberField>;

export const Basic: Story = {
  args: {
    source: 'price',
  },
};

export const Integer: Story = {
  args: {
    source: 'quantity',
  },
};

export const Currency: Story = {
  args: {
    source: 'price',
    options: { style: 'currency', currency: 'USD' },
  },
};

export const Percentage: Story = {
  args: {
    source: 'score',
    options: { style: 'percent' },
  },
};

export const CustomLocale: Story = {
  args: {
    source: 'price',
    locales: 'de-DE',
    options: { style: 'currency', currency: 'EUR' },
  },
};

export const Empty: Story = {
  args: {
    source: 'empty',
  },
};

export const WithEmptyText: Story = {
  args: {
    source: 'empty',
    emptyText: 'N/A',
  },
};

export const WithLink: Story = {
  args: {
    source: 'price',
    link: 'show',
  },
};
