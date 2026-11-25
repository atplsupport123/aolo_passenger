import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

export interface StoredUser {
  uid: string;
  name: string;
  phone: string;       // Normalized 10 digits
  rawPhone: string;    // Display formatted e.g. +91 98765 43210
  email: string;       // Normalized lowercased email
  password: string;
  walletBalance: number;
  createdAt: string;
}

const USERS_STORAGE_KEY = '@aolo_local_users';
const CURRENT_USER_KEY = '@aolo_current_user';

// Seed demo user so standard demo login works out of the box
const DEFAULT_SEED_USERS: StoredUser[] = [
  {
    uid: 'user_default_1',
    name: 'Yuvraj Singh',
    phone: '9876543210',
    rawPhone: '+91 98765 43210',
    email: 'passenger@aolo.com',
    password: 'password123',
    walletBalance: 250,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Normalizes phone number to last 10 digits.
 * Returns empty string if fewer than 10 digits.
 */
export function normalizePhone(input: string): string {
  if (!input) return '';
  const digits = input.replace(/\D/g, '');
  if (digits.length < 10) return '';
  return digits.slice(-10);
}

/**
 * Normalizes email by trimming and lowercasing.
 */
export function normalizeEmail(input: string): string {
  if (!input) return '';
  return input.trim().toLowerCase();
}

/**
 * Validates email format using standard regex.
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Retrieves all stored users from local storage.
 * Seeds with default demo user on first run if empty.
 */
export async function getStoredUsers(): Promise<StoredUser[]> {
  try {
    const raw = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      // First initialization: seed default users
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_SEED_USERS));
      return DEFAULT_SEED_USERS;
    }
    const users = JSON.parse(raw);
    if (!Array.isArray(users) || users.length === 0) {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_SEED_USERS));
      return DEFAULT_SEED_USERS;
    }
    // Always guarantee demo user is present in stored users
    const hasDemo = users.some(
      (u: StoredUser) => normalizeEmail(u.email) === 'passenger@aolo.com' || normalizePhone(u.phone) === '9876543210'
    );
    if (!hasDemo) {
      users.unshift(DEFAULT_SEED_USERS[0]);
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
    return users;
  } catch (error) {
    console.warn('[localAuth] Failed to load stored users, falling back to seed:', error);
    return DEFAULT_SEED_USERS;
  }
}

/**
 * Saves users list to local storage.
 */
export async function saveStoredUsers(users: StoredUser[]): Promise<void> {
  try {
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('[localAuth] Failed to save users:', error);
    throw error;
  }
}

export interface SignUpParams {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: UserProfile;
  error?: string;
  errorField?: 'name' | 'phone' | 'email' | 'password' | 'general';
}

/**
 * Registers a new user locally with duplicate checks for phone and email.
 */
export async function localSignUp(params: SignUpParams): Promise<AuthResult> {
  const trimmedName = params.name.trim();
  const normPhone = normalizePhone(params.phone);
  const normEmail = normalizeEmail(params.email);
  const password = params.password;

  if (trimmedName.length < 2) {
    return { success: false, error: 'Apna poora naam daalo', errorField: 'name' };
  }
  if (!normPhone || normPhone.length !== 10) {
    return { success: false, error: 'Sahi phone number daalo', errorField: 'phone' };
  }
  if (!normEmail || !isValidEmail(normEmail)) {
    return { success: false, error: 'Sahi email daalo', errorField: 'email' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password kam se kam 6 character ka ho', errorField: 'password' };
  }

  const users = await getStoredUsers();

  // Duplicate email check
  const duplicateEmail = users.find((u) => normalizeEmail(u.email) === normEmail);
  if (duplicateEmail) {
    return {
      success: false,
      error: 'Ye email pehle se registered hai',
      errorField: 'email',
    };
  }

  // Duplicate phone check (normalized 10 digits)
  const duplicatePhone = users.find((u) => normalizePhone(u.phone) === normPhone);
  if (duplicatePhone) {
    return {
      success: false,
      error: 'Ye phone number pehle se registered hai',
      errorField: 'phone',
    };
  }

  const newUser: StoredUser = {
    uid: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: trimmedName,
    phone: normPhone,
    rawPhone: params.phone.trim(),
    email: normEmail,
    password: password,
    walletBalance: 250, // Welcome bonus
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await saveStoredUsers(users);

  const profile: UserProfile = {
    uid: newUser.uid,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.rawPhone || `+91 ${newUser.phone}`,
    walletBalance: newUser.walletBalance,
  };

  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));

  return { success: true, user: profile };
}

export interface SignInParams {
  emailOrPhone: string;
  password: string;
}

/**
 * Authenticates user against local storage.
 */
export async function localSignIn(params: SignInParams): Promise<AuthResult> {
  const identifier = params.emailOrPhone.trim();
  const password = params.password;

  if (!identifier) {
    return { success: false, error: 'Email ya phone number daalo', errorField: 'email' };
  }
  if (!password) {
    return { success: false, error: 'Password daalo', errorField: 'password' };
  }

  const users = await getStoredUsers();
  const normEmail = normalizeEmail(identifier);
  const normPhone = normalizePhone(identifier);

  let matchedUser = users.find((u) => {
    const emailMatch = normalizeEmail(u.email) === normEmail;
    const phoneMatch = normPhone && normalizePhone(u.phone) === normPhone;
    return (emailMatch || phoneMatch) && u.password === password;
  });

  // Guarantee instant match for default demo credentials even if local storage was cleared/corrupted
  if (!matchedUser && (normEmail === 'passenger@aolo.com' || normPhone === '9876543210') && password === 'password123') {
    matchedUser = DEFAULT_SEED_USERS[0];
  }

  if (!matchedUser) {
    return {
      success: false,
      error: 'Galat email/phone ya password. Dobara check karein.',
      errorField: 'general',
    };
  }

  const profile: UserProfile = {
    uid: matchedUser.uid,
    name: matchedUser.name,
    email: matchedUser.email,
    phone: matchedUser.rawPhone || `+91 ${matchedUser.phone}`,
    walletBalance: matchedUser.walletBalance,
  };

  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));

  return { success: true, user: profile };
}

/**
 * Clears current logged-in user session from local storage.
 */
export async function localSignOut(): Promise<void> {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.warn('[localAuth] Failed to clear current user:', error);
  }
}

/**
 * Gets currently logged-in user profile from local storage.
 */
export async function getLocalCurrentUser(): Promise<UserProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Deletes current user account permanently from storage.
 */
export async function localDeleteAccount(): Promise<void> {
  try {
    const currentUser = await getLocalCurrentUser();
    if (currentUser?.uid) {
      const users = await getStoredUsers();
      const updatedUsers = users.filter((u) => u.uid !== currentUser.uid);
      await saveStoredUsers(updatedUsers);
    }
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.warn('[localAuth] Failed to delete user account:', error);
  }
}

