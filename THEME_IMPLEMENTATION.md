# Light/Dark Mode Theme Implementation

## Overview
The application now supports a complete Light/Dark mode toggle system using React Context API and Tailwind CSS's built-in dark mode support with the `class` strategy.

## Architecture

### 1. **ThemeContext** (`src/contexts/ThemeContext.jsx`)
- Manages theme state globally
- Persists theme preference to localStorage
- Detects system preference on first load
- Provides `useTheme()` hook for all components

### 2. **ThemeProvider** (in `src/main.jsx`)
- Wraps the entire app at the highest level
- Applies/removes `dark` class to `<html>` element
- Controls CSS variables and styles

### 3. **ThemeToggle Component** (`src/components/ThemeToggle.jsx`)
- Beautiful button with Sun/Moon icons
- Smooth rotation animations
- Responsive hover effects
- Supports both light and dark backgrounds

## How It Works

### Theme Class Application
```html
<!-- Light mode (default) -->
<html class="">

<!-- Dark mode -->
<html class="dark">
```

### Tailwind Dark Mode Syntax
All components use Tailwind's `dark:` prefix for dark mode styles:

```jsx
// Light mode default, dark mode override
<div className="bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100">
  Content
</div>
```

## Glassmorphism in Both Modes

### Light Mode
- Background: `rgba(255, 255, 255, 0.4)` (white with transparency)
- Border: `rgba(229, 231, 235, 0.5)` (light gray)
- Accent Color: Blue (`#3b82f6`)

### Dark Mode
- Background: `rgba(15, 23, 42, 0.4)` (slate with transparency)
- Border: `rgba(71, 85, 105, 0.3)` (slate gray)
- Accent Color: Cyan (`#06b6d4`)

## Updated Components

### Layout Components
1. **DashboardLayout** - Main layout container with gradient backgrounds
2. **TopNavbar** - Header with search, actions, and theme toggle
3. **LeftSidebar** - Navigation sidebar with projects

### Color Mapping

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Background | `bg-white` | `dark:bg-slate-950` |
| Text | `text-gray-900` | `dark:text-slate-100` |
| Borders | `border-gray-300` | `dark:border-slate-700/30` |
| Hover BG | `hover:bg-gray-200` | `dark:hover:bg-slate-800/40` |
| Accent | `text-blue-600` | `dark:text-cyan-400` |
| Button Primary | `bg-blue-600` | `dark:bg-cyan-600` |

## Usage Example

### Using the Theme Hook
```jsx
import { useTheme } from '../contexts/ThemeContext';

export default function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="bg-white dark:bg-slate-950">
      <p className="text-gray-900 dark:text-slate-100">
        Current theme: {theme}
      </p>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### Conditional Styling
```jsx
<button className={theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}>
  Click me
</button>

// OR use Tailwind's dark: modifier (preferred)
<button className="text-blue-600 dark:text-cyan-400">
  Click me
</button>
```

## Configuration Files

### `tailwind.config.js`
- Enables dark mode with `darkMode: 'class'`
- Uses class-based strategy (adds `dark` class to HTML)

### `src/index.css`
- Defines glassmorphism classes for both modes
- Global base styles with Tailwind directives
- Smooth color transitions

## Theme Persistence
- User's theme choice is saved to `localStorage` under the key `'theme'`
- On page reload, the saved theme is applied
- If no preference is saved, system preference is used as fallback

## Benefits
✅ System preference detection  
✅ User preference persistence  
✅ Smooth transitions between modes  
✅ Improved accessibility  
✅ Consistent glassmorphic design  
✅ Easy to maintain and extend  

## Future Enhancements
- [ ] Schedule-based auto-switching (light during day, dark at night)
- [ ] Custom color theme builder
- [ ] Per-component theme overrides
- [ ] Animation preferences
