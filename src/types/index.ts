export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  features: string[];
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  dateJoined?: string;
  totalOrders?: number;
  totalSpent?: number;
  loyaltyPoints?: number;
  membershipTier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  expiryDate: string;
  isUsed: boolean;
  usedDate?: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  type: 'purchase' | 'refund' | 'loyalty_earned' | 'loyalty_redeemed';
  amount: number;
  loyaltyPointsEarned?: number;
  loyaltyPointsUsed?: number;
  date: string;
  description: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface FilterOptions {
  category: string;
  priceRange: [number, number];
  inStock: boolean;
  sortBy: 'name' | 'price-low' | 'price-high' | 'rating' | 'newest';
  searchQuery: string;
}