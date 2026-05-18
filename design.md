# Budget App — Design System

Inspired by Monify: clean, light, green-and-white with pastel category accents.
Responsive, mobile-first. All components must follow this file.

---

## Colors

```css
/* Core palette */
--color-primary: #5dc191; /* green — header, active elements, FAB "+" */
--color-primary-light: #eaf7f1; /* light green — header background, active tabs */
--color-primary-dark: #3da372; /* darker green — hover, pressed states */

--color-danger: #f07070; /* coral/pink — "−" button, delete actions */
--color-danger-light: #fef0f0; /* light coral — expense badge background */

/* Neutrals */
--color-bg: #f7f9f8; /* background for all screens */
--color-surface: #ffffff; /* cards, modals, bottom sheets */
--color-border: #e8eee8; /* dividers, input outlines */

/* Text */
--color-text-primary: #2d3a35; /* main text */
--color-text-secondary: #8fa89e; /* labels, placeholders, dates */
--color-text-on-primary: #ffffff; /* text on green background */

/* Balance */
--color-income: #5dc191; /* income — green */
--color-expense: #f07070; /* expense — coral */
--color-balance: #2d3a35; /* balance total — dark */
```

---

## Categories — icon colors

Each category has a `color` (icon stroke) and `bg` (circle background).
Icons are outline style only — never filled.

```js
const CATEGORY_COLORS = {
  food: { color: "#F4A261", bg: "#FEF3E8" }, // orange
  transport: { color: "#F07070", bg: "#FEF0F0" }, // coral
  home: { color: "#5DC191", bg: "#EAF7F1" }, // green
  household: { color: "#E76F51", bg: "#FDF0EB" }, // terracotta
  clubs: { color: "#48BFE3", bg: "#E8F7FC" }, // sky blue
  kids: { color: "#C77DFF", bg: "#F4EBFF" }, // purple
  clothes: { color: "#74B9FF", bg: "#E8F3FF" }, // blue
  health: { color: "#F07070", bg: "#FEF0F0" }, // pink
  fun: { color: "#A8DADC", bg: "#EBF7F8" }, // mint
  gifts: { color: "#FBBF24", bg: "#FEF9E7" }, // yellow
  income: { color: "#5DC191", bg: "#EAF7F1" }, // green
  other: { color: "#8FA89E", bg: "#F0F4F3" }, // gray
};
```

---

## Typography

```css
/* Font — system sans-serif or loaded via Google Fonts */
--font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;

/* Sizes */
--text-xs: 11px; /* percentage labels on chart, date captions */
--text-sm: 13px; /* category labels, secondary info */
--text-base: 15px; /* main list text */
--text-md: 17px; /* screen titles, section headings */
--text-lg: 22px; /* balance amount on chart */
--text-xl: 28px; /* main balance on overview */

/* Weights */
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
```

---

## Spacing & Grid

```css
/* Base unit = 4px */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;

/* Horizontal screen padding */
--screen-padding: 16px;

/* Border radii */
--radius-sm: 8px; /* badges, pills */
--radius-md: 12px; /* cards, inputs */
--radius-lg: 20px; /* bottom sheets, large cards */
--radius-full: 999px; /* FAB buttons, pill shapes */
```

---

## Components

### Header / TopBar

```
Background: --color-primary
Height:     56px (mobile), 64px (tablet+)
Text:       --color-text-on-primary, font-semibold, 17px
Icons:      white, 22px
Shadow:     none (flat header)
```

```jsx
// Structure
<header
  style={{ background: "var(--color-primary)", padding: "0 16px", height: 56 }}
>
  <span className="logo">Budget</span>
  <nav>{/* search, filter, menu icons */}</nav>
</header>
```

---

### Month Tab Selector

Horizontally scrollable month tabs. Active tab — white text at full opacity; inactive — white text at 55% opacity.

```css
.month-tab {
  color: var(--color-text-on-primary);
  opacity: 0.55;
  font-size: 14px;
  padding: 8px 16px;
}
.month-tab--active {
  opacity: 1;
  font-weight: 600;
  border-bottom: 2px solid white;
}
```

---

### Donut Chart (Overview)

- Background: `--color-surface`, rounded `--radius-lg`
- Center: total income in large font + balance in small font, color `--color-text-secondary`
- Segments: colors from `CATEGORY_COLORS[id].color`
- Category icons around the ring: circle `40px`, background `CATEGORY_COLORS[id].bg`, icon `20px`
- Percentage label below icon: `11px`, `--color-text-secondary`

---

### Transaction Row

```
Height:    56px
Background: --color-surface
Divider:   1px solid --color-border (between rows only, not at edges)

[icon 36px]  [name + category]        [amount]
  circle       name: 15px semibold    income:  --color-income
  bg/color     category: 13px         expense: --color-expense
               --color-text-secondary
```

```jsx
<div className="transaction-row">
  <div className="cat-icon" style={{ background: cat.bg }}>
    <Icon name={cat.icon} color={cat.color} size={20} />
  </div>
  <div className="transaction-info">
    <span className="label">{label}</span>
    <span className="category">{category.name}</span>
  </div>
  <span
    className="amount"
    style={{ color: isIncome ? "var(--color-income)" : "var(--color-expense)" }}
  >
    {isIncome ? "+" : "−"}
    {amount} ₴
  </span>
</div>
```

---

### Balance Bar

Green pill at the bottom of the overview screen, above the FABs.

```css
.balance-bar {
  background: var(--color-primary);
  border-radius: var(--radius-full);
  padding: 12px 24px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  margin: 0 16px;
}
```

---

### FAB Buttons (Floating Action Buttons)

Two circles at the bottom of the screen: minus (expense / delete) and plus (income / add).

```css
.fab {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-size: 28px;
  font-weight: 300;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.fab:active {
  transform: scale(0.93);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}

.fab--add {
  background: var(--color-primary);
  color: white;
} /* + */
.fab--remove {
  background: var(--color-danger);
  color: white;
} /* − */
```

---

### Bottom Navigation Bar

```css
.bottom-nav {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.bottom-nav__item {
  color: var(--color-text-secondary);
}
.bottom-nav__item--active {
  color: var(--color-primary);
}
```

---

### Input / Form Fields

```css
.input {
  width: 100%;
  height: 48px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0 16px;
  font-size: 15px;
  color: var(--color-text-primary);
  background: var(--color-surface);
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.input::placeholder {
  color: var(--color-text-secondary);
}
```

---

### Category Badge / Pill

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 500;
  /* background and color taken from CATEGORY_COLORS */
}
```

---

### Card

```css
.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 16px;
  /* Shadow is minimal — flat style */
  box-shadow: 0 1px 4px rgba(45, 58, 53, 0.06);
}
```

---

### Month Summary Row (stats screen)

```css
/* Row: [month name]  [income green]  [expense coral]  [balance bold] */
.month-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}
```

---

## Animations

```css
/* Smooth card / row entrance */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-in {
  animation: fadeIn 0.2s ease forwards;
}

/* Dropdown open */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: scaleY(0.95);
    transform-origin: top;
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}
.dropdown {
  animation: slideDown 0.15s ease forwards;
}
```

---

## Responsive Breakpoints

```css
/* Mobile-first */
/* Base: < 640px  — single column, FABs at bottom */
/* Tablet: 640px+ — sidebar + content */
/* Desktop: 1024px+ — sidebar 280px, content max-width 720px */

@media (min-width: 640px) {
  :root {
    --screen-padding: 24px;
  }
}

@media (min-width: 1024px) {
  :root {
    --screen-padding: 32px;
  }
}
```

---

## Tailwind Config (if using Tailwind)

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#5DC191", light: "#EAF7F1", dark: "#3DA372" },
        danger: { DEFAULT: "#F07070", light: "#FEF0F0" },
        surface: "#FFFFFF",
        muted: "#8FA89E",
        border: "#E8EEE8",
        bg: "#F7F9F8",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "20px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
};
```

---

## Don'ts

- ❌ Dark background or dark theme — light only
- ❌ Heavy shadows (`box-shadow: 0 8px 24px ...`) — max 4px blur, 6% opacity
- ❌ Gradients on buttons — solid `--color-primary` only
- ❌ More than 2 accent colors on a single screen
- ❌ ALL CAPS text — sentence case only
- ❌ Border-radius below 8px on cards
