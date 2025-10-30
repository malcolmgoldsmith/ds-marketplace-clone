# Lenovo UDS Marketplace Design System

A comprehensive design system extracted from the Lenovo UDS Marketplace platform.

## Overview

This design system provides a complete set of design tokens, components, and guidelines for building applications that match the Lenovo UDS Marketplace visual language.

**Extracted**: October 2025
**Source**: https://marketplace.naea1.uds.lenovo.com/
**Status**: ✅ Production Ready

---

## 📚 Table of Contents

- [Design Tokens](#design-tokens)
- [Components](#components)
- [Usage Guidelines](#usage-guidelines)
- [Accessibility](#accessibility)
- [Getting Started](#getting-started)

---

## 🎨 Design Tokens

Design tokens are the visual design atoms of the design system. They define colors, typography, spacing, and other fundamental styles.

### Colors

The color system includes 12 comprehensive color palettes with semantic naming:

- **Primary Colors**: Midnight (dark blue) and Daylight (light blue)
- **Neutral Colors**: Carbon, Mercury, Shadow, and Ash (grayscale)
- **Success Colors**: Emerald and Radium (greens)
- **Error Colors**: Fire, Candy, and Rust (reds/oranges)
- **Warning Colors**: Honey (yellows/oranges)

Each palette includes 10-13 shades (from 900 to 10) for comprehensive coverage.

📄 **Location**: [`tokens/colors.json`](tokens/colors.json)

**Example Usage**:
```css
/* Using raw palette colors */
background-color: rgb(0, 102, 205); /* Midnight-40 */

/* Using semantic colors */
background-color: rgb(var(--color-primary-50)); /* Primary brand color */
color: rgb(var(--color-neutral-70)); /* Body text */
border-color: rgb(var(--color-error-20)); /* Error state */
```

### Typography

Font stack: **Lato, sans-serif, Helvetica, Arial**

**Font Weights**:
- Regular: 400
- Bold: 700

**Font Sizes**: xs (12px) → 5xl (48px)
**Line Heights**: tight (16px) → loose (32px)

**Text Styles**:
- Headings: h1 (48px) → h6 (18px)
- Body: 14px (body) / 16px (bodyLarge)
- Caption: 12px
- Button: 14px

📄 **Location**: [`tokens/typography.json`](tokens/typography.json)

### Spacing

Consistent spacing scale from 4px to 96px:

```
xs: 4px    md: 16px   xl: 32px    3xl: 48px   6xl: 96px
sm: 8px    lg: 24px   2xl: 40px   4xl: 64px
                                   5xl: 80px
```

**Layout Breakpoints**:
- Mobile: 600px
- Tablet: 1065px
- Desktop: 1440px

📄 **Location**: [`tokens/spacing.json`](tokens/spacing.json)

### Effects

**Shadows**: none, sm, base, md, lg, xl
**Border Radius**: none (0px) → full (9999px)
**Opacity**: 0 → 100 (in 10% increments)
**Z-Index**: Predefined layers from base (1) to datepicker (2000)
**Transitions**: fast (150ms), base (300ms), slow (500ms)

📄 **Location**: [`tokens/effects.json`](tokens/effects.json)

---

## 🧩 Components

The component library is organized using Atomic Design methodology:

### Atoms (12 components)

Small, reusable building blocks:

- **Buttons** (5 variants): Primary, secondary, icon buttons, sign-in
- **Inputs** (1 type): Text fields
- **Chips/Badges** (2 variants): Counter chips, category chips
- **Icons** (3): SVG icon system
- **Links** (1): Text links

📄 **Location**: [`components/atoms-v2.json`](components/atoms-v2.json)

### Molecules (2 components)

Simple groups of atoms:

- **Search Fields** (1): Header search
- **Breadcrumbs** (1): Navigation breadcrumbs

📄 **Location**: [`components/molecules-v2.json`](components/molecules-v2.json)

### Organisms (14 components)

Complex UI sections:

- **Headers** (1): Application header with navigation
- **Cards** (11 variants): Product cards, content cards
- **Navigation** (2): Primary and secondary navigation

📄 **Location**: [`components/organisms-v2.json`](components/organisms-v2.json)

---

## 📖 Usage Guidelines

### Color Usage

**Primary Colors** - Use for:
- Primary actions (CTAs)
- Interactive elements
- Links and focus states

**Success Colors** - Use for:
- Success messages
- Completed states
- Positive indicators

**Error Colors** - Use for:
- Error messages
- Validation errors
- Destructive actions

**Neutral Colors** - Use for:
- Text
- Backgrounds
- Borders
- Disabled states

### Typography Hierarchy

```
H1 (48px/bold) - Page titles
H2 (36px/bold) - Section titles
H3 (30px/bold) - Subsection titles
H4 (24px/bold) - Card titles
H5 (20px/bold) - Small headings
H6 (18px/bold) - Minor headings
Body (14px/regular) - Default text
Caption (12px/regular) - Helper text
```

### Spacing Consistency

- Use the spacing scale consistently
- Avoid custom spacing values
- Use multiples of 8px for large spacing
- Use 4px for micro-spacing

---

## ♿ Accessibility

### Color Contrast

All semantic color combinations meet WCAG 2.1 AA standards:

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **Interactive elements**: Clear focus indicators with `outline-blue`

### Focus Management

All interactive elements include:
- Visible focus indicators (2px solid outline)
- Keyboard navigation support
- ARIA attributes where appropriate

### Semantic HTML

Components use:
- Proper heading hierarchy
- Semantic HTML5 elements (`<nav>`, `<header>`, `<footer>`)
- ARIA labels for screen readers

---

## 🚀 Getting Started

### 1. Design Tokens

Import design tokens into your project:

```javascript
import colors from './design-system/tokens/colors.json';
import typography from './design-system/tokens/typography.json';
import spacing from './design-system/tokens/spacing.json';
import effects from './design-system/tokens/effects.json';
```

### 2. CSS Variables

The color system uses CSS custom properties:

```css
:root {
  /* Palette colors */
  --midnight-900: 0, 5, 10;
  --midnight-40: 0, 102, 205;

  /* Semantic colors */
  --color-primary-50: var(--midnight-40);
  --color-neutral-70: var(--shadow-600);
}
```

Use with `rgb()`:
```css
.button-primary {
  background-color: rgb(var(--color-primary-50));
  color: rgb(var(--color-neutral-10));
}
```

### 3. Component Usage

Components are extracted with Angular directives removed for framework-agnostic use.

Example Button:
```html
<button class="ds-btn ds-btn--md ds-btn--with-icon theme-uds-light">
  Click Me
</button>
```

---

## 📊 Design System Statistics

- **Total Design Tokens**: 400+
- **Color Palettes**: 12
- **Total Colors**: 156 shades
- **Typography Styles**: 10
- **Spacing Units**: 11
- **Components Extracted**: 28
  - Atoms: 12
  - Molecules: 2
  - Organisms: 14

---

## 🔄 Updates & Maintenance

**Last Updated**: October 21, 2025
**Version**: 1.0.0
**Extraction Method**: Automated via Playwright + Custom Scripts

### Re-extraction

To update the design system with latest marketplace changes:

```bash
npm run pipeline   # Full extraction pipeline
npm run verify     # Visual verification
```

---

## 📁 File Structure

```
design-system/
├── README.md                    # This file
├── tokens/
│   ├── colors.json             # Color system
│   ├── typography.json         # Typography tokens
│   ├── spacing.json            # Spacing & layout
│   └── effects.json            # Shadows, borders, transitions
├── components/
│   ├── atoms-v2.json          # Atomic components
│   ├── molecules-v2.json      # Molecular components
│   ├── organisms-v2.json      # Organism components
│   └── summary-v2.json        # Extraction summary
├── analysis/
│   ├── design-patterns.json    # Pattern analysis
│   └── navigation-structure.json
└── backup/                      # Original extracted data
```

---

## 🤝 Contributing

When contributing to this design system:

1. Follow atomic design principles
2. Maintain semantic naming conventions
3. Ensure accessibility compliance
4. Document all changes
5. Test across browsers

---

## 📄 License

This design system is extracted from Lenovo UDS Marketplace for educational and development purposes.

**Copyright © 2025 Lenovo**

---

## 🔗 Resources

- [Lenovo Marketplace](https://marketplace.naea1.uds.lenovo.com/)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Design Tokens W3C Community Group](https://www.w3.org/community/design-tokens/)
