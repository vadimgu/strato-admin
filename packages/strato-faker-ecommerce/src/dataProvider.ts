import fakeRestDataProvider from 'ra-data-fakerest';
import { DataProvider } from '@strato-admin/ra-core';
import { generateEcommerceData } from './generate';

const data = generateEcommerceData();

export const dataProvider: DataProvider = fakeRestDataProvider(
  data,
  true, // logging
  500, // simulate network delay
);
