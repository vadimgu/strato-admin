import { describe, it, expect } from 'vitest';
import { generateEcommerceData } from './generate';

describe('generateEcommerceData', () => {
  it('should generate ecommerce data with correct structure', () => {
    const data = generateEcommerceData();
    
    expect(data).toHaveProperty('categories');
    expect(data).toHaveProperty('customers');
    expect(data).toHaveProperty('products');
    expect(data).toHaveProperty('reviews');
    expect(data).toHaveProperty('orders');
    
    expect(data.categories.length).toBeGreaterThan(0);
    expect(data.customers.length).toBe(100);
    expect(data.products.length).toBe(50);
    expect(data.reviews.length).toBe(200);
    expect(data.orders.length).toBe(300);

    // Check if products have a name
    data.products.forEach(product => {
      expect(product.name).toBeDefined();
      expect(typeof product.name).toBe('string');
    });
  });

  it('should have valid relationships', () => {
    const data = generateEcommerceData();
    
    // Check orders reference existing customers
    data.orders.forEach(order => {
        const customer = data.customers.find(c => c.id === order.customer_id);
        expect(customer).toBeDefined();
    });

    // Check reviews reference existing products and customers
    data.reviews.forEach(review => {
        const product = data.products.find(p => p.id === review.product_id);
        const customer = data.customers.find(c => c.id === review.customer_id);
        expect(product).toBeDefined();
        expect(customer).toBeDefined();
    });
  });
});
