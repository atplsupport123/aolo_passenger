export const spacing = {
  px_1: 4,     // gap-1, p-1, m-1
  px_2: 8,     // gap-2, p-2, m-2
  px_3: 12,    // gap-3, p-3, m-3
  px_4: 16,    // gap-4, p-4, m-4 (Standard screen padding)
  px_5: 20,    // gap-5, p-5, m-5
  px_6: 24,    // gap-6, p-6, m-6 (Card inner padding)
  px_8: 32,    // gap-8, p-8, m-8
  px_10: 40,   // gap-10, p-10, m-10
  px_12: 48,   // gap-12, p-12, m-12
  px_16: 64,   // gap-16, p-16, m-16
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,      // Modal bottom sheet top radius & overlay cards
  full: 9999,  // Circular avatars & status pills
} as const;
