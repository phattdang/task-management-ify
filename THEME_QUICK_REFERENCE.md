# Theme Toggle - Quick Reference Guide

## 🎯 Quick Start

### Import the Hook (Anywhere in App)
```jsx
import { useTheme } from '../contexts/ThemeContext';
```

### Use the Hook
```jsx
const { theme, toggleTheme } = useTheme();
```

### Access Current Theme
```jsx
if (theme === 'dark') {
  // Dark mode logic
} else {
  // Light mode logic
}
```

---

## 🎨 Styling Patterns (Copy & Paste)

### Container/Card
```jsx
<div className="bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700/30 rounded-lg p-4 transition-colors duration-200">
  Content
</div>
```

### Text
```jsx
<p className="text-gray-900 dark:text-slate-100">Normal text</p>
<p className="text-gray-600 dark:text-slate-400">Muted text</p>
```

### Button (Primary)
```jsx
<button className="bg-blue-600 dark:bg-cyan-600 hover:bg-blue-500 dark:hover:bg-cyan-500 text-white rounded-lg px-4 py-2 transition-colors">
  Click me
</button>
```

### Button (Secondary)
```jsx
<button className="border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 rounded-lg px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-800/40 transition-colors">
  Cancel
</button>
```

### Input
```jsx
<input
  className="bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700/50 text-gray-900 dark:text-slate-100 placeholder-gray-500 dark:placeholder-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20 transition-all"
  placeholder="Search..."
/>
```

### Avatar
```jsx
<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 dark:from-cyan-500 dark:to-blue-600 text-white flex items-center justify-center font-bold text-xs">
  AB
</div>
```

### Badge
```jsx
<span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 font-bold text-xs uppercase">
  Active
</span>
```

### Icon Button
```jsx
<button className="p-2 rounded-lg text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-gray-200 dark:hover:bg-slate-800/40 transition-colors">
  🔔
</button>
```

### Divider
```jsx
<div className="h-px bg-gray-300 dark:bg-slate-700/30 my-4"></div>
```

### Header
```jsx
<header className="bg-white/40 dark:bg-slate-900/40 border-b border-gray-200/50 dark:border-slate-700/30 backdrop-blur-md px-6 py-4 transition-colors duration-200">
  Header content
</header>
```

### Sidebar
```jsx
<aside className="w-64 bg-white/40 dark:bg-slate-900/40 border border-gray-200/50 dark:border-slate-700/30 backdrop-blur-md rounded-lg p-4 transition-colors duration-200">
  Sidebar content
</aside>
```

---

## 📋 Color Mapping Reference

### Light Mode
| Element | Color Class |
|---------|------------|
| Primary BG | `bg-white` |
| Secondary BG | `bg-gray-50` |
| Tertiary BG | `bg-gray-100` |
| Primary Text | `text-gray-900` |
| Secondary Text | `text-gray-600` |
| Muted Text | `text-gray-500` |
| Border | `border-gray-300` |
| Hover BG | `hover:bg-gray-200` |
| Primary Button | `bg-blue-600` |
| Primary Accent | `text-blue-600` |

### Dark Mode
| Element | Color Class |
|---------|------------|
| Primary BG | `dark:bg-slate-950` |
| Secondary BG | `dark:bg-slate-900` |
| Tertiary BG | `dark:bg-slate-800` |
| Primary Text | `dark:text-slate-100` |
| Secondary Text | `dark:text-slate-400` |
| Muted Text | `dark:text-slate-500` |
| Border | `dark:border-slate-700/30` |
| Hover BG | `dark:hover:bg-slate-800/40` |
| Primary Button | `dark:bg-cyan-600` |
| Primary Accent | `dark:text-cyan-400` |

---

## 🔄 Theme Hook Usage

### Get Current Theme
```jsx
const { theme } = useTheme();
// theme === 'light' or 'dark'
```

### Toggle Theme
```jsx
const { toggleTheme } = useTheme();
toggleTheme();
```

### Conditional Component Rendering
```jsx
const { theme } = useTheme();

return theme === 'dark' ? (
  <DarkModeComponent />
) : (
  <LightModeComponent />
);
```

### Conditional Styling (Not Recommended - Use Tailwind Instead)
```jsx
const { theme } = useTheme();

return (
  <div className={theme === 'dark' ? 'text-cyan-400' : 'text-blue-600'}>
    Text
  </div>
);

// BETTER: Use Tailwind's dark: modifier
<div className="text-blue-600 dark:text-cyan-400">Text</div>
```

---

## 🎯 Common Patterns

### Navigation Item
```jsx
<a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-gray-200 dark:hover:bg-slate-800/40 transition-colors">
  <span>📂</span> Projects
</a>
```

### List Item
```jsx
<li className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-slate-700/30 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
  <span className="text-gray-900 dark:text-slate-100">Item name</span>
  <span className="text-gray-600 dark:text-slate-400">Value</span>
</li>
```

### Form Group
```jsx
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
    Label
  </label>
  <input className="w-full bg-gray-50 dark:bg-slate-800/50 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-gray-900 dark:text-slate-100 focus:border-blue-500 dark:focus:border-cyan-500 transition-colors" />
</div>
```

### Modal/Dialog
```jsx
<div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center">
  <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700/50 rounded-lg p-6 max-w-md w-full">
    Content
  </div>
</div>
```

---

## 🚀 Best Practices

### DO ✅
- Always pair light and dark: `bg-white dark:bg-slate-950`
- Use semantic naming: blue for light, cyan for dark
- Add smooth transitions: `transition-colors duration-200`
- Test both themes regularly
- Use Tailwind's `dark:` modifier

### DON'T ❌
- Hardcode only dark mode
- Forget to update all color pairs
- Mix incompatible colors
- Use opacity without backdrop-filter for glass
- Ignore hover/focus states

---

## 📱 Responsive + Theme

```jsx
// Responsive + themed
<div className="hidden md:block bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100">
  Desktop only, themed
</div>
```

---

## 🔗 File Locations

- **Theme Context:** `src/contexts/ThemeContext.jsx`
- **Toggle Button:** `src/components/ThemeToggle.jsx`
- **Config:** `tailwind.config.js`
- **Globals:** `src/index.css`
- **TopNavbar:** `src/layouts/components/TopNavbar.jsx`

---

## ⌨️ Keyboard Shortcut

Consider adding keyboard shortcut for power users:

```jsx
useEffect(() => {
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      toggleTheme();
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [toggleTheme]);
```

---

## 🎉 You're All Set!

The theme system is ready to use. Just:
1. Import `useTheme` where needed
2. Use the hook to access `theme` and `toggleTheme`
3. Apply color classes using `dark:` prefix
4. Test in both light and dark modes

Happy theming! 🌓
