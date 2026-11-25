import { Platform } from 'react-native';

// Configurable API base URL: 10.0.2.2 for Android emulator, 127.0.0.1 for Web/iOS simulator
export const API_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:5000',
  default: 'http://127.0.0.1:5000',
});

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: any;
  ride?: any;
  error?: string;
}

export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    const data = await res.json();
    return data.status === 'OK';
  } catch {
    return false;
  }
}

export async function apiSignUp(name: string, phone: string, email: string, password?: string): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, password }),
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function apiLogin(emailOrPhone: string, password?: string): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone, password }),
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function apiCreateRide(rideData: {
  userId: number;
  rideType?: string;
  vehicleClass: string;
  pickupName: string;
  pickupAddress: string;
  dropoffName: string;
  dropoffAddress: string;
  fare: number;
}): Promise<ApiResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/rides/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rideData),
    });
    return await res.json();
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
