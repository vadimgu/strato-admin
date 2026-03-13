import type { Meta, StoryObj } from '@storybook/react';
import DateField from './DateField';
import { withRaContext } from '../stories/RaStoryDecorator';

const meta: Meta<typeof DateField> = {
  title: 'Fields/DateField',
  component: DateField,
  tags: ['autodocs'],
  decorators: [
    withRaContext({
      id: 1,
      published_at: '2023-10-27T10:00:00Z',
      last_seen: new Date('2024-01-15T15:30:00Z'),
      empty: null,
    }),
  ],
};

export default meta;
type Story = StoryObj<typeof DateField>;

export const Basic: Story = {
  args: {
    source: 'published_at',
  },
};

export const WithDateObject: Story = {
  args: {
    source: 'last_seen',
  },
};

export const CustomOptions: Story = {
  args: {
    source: 'published_at',
    options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  },
};

export const CustomLocale: Story = {
  args: {
    source: 'published_at',
    locales: 'fr-FR',
    options: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
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
    emptyText: 'Not set',
  },
};

export const WithLink: Story = {
  args: {
    source: 'published_at',
    link: 'show',
  },
};
