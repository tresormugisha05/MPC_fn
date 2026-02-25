import type { Reservation } from '../types/reservation';
import { mockApi } from '../data/mockProducts';

// Mock API delay for realistic testing
const API_DELAY = 500;

export async function createReservation(
  productId: string,
  quantity: number = 1
): Promise<Reservation> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, API_DELAY));
  return mockApi.createReservation(productId, quantity);
}

export async function getReservation(reservationId: string): Promise<Reservation> {
  await new Promise(resolve => setTimeout(resolve, API_DELAY));
  return mockApi.getReservation(reservationId);
}
