import fakeRestDataProvider from 'ra-data-fakerest';
import { generateEcommerceData } from './generate';

export const dataProvider = fakeRestDataProvider(
    generateEcommerceData(),
    true, // logging
    500 // simulate network delay
);
