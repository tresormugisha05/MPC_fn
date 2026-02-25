import api from './ApiSetter';
import type { Reservation } from '../types/reservation';

export async function createReservation(
  productId: string,
  quantity: number = 1
): Promise<Reservation> {
  try {
    const response = await api.post('/reservations', { product_id: productId, quantity });
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
}

export async function getReservation(reservationId: string): Promise<Reservation> {
  try {
    const response = await api.get(`/reservations/${reservationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching reservation:', error);
    throw error;
  }
}

export async function cancelReservation(reservationId: string): Promise<Reservation> {
  try {
    const response = await api.post(`/reservations/${reservationId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error canceling reservation:', error);
    throw error;
  }
}

export async function getUserReservations(userId: string): Promise<Reservation[]> {
  try {
    const response = await api.get(`/reservations/users/${userId}/reservations`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching user reservations:', error);
    throw error;
  }
}
