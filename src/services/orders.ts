import api from './ApiSetter';
import type { Order } from '../types/order';

export async function createOrder(reservationId: string): Promise<Order> {
  try {
    const response = await api.post('/orders', { reservation_id: reservationId });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getOrder(orderId: string): Promise<Order> {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const response = await api.get('/orders');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const response = await api.get(`/orders/users/${userId}/orders`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}
