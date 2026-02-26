export interface Reservation {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  expiresAt: string; // ISO date string from API
  status: 'pending' | 'completed' | 'expired' | 'cancelled' | 'active';
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image_url: string | null;
  } | null;
}
