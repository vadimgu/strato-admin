import { faker } from '@faker-js/faker';
import { Category, Customer, Order, OrderItem, OrderStatus, Product, Review } from './types';

export const generateEcommerceData = () => {
  faker.seed(123);
  // Constants
  const CATEGORIES = [
    'animals',
    'beard',
    'business',
    'cars',
    'city',
    'flowers',
    'food',
    'nature',
    'sports',
    'tech',
    'travel',
    'water',
  ];

  // 1. Generate Categories
  const categories: Category[] = CATEGORIES.map((name, id) => ({
    id,
    name,
  }));

  // 2. Generate Customers
  const customers: Customer[] = Array.from({ length: 100 }, (_, id) => {
    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();
    const email = faker.internet.email({ firstName: first_name, lastName: last_name });
    const birthday = faker.date.birthdate({ min: 18, max: 80, mode: 'age' });
    const first_seen = faker.date.past({ years: 2 });
    const last_seen = faker.date.between({ from: first_seen, to: new Date() });
    const has_ordered = faker.datatype.boolean({ probability: 0.8 });
    const has_newsletter = faker.datatype.boolean({ probability: 0.3 });
    const groups = faker.helpers.arrayElements(['collector', 'ordered_once', 'regular', 'reviewer'], {
      min: 0,
      max: 2,
    });

    return {
      id,
      first_name,
      last_name,
      email,
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode(),
      avatar: faker.image.avatar(),
      birthday,
      first_seen,
      last_seen,
      has_ordered,
      has_newsletter,
      groups,
      nb_commands: 0,
      total_spent: 0,
    };
  });

  // 3. Generate Products
  const products: Product[] = Array.from({ length: 50 }, (_, id) => {
    const category = faker.helpers.arrayElement(categories);
    const width = faker.number.float({ min: 10, max: 100, fractionDigits: 2 });
    const height = faker.number.float({ min: 10, max: 100, fractionDigits: 2 });

    return {
      id,
      category_id: category.id,
      reference: faker.commerce.isbn(),
      name: faker.commerce.productName(),
      width,
      height,
      price: faker.number.float({ min: 1, max: 500, fractionDigits: 2 }),
      thumbnail: faker.image.urlLoremFlickr({ category: category.name, width: 120, height: 120 }),
      image: faker.image.urlLoremFlickr({ category: category.name, width: 800, height: 600 }),
      description: faker.commerce.productDescription(),
      stock: faker.number.int({ min: 0, max: 250 }),
      sales: 0,
      rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
    };
  });

  // 4. Generate Reviews
  const reviews: Review[] = Array.from({ length: 200 }, (_, id) => {
    const customer = faker.helpers.arrayElement(customers);
    const product = faker.helpers.arrayElement(products);
    const date = faker.date.past({ years: 1 });
    const status = faker.helpers.arrayElement(['accepted', 'pending', 'rejected']);

    return {
      id,
      date,
      status: status as 'accepted' | 'pending' | 'rejected',
      customer_id: customer.id,
      product_id: product.id,
      rating: faker.number.int({ min: 1, max: 5 }),
      comment: faker.lorem.paragraph(),
    };
  });

  // 5. Generate Orders
  const orders: Order[] = Array.from({ length: 300 }, (_, id) => {
    const customer = faker.helpers.arrayElement(customers.filter((c) => c.has_ordered));
    const date = faker.date.between({ from: customer.first_seen, to: customer.last_seen });
    const nbItems = faker.number.int({ min: 1, max: 5 });

    const basket: OrderItem[] = Array.from({ length: nbItems }, (_, itemId) => {
      const product = faker.helpers.arrayElement(products);
      return {
        id: id * 10 + itemId,
        order_id: id,
        product_id: product.id,
        quantity: faker.number.int({ min: 1, max: 10 }),
        unit_price: product.price,
      };
    });

    const total_ex_taxes = basket.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    const delivery_fees = faker.number.float({ min: 0, max: 20, fractionDigits: 2 });
    const tax_rate = 0.2;
    const taxes = (total_ex_taxes + delivery_fees) * tax_rate;
    const total = total_ex_taxes + delivery_fees + taxes;
    const status: OrderStatus = faker.helpers.arrayElement(['ordered', 'delivered', 'cancelled', 'unknown']);
    const returned = status === 'delivered' && faker.datatype.boolean({ probability: 0.1 });

    // Update customer stats
    customer.nb_commands++;
    customer.total_spent += total;
    if (!customer.latest_purchase || date > customer.latest_purchase) {
      customer.latest_purchase = date;
    }

    // Update product stats
    basket.forEach((item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (product) {
        product.sales += item.quantity;
      }
    });

    return {
      id,
      reference: faker.string.alphanumeric({ length: 6, casing: 'upper' }),
      date,
      customer_id: customer.id,
      basket,
      total_ex_taxes,
      delivery_fees,
      tax_rate,
      taxes,
      total,
      status,
      returned,
    };
  });

  return {
    categories,
    customers,
    products,
    reviews,
    orders,
  };
};
