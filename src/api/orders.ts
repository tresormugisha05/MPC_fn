import type { Order } from '../types/order';
import { mockApi } from '../data/mockProducts';

// Mock API delay for realistic testing
const API_DELAY = 500;

export async function createOrder(reservationId: string): Promise<Order> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, API_DELAY));
  return mockApi.createOrder(reservationId);
}

export async function getOrder(_orderId: string): Promise<Order> {
  await new Promise(resolve => setTimeout(resolve, API_DELAY));
  // For mock, we'd need to add this to mockApi
  throw new Error('Not implemented in mock');
}
