# Tailwind CSS v4 Setup Guide for Nuxt 4

This guide covers how Tailwind CSS v4 is set up in this project and how to customize it.

## 📦 Installation

For complete installation instructions, refer to the official documentation:
**[Tailwind CSS Installation for Nuxt](https://tailwindcss.com/docs/installation/framework-guides/nuxt)**

## 🎨 Tailwind v4: What's Different?

Tailwind CSS v4 is a **major architectural change** from v3. Here are the key differences:

### ❌ No More JavaScript Config File

In Tailwind v3, you had a `tailwind.config.js` file like this:

```javascript
// ❌ This is v3 - NOT used in v4
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
      },
    },
  },
};
```

**In Tailwind v4, there is NO `tailwind.config.js` file!**

The command `npx tailwindcss init` will not work with v4 because configuration is handled completely differently.

### ✅ CSS-Based Configuration

Instead of JavaScript, Tailwind v4 uses **CSS variables** and the `@theme` directive for configuration.

All customization happens directly in your CSS file (`app/assets/css/main.css`):

```css
@import "tailwindcss";

@theme {
  /* Your custom design tokens here */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
}
```

## 🛠️ How to Customize Tailwind v4

### Custom Colors

Define colors using the `--color-*` naming convention:

```css
@theme {
  /* Custom brand colors */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-accent: #ec4899;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
}
```

**Usage in HTML:**

```html
<div class="bg-primary text-white">Primary background</div>
<button class="bg-accent hover:bg-accent/90">Accent button</button>
<p class="text-success">Success message</p>
```

### Custom Spacing

Define custom spacing values using `--spacing-*`:

```css
@theme {
  --spacing-128: 32rem; /* 512px */
  --spacing-144: 36rem; /* 576px */
  --spacing-192: 48rem; /* 768px */
}
```

**Usage:**

```html
<div class="mt-128">Large top margin</div>
<div class="p-192">Extra large padding</div>
```

### Custom Fonts

Define font families using `--font-*`:

```css
@theme {
  --font-display: ui-serif, Georgia, Cambria, "Times New Roman", serif;
  --font-body: system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: ui-monospace, "Cascadia Code", "Source Code Pro", monospace;
}
```

**Usage:**

```html
<h1 class="font-display text-4xl">Display Heading</h1>
<p class="font-body">Body text</p>
<code class="font-mono">Code snippet</code>
```

### Custom Breakpoints

Define custom responsive breakpoints using `--breakpoint-*`:

```css
@theme {
  --breakpoint-xs: 475px;
  --breakpoint-3xl: 1920px;
  --breakpoint-4xl: 2560px;
}
```

**Usage:**

```html
<div class="text-base 3xl:text-6xl">Scales up at 3xl screens</div>
```

### Custom Shadows

Define custom box shadows:

```css
@theme {
  --shadow-glow: 0 0 20px rgba(59, 130, 246, 0.5);
  --shadow-brutal: 8px 8px 0 0 rgba(0, 0, 0, 1);
}
```

**Usage:**

```html
<div class="shadow-glow">Glowing box</div>
<div class="shadow-brutal">Brutal shadow</div>
```

### Custom Animations

Define custom animations:

```css
@theme {
  --ease-bouncy: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes wiggle {
  0%,
  100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
}

@theme {
  --animate-wiggle: wiggle 1s ease-in-out infinite;
}
```

**Usage:**

```html
<div class="animate-wiggle">Wiggling element</div>
```

## 📝 Complete Example Configuration

Here's a complete example of a custom Tailwind v4 configuration in `app/assets/css/main.css`:

```css
@import "tailwindcss";

/* Tailwind v4 Configuration using @theme directive */
@theme {
  /* Brand Colors */
  --color-brand-blue: #3b82f6;
  --color-brand-purple: #8b5cf6;
  --color-brand-pink: #ec4899;

  /* Semantic Colors */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #06b6d4;

  /* Spacing */
  --spacing-128: 32rem;
  --spacing-144: 36rem;

  /* Fonts */
  --font-display: "Inter Display", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Inter", ui-sans-serif, system-ui, sans-serif;

  /* Breakpoints */
  --breakpoint-3xl: 1920px;

  /* Custom Shadows */
  --shadow-soft: 0 2px 15px -3px rgba(0, 0, 0, 0.07);
  --shadow-glow-blue: 0 0 20px rgba(59, 130, 246, 0.4);
}

/* Custom Utility Classes */
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .text-pretty {
    text-wrap: pretty;
  }
}

/* Custom Components (if needed) */
@layer components {
  .btn-primary {
    @apply bg-brand-blue text-white px-4 py-2 rounded-lg font-medium;
    @apply hover:bg-brand-blue/90 transition-colors;
  }
}
```

## 🎯 Using Custom Theme Values

Once you've defined your custom theme values, use them like any other Tailwind utility:

```vue
<template>
  <div>
    <!-- Custom Colors -->
    <h1 class="text-brand-blue">Brand Blue Heading</h1>
    <div class="bg-success text-white p-4">Success message</div>

    <!-- Custom Spacing -->
    <section class="mt-128 mb-144">Large spacing section</section>

    <!-- Custom Fonts -->
    <h2 class="font-display text-4xl">Display Font</h2>
    <p class="font-body">Body text</p>

    <!-- Custom Shadows -->
    <div class="shadow-soft">Soft shadow card</div>
    <button class="shadow-glow-blue">Glowing button</button>

    <!-- Custom Utility -->
    <p class="text-balance">Balanced text for better readability</p>

    <!-- Custom Component -->
    <button class="btn-primary">Primary Button</button>

    <!-- Responsive with custom breakpoint -->
    <div class="text-base 3xl:text-6xl">Scales at 3xl</div>
  </div>
</template>
```

## 🔧 Layers System

Tailwind v4 maintains the layers system for organizing custom styles:

### `@layer utilities`

For single-purpose utility classes:

```css
@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### `@layer components`

For reusable component patterns:

```css
@layer components {
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }

  .btn {
    @apply px-4 py-2 rounded font-medium transition-colors;
  }

  .input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md;
    @apply focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}
```

### `@layer base`

For base styles and resets:

```css
@layer base {
  h1 {
    @apply text-3xl font-bold;
  }

  h2 {
    @apply text-2xl font-semibold;
  }

  a {
    @apply text-blue-600 hover:text-blue-800;
  }
}
```

## 💡 Best Practices

### 1. **Use CSS Variables for Theming**

CSS variables in `@theme` can be dynamically changed with JavaScript, enabling dark mode or theme switching:

```css
@theme {
  --color-primary: light-dark(#3b82f6, #60a5fa);
  --color-background: light-dark(#ffffff, #1f2937);
}
```

### 2. **Keep Configuration in CSS**

All theme customization should live in your CSS file. This keeps everything in one place and leverages CSS's native features.

### 3. **Use Semantic Naming**

Name your custom values semantically:

```css
@theme {
  /* ✅ Good - Semantic */
  --color-primary: #3b82f6;
  --color-success: #10b981;

  /* ❌ Bad - Not semantic */
  --color-blue-500: #3b82f6;
  --color-green-500: #10b981;
}
```

### 4. **Leverage the `@apply` Directive Sparingly**

Only use `@apply` for truly reusable components:

```css
/* ✅ Good - Reusable component */
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded;
}

/* ❌ Bad - Just use utilities in HTML */
.my-div {
  @apply mt-4 mb-2 px-3;
}
```

### 5. **Use Modifiers and Variants**

Take advantage of Tailwind's built-in modifiers:

```html
<button
  class="bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-primary disabled:opacity-50"
>
  Button
</button>
```

## 🐛 Troubleshooting

### "The command `npx tailwindcss init` doesn't work"

**This is normal!** Tailwind v4 doesn't use a JavaScript config file. Configure Tailwind directly in your CSS using the `@theme` directive.

### Custom classes not working

Make sure you're using the correct naming conventions:

- Colors: `--color-name`
- Spacing: `--spacing-name`
- Fonts: `--font-name`
- Breakpoints: `--breakpoint-name`

### Styles not updating

Try clearing the Nuxt cache:

```bash
rm -rf .nuxt
npm run dev
```

## 📚 Additional Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS v4 Theme Variables](https://tailwindcss.com/docs/theme-variables)
- [Tailwind CSS Functions and Directives](https://tailwindcss.com/docs/functions-and-directives)
- [Nuxt + Tailwind Guide](https://tailwindcss.com/docs/installation/framework-guides/nuxt)

---

**Note:** This project uses Tailwind CSS v4, which is fundamentally different from v3. If you see tutorials or Stack Overflow answers about `tailwind.config.js`, they are for v3 and won't apply to this project.
