import type { Meta, StoryObj } from '@storybook/react';
import CurrencyField from './CurrencyField';
import { withRaContext } from '../stories/RaStoryDecorator';

const meta: Meta<typeof CurrencyField> = {
  title: 'Fields/CurrencyField',
  component: CurrencyField,
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
type Story = StoryObj<typeof CurrencyField>;

export const Basic: Story = {
  args: {
    source: 'price',
    currency: 'USD',
  },
};

export const CustomLocale: Story = {
  args: {
    source: 'price',
    locales: 'de-DE',
    currency: 'EUR',
  },
};

export const WithOptions: Story = {
  args: {
    source: 'price',
    currency: 'USD',
    options: { minimumFractionDigits: 2 },
  },
};

export const Empty: Story = {
  args: {
    source: 'empty',
    currency: 'USD',
  },
};

export const WithEmptyText: Story = {
  args: {
    source: 'empty',
    emptyText: 'N/A',
    currency: 'USD',
  },
};

export const WithLink: Story = {
  args: {
    source: 'price',
    link: 'show',
    currency: 'USD',
  },
};
