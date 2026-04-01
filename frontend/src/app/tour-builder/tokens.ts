/**
 * Tour Builder Design Tokens
 * ─────────────────────────────────────────────────────────────
 * Central source of truth for all Tour Builder styling.
 * Following Once UI dark-mode first philosophy (Vercel/Linear/Raycast).
 */

// ═══════════ SURFACES ═══════════
export const surface = {
  page: '#08080C',
  base: '#0C0C10',
  elevated: '#121217',
  overlay: 'rgba(12, 12, 16, 0.92)',
  glass: 'rgba(18, 18, 23, 0.85)',
  card: '#16161C',
} as const;

// ═══════════ BRAND / ACCENT COLORS ═══════════
export const accent = {
  primary: '#00D1B2',       // Teal — main CTA, success, active
  primaryMuted: 'rgba(0, 209, 178, 0.15)',
  primaryGlow: 'rgba(0, 209, 178, 0.4)',
  
  secondary: '#A855F7',     // Purple — time, premium
  secondaryMuted: 'rgba(168, 85, 247, 0.15)',
  
  warning: '#FBBF24',       // Amber — match %, sparkles
  warningMuted: 'rgba(251, 191, 36, 0.15)',
  
  danger: '#EF4444',        // Red — discard, skip
  dangerMuted: 'rgba(239, 68, 68, 0.15)',
  
  brand: '#ED1B24',         // Brand red — location pin
} as const;

// ═══════════ TEXT COLORS ═══════════
export const text = {
  primary: '#FFFFFF',
  secondary: 'rgba(255, 255, 255, 0.7)',
  tertiary: 'rgba(255, 255, 255, 0.5)',
  muted: 'rgba(255, 255, 255, 0.35)',
  disabled: 'rgba(255, 255, 255, 0.2)',
} as const;

// ═══════════ BORDERS ═══════════
export const border = {
  subtle: 'rgba(255, 255, 255, 0.04)',
  weak: 'rgba(255, 255, 255, 0.06)',
  medium: 'rgba(255, 255, 255, 0.08)',
  strong: 'rgba(255, 255, 255, 0.12)',
} as const;

// ═══════════ SPACING (8px grid) ═══════════
export const spacing = {
  '2xs': 4,
  xs: 8,
  s: 12,
  m: 16,
  l: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
} as const;

// ═══════════ RADIUS ═══════════
export const radius = {
  xs: 6,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
} as const;

// ═══════════ SHADOWS ═══════════
export const shadow = {
  card: '0 8px 32px rgba(0, 0, 0, 0.35)',
  elevated: '0 16px 48px rgba(0, 0, 0, 0.5)',
  glow: (color: string) => `0 0 20px ${color}`,
  insetBorder: (color: string) => `inset 0 0 0 1px ${color}`,
} as const;

// ═══════════ TYPOGRAPHY SCALE ═══════════
export const typography = {
  // Page-level
  pageTitle: { size: '1.75rem', weight: 700, lineHeight: 1.2 },
  
  // Section-level
  sectionTitle: { size: '1.125rem', weight: 700, lineHeight: 1.3 },
  sectionSubtitle: { size: '0.875rem', weight: 500, lineHeight: 1.4 },
  
  // Card-level
  cardTitle: { size: '1.25rem', weight: 700, lineHeight: 1.2 },
  cardSubtitle: { size: '0.9rem', weight: 500, lineHeight: 1.4 },
  
  // Metadata
  label: { size: '0.75rem', weight: 600, lineHeight: 1.3 },
  caption: { size: '0.7rem', weight: 600, lineHeight: 1.3, letterSpacing: '0.04em' },
  
  // Body
  body: { size: '0.875rem', weight: 400, lineHeight: 1.5 },
  bodySmall: { size: '0.8rem', weight: 400, lineHeight: 1.5 },
} as const;

// ═══════════ ROUTE STATUS COLORS ═══════════
export const routeStatus = {
  empty: { bg: 'rgba(255, 255, 255, 0.02)', border: 'rgba(255, 255, 255, 0.08)' },
  active: { bg: 'rgba(0, 209, 178, 0.08)', border: 'rgba(0, 209, 178, 0.4)' },
  filled: (color: string) => ({ bg: `${color}15`, border: color }),
  connector: { active: accent.primary, inactive: border.weak },
} as const;

// ═══════════ CARD AMBIENT COLORS (by category) ═══════════
export const cardAmbient = {
  food: '#FF6B35',
  cafe: '#2A9D8F',
  nightlife: '#7B2FF7',
  cultural: '#E63946',
  nature: '#4ADE80',
  shopping: '#F472B6',
} as const;

// ═══════════ Z-INDEX LAYERS ═══════════
export const zIndex = {
  base: 0,
  card: 5,
  cardActive: 10,
  header: 20,
  overlay: 30,
  modal: 40,
  tooltip: 50,
} as const;

// ═══════════ MOTION ═══════════
export const motion = {
  spring: { type: 'spring', stiffness: 260, damping: 22 },
  springSnappy: { type: 'spring', stiffness: 400, damping: 25 },
  springGentle: { type: 'spring', stiffness: 180, damping: 20 },
  easeOut: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  easeInOut: { duration: 0.4, ease: 'easeInOut' },
} as const;
