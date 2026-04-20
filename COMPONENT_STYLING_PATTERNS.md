# Component Styling Patterns - Light/Dark Mode

## Pattern Overview

All components now use Tailwind's `dark:` modifier for theme-aware styling. Here are the most common patterns used throughout the application.

## 1. Basic Container

### Before (Hardcoded Dark)
```jsx
<div className="bg-slate-950 text-slate-100">
  Content
</div>
```

### After (Light/Dark Mode)
```jsx
<div className="bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
  Content
</div>
```

## 2. Header/Navigation Bar

```jsx
<header className="h-14 sticky top-0 z-30 flex items-center justify-between px-6 border-b bg-white/40 dark:bg-slate-900/40 border-gray-200/50 dark:border-slate-700/30 backdrop-blur-md transition-colors duration-200">
  {/* Content */}
</header>
```

**Key Points:**
- Light: white with 40% opacity
- Dark: slate-900 with 40% opacity
- Backdrop blur for glassmorphism effect
- Subtle borders work in both modes

## 3. Search Input

```jsx
<input
  type="text"
  className="w-full pl-10 pr-4 py-2 
    bg-gray-100 dark:bg-slate-800/50 
    border border-gray-300 dark:border-slate-700/30 
    rounded-lg 
    text-gray-900 dark:text-slate-100 
    placeholder-gray-500 dark:placeholder-slate-600 
    focus:outline-none 
    focus:bg-gray-50 dark:focus:bg-slate-800/80 
    focus:border-blue-500 dark:focus:border-cyan-500/50 
    focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20 
    transition-all"
  placeholder="Search..."
/>
```

**Color Strategy:**
- Background: `bg-gray-100` → `dark:bg-slate-800/50`
- Border: `border-gray-300` → `dark:border-slate-700/30`
- Text: `text-gray-900` → `dark:text-slate-100`
- Focus: `blue-500` → `dark:cyan-500`

## 4. Buttons

### Primary Button
```jsx
<button className="bg-blue-600 hover:bg-blue-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-semibold px-4 py-1.5 rounded-lg text-sm transition-all duration-200 shadow-lg dark:shadow-cyan-500/30">
  Create Task
</button>
```

### Secondary Button
```jsx
<button className="px-4 py-1.5 border border-gray-300 dark:border-slate-700/50 rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/40 transition-all">
  Cancel
</button>
```

### Icon Button
```jsx
<button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700/50 text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">
  🔔
</button>
```

## 5. Cards/Containers

### Glass Card
```jsx
<div className="bg-white/40 dark:bg-slate-900/40 border border-gray-200/50 dark:border-slate-700/30 rounded-lg p-4 backdrop-blur-md transition-colors duration-200">
  Card content
</div>
```

### Sidebar
```jsx
<aside className="bg-white/40 dark:bg-slate-900/40 border border-gray-200/50 dark:border-slate-700/30 backdrop-blur-md transition-colors duration-200">
  Sidebar content
</aside>
```

## 6. Text Elements

### Heading
```jsx
<h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
  Page Title
</h1>
```

### Label
```jsx
<label className="block text-xs font-semibold text-gray-700 dark:text-slate-400 mb-2 uppercase tracking-wider">
  Field Name
</label>
```

### Muted Text
```jsx
<p className="text-sm text-gray-600 dark:text-slate-400">
  Supporting text
</p>
```

## 7. Status Badge

```jsx
<span className="px-2.5 py-1 rounded-lg font-bold uppercase tracking-wide 
  bg-emerald-100 dark:bg-emerald-500/20 
  text-emerald-700 dark:text-emerald-400 
  border border-emerald-300 dark:border-emerald-500/30">
  Active
</span>
```

## 8. Dropdown/Menu

```jsx
<div className="absolute top-full left-0 mt-2 w-56 rounded-lg z-50 py-2 border
  bg-white dark:bg-slate-900/50
  border-gray-200 dark:border-slate-700/30
  backdrop-blur-md transition-colors duration-200">
  {/* Menu items */}
</div>
```

## 9. Form Input

```jsx
<input
  type="text"
  className="w-full px-4 py-2.5 
    bg-gray-50 dark:bg-slate-800/50 
    border border-gray-300 dark:border-slate-700/50 
    rounded-lg 
    text-gray-900 dark:text-slate-100 
    placeholder-gray-500 dark:placeholder-slate-600
    focus:outline-none 
    focus:border-blue-500 dark:focus:border-cyan-500/50 
    focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-cyan-500/30 
    transition-all"
/>
```

## 10. Avatar

```jsx
<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 dark:from-cyan-500 dark:to-blue-600 text-white flex items-center justify-center font-bold text-xs border-2 border-gray-300 dark:border-slate-700/50 cursor-pointer hover:shadow-lg dark:hover:shadow-cyan-500/30 transition-all">
  JD
</div>
```

## Color Palette Summary

### Primary Colors
| Mode | Color | Usage |
|------|-------|-------|
| Light | `blue-600` | Buttons, Links, Accents |
| Dark | `cyan-600/400` | Buttons, Links, Accents |

### Backgrounds
| Mode | Color | Usage |
|------|-------|-------|
| Light | `white`/`gray-50` | Primary, Secondary |
| Dark | `slate-950`/`slate-900` | Primary, Secondary |

### Text
| Mode | Primary | Muted |
|------|---------|-------|
| Light | `gray-900` | `gray-600` |
| Dark | `slate-100` | `slate-400` |

### Borders
| Mode | Color | Usage |
|------|-------|-------|
| Light | `gray-300`/`gray-200` | Dividers, Inputs |
| Dark | `slate-700/30` | Dividers, Inputs |

## Best Practices

✅ **DO:**
- Always pair light and dark styles: `bg-white dark:bg-slate-950`
- Use opacity for glassmorphism: `rgba(255, 255, 255, 0.4)`
- Add transitions: `transition-colors duration-200`
- Use semantic colors (blue for light, cyan for dark)

❌ **DON'T:**
- Hardcode dark mode only
- Use colors without dark mode pair
- Forget backdrop-filter for glass effects
- Mix light and dark mode colors (e.g., `dark:cyan-600` with `text-slate-100`)

## Testing Tips

1. Toggle theme using ThemeToggle button (top right)
2. Check localStorage: `localStorage.getItem('theme')`
3. Verify: `document.documentElement.classList.contains('dark')`
4. Reload page - theme should persist
