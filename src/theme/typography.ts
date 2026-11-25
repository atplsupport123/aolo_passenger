export const fonts = {
  heading: 'Roboto',
  body: 'Roboto',
  mono: 'Roboto',
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
} as const;

export const typography = {
  h1: {
    fontFamily: fonts.heading,
    fontWeight: '700' as const,
    fontSize: 28,
  },
  h2: {
    fontFamily: fonts.heading,
    fontWeight: '700' as const,
    fontSize: 24,
  },
  h3: {
    fontFamily: fonts.heading,
    fontWeight: '600' as const,
    fontSize: 20,
  },
  h4: {
    fontFamily: fonts.heading,
    fontWeight: '600' as const,
    fontSize: 18,
  },
  bodyLarge: {
    fontFamily: fonts.body,
    fontWeight: '500' as const,
    fontSize: 16,
  },
  bodyMedium: {
    fontFamily: fonts.body,
    fontWeight: '400' as const,
    fontSize: 14,
  },
  bodySmall: {
    fontFamily: fonts.body,
    fontWeight: '400' as const,
    fontSize: 12,
  },
  mono: {
    fontFamily: fonts.mono,
    fontWeight: '700' as const,
    fontSize: 16,
  },
} as const;
