import fakeRestDataProvider from 'ra-data-fakerest';
import { generateEcommerceData } from './generate';

const data = generateEcommerceData();

export const dataProvider = fakeRestDataProvider(
    data,
    true, // logging
    500 // simulate network delay
);
