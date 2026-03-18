# @strato-admin/faker-ecommerce

This package provides mock data for an E-commerce domain using `@faker-js/faker`.

## Resources

- `categories`
- `customers`
- `products`
- `reviews`
- `orders` (including `basket` as `OrderItem[]`)

## Usage

### As a Data Provider

```typescript
import { Admin, Resource } from 'react-admin';
import { dataProvider } from '@strato-admin/faker-ecommerce';

const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="products" list={ProductList} />
        <Resource name="customers" list={CustomerList} />
    </Admin>
);
```

### Raw Data Generation

```typescript
import { generateEcommerceData } from '@strato-admin/faker-ecommerce';

const data = generateEcommerceData();
console.log(data.products.length); // 50
```

## Types

The package exports interfaces for all resources:

- `Category`
- `Customer`
- `Product`
- `Review`
- `Order`
- `OrderItem`
