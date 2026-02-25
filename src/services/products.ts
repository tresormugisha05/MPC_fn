import api from './ApiSetter';
import type { Product } from '../types/product';

export async function getProduct(productId: string): Promise<Product> {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await api.get('/products');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getStock(productId: string): Promise<number> {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data?.stock || 0;
  } catch (error) {
    console.error('Error fetching stock:', error);
    throw error;
  }
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  try {
    const response = await api.post('/products', product);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}
