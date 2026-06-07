---
name: Technical Precision
colors:
  surface: '#f8f9fd'
  surface-dim: '#d9dade'
  surface-bright: '#f8f9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3f7'
  surface-container: '#edeef2'
  surface-container-high: '#e7e8ec'
  surface-container-highest: '#e1e2e6'
  on-surface: '#191c1f'
  on-surface-variant: '#45464f'
  inverse-surface: '#2e3134'
  inverse-on-surface: '#eff1f5'
  outline: '#757680'
  outline-variant: '#c5c6d1'
  surface-tint: '#4b5c93'
  primary: '#13275c'
  on-primary: '#ffffff'
  primary-container: '#2c3e73'
  on-primary-container: '#99abe7'
  inverse-primary: '#b4c5ff'
  secondary: '#6f5d00'
  on-secondary: '#ffffff'
  secondary-container: '#fee269'
  on-secondary-container: '#756300'
  tertiary: '#432300'
  on-tertiary: '#ffffff'
  tertiary-container: '#623600'
  on-tertiary-container: '#f99520'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174c'
  on-primary-fixed-variant: '#32447a'
  secondary-fixed: '#fee269'
  secondary-fixed-dim: '#e0c650'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#534600'
  tertiary-fixed: '#ffdcc0'
  tertiary-fixed-dim: '#ffb875'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6b3b00'
  background: '#f8f9fd'
  on-background: '#191c1f'
  surface-variant: '#e1e2e6'
  dark-navy: '#1A2340'
  scanner-bg: '#0D1420'
  success-green: '#22C55E'
  white: '#FFFFFF'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 1rem
  gutter: 1rem
  stack-sm: 0.5rem
  stack-md: 1rem
  stack-lg: 1.5rem
  section-padding: 2rem
---

## Brand & Style

The design system is engineered for the **KinalMap** PWA, targeting a tech-savvy student body and visitors of a technical school exhibition. The brand personality is **authoritative yet engaging**, balancing the rigor of engineering with the excitement of a digital scavenger hunt.

The chosen style is **Corporate Modern with Glassmorphic accents**. This approach utilizes the systematic reliability of professional software while incorporating "Technical/Interactive" elements requested. Key visual characteristics include:
- **Depth through Transparency:** Translucent overlays and frosted-glass containers for high-level UI elements (like the QR Scanner frame and Map Overlays).
- **Tactile Technicality:** Buttons and cards feature subtle 3D professional shadows to feel pressable and physical.
- **Precision Lines:** Thin, high-contrast borders and geometric alignment reflecting architectural and technical drafts.
- **Interactive Vibrancy:** A neutral background allows the high-energy Orange and Gold accents to guide the user's eye toward primary actions (QR scanning and rewards).

## Colors

The palette is anchored by **Navy**, representing the institution's tradition and stability. **Gold** and **Orange** are used sparingly for achievement and action:
- **Primary (Navy):** Used for structural elements like headers, primary buttons, and the app shell.
- **Secondary (Gold):** Specifically reserved for "Achievement" states—unlocked stamps, active tab states, and the scanner frame.
- **Tertiary (Orange):** The "Action" color. It is used exclusively for the Floating Action Button (FAB) and critical call-to-actions.
- **Neutral:** A cool-toned light gray background ensures the Navy and White cards maintain high legibility and a clean, technical aesthetic.

**Gradients:** Use the `brand-linear` gradient for top-level headers and the "Album" spine to provide depth. The `gold-shimmer` is used as an animated overlay for unlocked digital stamps.

## Typography

This design system uses **Inter** exclusively to maintain a systematic, neutral, and highly readable technical appearance. 

- **Weight usage:** Use `800` (ExtraBold) for page titles to create a strong visual anchor. Use `600` (SemiBold) for subheaders and card titles.
- **Scalability:** On mobile, `headline-xl` should scale down to `headline-xl-mobile` to prevent excessive line-breaking.
- **Labels:** Small labels use uppercase and increased letter spacing to mimic technical drafting notations.

## Layout & Spacing

As a mobile-first PWA, the system utilizes a **fluid grid** within a single column for content, with a standard **16px (1rem)** safe area on all sides.

- **Rhythm:** A 4px baseline grid governs all spacing.
- **Safe Zones:** Always account for the `BottomNav` height (typically 64px) + the Floating QR button offset (an additional 20px) to ensure content is never obscured.
- **Cards:** Content within cards should use a `stack-md` (16px) padding to maintain a spacious, modern feel.

## Elevation & Depth

Hierarchy is established through three tiers of depth:

1.  **Level 0 (Floor):** The background (`#F5F6FA`). Flat and non-interactive.
2.  **Level 1 (Raised):** Cards and event items. These use a **Professional Shadow**: `0px 4px 12px rgba(44, 62, 115, 0.08)`. This soft blue-tinted shadow prevents the UI from looking muddy.
3.  **Level 2 (Floating):** Floating Action Buttons (QR Scanner) and Modals. These use a more aggressive shadow: `0px 8px 24px rgba(44, 62, 115, 0.15)`.
4.  **Glassmorphism Tier:** The Map Filters and Scanner Overlay use a `backdrop-filter: blur(12px)` with a semi-transparent white or navy background (`rgba(255, 255, 255, 0.7)` or `rgba(26, 35, 64, 0.8)`).

## Shapes

The shape language is **Rounded (8px default)**, providing a friendly touch to the technical Navy palette.

- **Standard Elements:** Buttons, Input fields, and Cards use the `0.5rem` (8px) radius.
- **Large Elements:** The Book/Album and Large Progress Banners use `1rem` (16px) for a more substantial, object-like feel.
- **Interactive Circles:** The QR FAB and Map Markers are fully circular (pill-shaped) to distinguish them from structural content.

## Components

- **Buttons:**
    - **Primary:** Navy background, white text, 8px radius.
    - **Accent (QR):** Orange background, white icon, circular, Level 2 elevation.
    - **Ghost:** Transparent background with Navy border (1px) for secondary actions like "View Details."
- **Quick Action Cards:** Square cards with 12px padding. Icons should be centered, 32px size, in Navy (or Gold if active). Use a subtle Level 1 shadow.
- **Album Stickers:**
    - **Locked:** Circular, 15% opacity Navy background, centered "lock" icon or silhouette.
    - **Unlocked:** Full color emoji, `gold-shimmer` animation, Level 1 shadow, and a 2px Gold border.
- **Input Fields:** Light gray background (`#E9EBF2`), 8px radius, 1px border that turns Navy on focus.
- **Bottom Navigation:** White background with a top border of `1px solid #E9EBF2`. The active state for non-QR tabs uses a Gold background with White icons.
- **Progress Bar:** High-contrast Navy track with a Gold fill. Add a subtle "glow" to the end of the Gold fill to indicate energy/progress.