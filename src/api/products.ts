import type { Product } from '../types/product';
import { mockApi } from '../data/mockProducts';

// Mock API delay for realistic testing
const API_DELAY = 500;

export async function getProduct(productId: string): Promise<Product> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, API_DELAY));
  return mockApi.getProduct(productId);
}

export async function getAllProducts(): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, API_DELAY));
  return mockApi.getAllProducts();
}

export async function getStock(productId: string): Promise<number> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockApi.getStock(productId);
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  await new Promise(resolve => setTimeout(resolve, API_DELAY));
  return mockApi.addProduct(product);
}
