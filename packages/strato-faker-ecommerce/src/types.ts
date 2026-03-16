export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  city: string;
  zipcode: string;
  avatar: string;
  birthday: Date;
  first_seen: Date;
  last_seen: Date;
  has_ordered: boolean;
  latest_purchase?: Date;
  has_newsletter: boolean;
  groups: string[];
  nb_commands: number;
  total_spent: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  category_id: number;
  reference: string;
  name: string;
  width: number;
  height: number;
  price: number;
  thumbnail: string;
  image: string;
  description: string;
  stock: number;
  sales: number;
  rating: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

export type OrderStatus = 'ordered' | 'delivered' | 'cancelled' | 'unknown';

export interface Order {
  id: number;
  reference: string;
  date: Date;
  customer_id: number;
  basket: OrderItem[];
  total_ex_taxes: number;
  delivery_fees: number;
  tax_rate: number;
  taxes: number;
  total: number;
  status: OrderStatus;
  returned: boolean;
}

export interface Review {
  id: number;
  date: Date;
  status: 'accepted' | 'pending' | 'rejected';
  customer_id: number;
  product_id: number;
  rating: number;
  comment: string;
}
