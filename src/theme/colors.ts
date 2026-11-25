export const brandColors = {
  // Primary & Background Tokens
  aoloBg: '#F7F9F5',           // Off-white primary page background (#F7F9F5)
  aoloCardBg: '#FFFFFF',       // White card surface (#FFFFFF)
  aoloText: '#0A0A0A',         // Primary black text (#0A0A0A)
  
  // Brand Accents & CTAs
  aoloGreen: '#A8E63C',        // Brand Lime Green (Primary CTA, Wallet figure, Selected state, Active tab)
  aoloGreenHover: '#7FB82C',   // Pressed green state
  aoloBlack: '#0A0A0A',        // Secondary CTA pill button background / Headings
  aoloWhite: '#FFFFFF',        // Pure White text & elements
  
  // Muted & Borders
  aoloGray: '#8A9184',         // Muted text & subtitles (#8A9184)
  aoloBorderLight: '#E9EDE6',  // Light gray card borders (#E9EDE6)
  aoloBorderDark: '#262B1E',   // Dark borders for intentional dark screens
  
  // Status Colors
  aoloAmber: '#F59E0B',        // Amber / Yellow warning and pending states
  aoloRed: '#E53935',          // Error, restricted, and cancellation red (#E53935)

  // Intentional Dark Theme Exceptions (Corporate Portal & Onboarding Step 3 Map Card)
  aoloDarkBg: '#0A0A0A',
  aoloDarkCardBg: '#151915',
  aoloCharcoal: '#151915',
  aoloSoftWhite: '#F5F7F3',
} as const;

export const colors = brandColors;

