export interface Order {
  id: string;
  user_id: string;
  reservation_id: string;
  product_id: string;
  quantity: number;
  total_price: string;
  created_at: string;
  product?: {
    name: string;
    price: string;
    image_url: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
