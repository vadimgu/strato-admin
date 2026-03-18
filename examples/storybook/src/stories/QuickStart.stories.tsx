import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { QuickStartApp } from './QuickStart';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof QuickStartApp> = {
  title: 'Examples/Quick Start',
  component: QuickStartApp,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof QuickStartApp>;

export const Default: Story = {
  render: () => <MemoryRouter><QuickStartApp /></MemoryRouter>,
};
