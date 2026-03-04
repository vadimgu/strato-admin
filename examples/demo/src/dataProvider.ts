import fakeRestDataProvider from 'ra-data-fakerest';

const data = {
    products: [
        { id: 1, name: 'Eco-Friendly Water Bottle', price: 25.00, stock: 150, categoryId: 1 },
        { id: 2, name: 'Organic Cotton T-Shirt', price: 30.00, stock: 200, categoryId: 2 },
        { id: 3, name: 'Bamboo Toothbrush', price: 5.50, stock: 500, categoryId: 1 },
        { id: 4, name: 'Recycled Paper Notebook', price: 12.00, stock: 100, categoryId: 3 },
        { id: 5, name: 'Solar Powered Charger', price: 45.00, stock: 45, categoryId: 1 },
        { id: 6, name: 'Hemp Backpack', price: 65.00, stock: 30, categoryId: 2 },
    ],
    categories: [
        { id: 1, name: 'Home & Lifestyle' },
        { id: 2, name: 'Apparel' },
        { id: 3, name: 'Stationery' },
    ],
};

export const dataProvider = fakeRestDataProvider(data, true);
