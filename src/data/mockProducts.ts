import type { Product } from '../types/product';
import type { Reservation } from '../types/reservation';
import type { Order } from '../types/order';

// Mock Product Data
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Limited Edition Sneakers',
    description: 'Exclusive collaborative sneaker design with premium materials. Only 100 pairs made worldwide.',
    price: 299.99,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=400&fit=crop'
  },
  {
    id: '2',
    name: 'Designer Watch Collection',
    description: 'Swiss-made automatic movement watch with sapphire crystal. Water resistant to 100m.',
    price: 599.99,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop'
  },
  {
    id: '3',
    name: 'Vintage Leather Bag',
    description: 'Handcrafted Italian leather messenger bag with brass hardware. Each piece is unique.',
    price: 449.99,
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=400&fit=crop'
  },
  {
    id: '4',
    name: 'Wireless Earbuds Pro',
    description: 'Premium noise-cancelling earbuds with 32-hour battery life and spatial audio.',
    price: 199.99,
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=400&fit=crop'
  },
  {
    id: '5',
    name: 'Smart Home Hub',
    description: 'Central control device for all your smart home devices. Voice control enabled.',
    price: 149.99,
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&h=400&fit=crop'
  },
  {
    id: '6',
    name: 'Gaming Console X',
    description: 'Next-generation gaming console with 4K graphics and ray tracing support.',
    price: 499.99,
    stock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=600&h=400&fit=crop'
  },
  {
    id: '7',
    name: 'Mechanical Keyboard',
    description: 'Custom mechanical keyboard with RGB lighting and hot-swappable switches.',
    price: 179.99,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&h=400&fit=crop'
  },
  {
    id: '8',
    name: '4K Action Camera',
    description: 'Waterproof action camera with stabilization and live streaming capability.',
    price: 349.99,
    stock: 0,
    imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=400&fit=crop'
  },
  {
    id: '9',
    name: 'Premium Headphones',
    description: 'Over-ear headphones with active noise cancellation and 40-hour battery.',
    price: 349.99,
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop'
  },
  {
    id: '10',
    name: 'Electric Skateboard',
    description: 'High-speed electric skateboard with regenerative braking. 15 mile range.',
    price: 399.99,
    stock: 7,
    imageUrl: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=600&h=400&fit=crop'
  }
];

// Mock Reservations storage (in-memory)
const reservations: Map<string, Reservation> = new Map();

// Mock Orders storage (in-memory)
const orders: Map<string, Order> = new Map();

// API Functions that use mock data
export const mockApi = {
  // Products
  getProduct: async (productId: string): Promise<Product> => {
    await simulateNetworkDelay();
    const product = mockProducts.find(p => p.id === productId);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },
  
  getAllProducts: async (): Promise<Product[]> => {
    await simulateNetworkDelay();
    return mockProducts;
  },
  
  addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
    await simulateNetworkDelay();
    const newProduct: Product = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...product
    };
    mockProducts.push(newProduct);
    return newProduct;
  },
  
  // Reservations
  createReservation: async (productId: string, quantity: number): Promise<Reservation> => {
    await simulateNetworkDelay();
    
    const product = mockProducts.find(p => p.id === productId);
    if (!product) {
      throw new Error('Product not found');
    }
    
    if (product.stock < quantity) {
      throw new ApiError('Insufficient stock', 400);
    }
    
    // Simulate race condition - randomly fail if stock is low
    if (product.stock <= 3 && Math.random() > 0.5) {
      throw new ApiError('Sorry, someone just grabbed the last one!', 409);
    }
    
    // Reduce stock
    product.stock -= quantity;
    
    const reservation: Reservation = {
      id: `res_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      productId,
      userId: 'user_123',
      quantity,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
      status: 'active'
    };
    
    reservations.set(reservation.id, reservation);
    
    return reservation;
  },
  
  getReservation: async (reservationId: string): Promise<Reservation> => {
    await simulateNetworkDelay();
    
    const reservation = reservations.get(reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    // Check if expired
    if (new Date(reservation.expiresAt).getTime() < Date.now()) {
      reservation.status = 'expired';
      throw new ApiError('Reservation has expired', 410);
    }
    
    return reservation;
  },
  
  // Orders
  createOrder: async (reservationId: string): Promise<Order> => {
    await simulateNetworkDelay();
    
    const reservation = reservations.get(reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    // Check if expired
    if (new Date(reservation.expiresAt).getTime() < Date.now()) {
      reservation.status = 'expired';
      throw new ApiError('Reservation has expired', 410);
    }
    
    // Update reservation status
    reservation.status = 'completed';
    
    const order: Order = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reservationId,
      createdAt: new Date().toISOString()
    };
    
    orders.set(order.id, order);
    
    return order;
  },
  
  // Stock management for testing
  getStock: async (productId: string): Promise<number> => {
    await simulateNetworkDelay(300);
    const product = mockProducts.find(p => p.id === productId);
    return product?.stock ?? 0;
  },
  
  // Reset stock for testing
  resetStock: (productId: string): void => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      product.stock = 15;
    }
  }
};

// Helper function to simulate network delay
function simulateNetworkDelay(minMs = 500, maxMs = 1000): Promise<void> {
  const delay = Math.random() * (maxMs - minMs) + minMs;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Custom API Error class
class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
