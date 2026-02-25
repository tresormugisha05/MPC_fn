export interface Reservation {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  expiresAt: string; // ISO date string from API
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
}
