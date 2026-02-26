import api from './ApiSetter';

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

interface RegisterResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Login failed. Please try again.');
  }
}

export async function register(email: string, password: string, name: string): Promise<RegisterResponse> {
  try {
    const response = await api.post<RegisterResponse>('/auth/register', { email, password, name });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Registration failed. Please try again.');
  }
}
