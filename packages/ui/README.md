# @jamid/ui

A modern, neo-brutalist UI component library for Next.js applications with Tailwind CSS, dark/light theme support, and Storybook.

## Features

- 🎨 **Neo-Brutalist Design** - Bold, high-contrast components with strong borders and shadows
- 🌓 **Dark/Light Theme** - Global theme switching with ThemeProvider
- 📦 **Tree-shakeable** - Import only what you need
- 🔧 **TypeScript** - Full TypeScript support with type definitions
- 📚 **Storybook** - Interactive component documentation
- ⚡ **Fast** - Optimized for performance
- 🎯 **Accessible** - Built with accessibility in mind
- 🌈 **Customizable** - Custom theme with `#E6007A` pink primary color
- 📱 **Mobile-First** - Responsive and mobile-first design

## Components

### 🎨 Core Components
- **ThemeToggle** - Switch between light and dark themes
- **BrutalButton** - Bold buttons with strong shadows
- **BrutalInput** - Form inputs with labels and validation
- **BrutalBadge** - Status badges with various styles
- **BrutalSpinner** - Loading indicators
- **BrutalAlert** - Alert messages with icons

### 📐 Layout Components
- **Hero** - High-impact hero sections
- **Header** - Sticky headers with navigation
- **Footer** - Multi-section footers

### 📊 Data Components
- **BrutalCard** - Cards with icons and descriptions
- **BrutalTable** - Data tables with bold styling
- **CodeBlock** - Syntax-highlighted code blocks

### ✍️ Typography
- **H1, H2, H3** - Heading components
- **Paragraph** - Text paragraphs
- **Blockquote** - Quote blocks

## Installation

```bash
bun add @jamid/ui
```

## Quick Start

### 1. Setup Theme Provider

```tsx
import "@jamid/ui/styles";
import { ThemeProvider } from "@jamid/ui";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Configure Tailwind

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@jamid/ui/dist/**/*.{js,mjs}",
  ],
  darkMode: "class", // Required for theme switching
  theme: { extend: {} },
  plugins: [],
};

export default config;
```

### 3. Use Components

```tsx
import {
  Header,
  NavLink,
  Hero,
  BrutalButton,
  BrutalCard,
  CardIcon,
  CardHeading,
  CardDescription,
  ThemeToggle,
} from "@jamid/ui";

export default function Page() {
  return (
    <>
      <Header
        logo={<span className="font-black text-xl">JAMID</span>}
        navigation={
          <>
            <NavLink href="#about">About</NavLink>
            <NavLink href="#features">Features</NavLink>
          </>
        }
        actions={<ThemeToggle />}
      />

      <Hero
        title="Welcome"
        subtitle="Your amazing subtitle"
        actions={
          <>
            <BrutalButton variant="primary">Get Started</BrutalButton>
            <BrutalButton variant="outline">Learn More</BrutalButton>
          </>
        }
      />
    </>
  );
}
```

## Components API

### BrutalButton

```tsx
<BrutalButton variant="primary" size="md" fullWidth={false}>
  Click Me
</BrutalButton>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean

### BrutalInput

```tsx
<BrutalInput
  label="Email"
  placeholder="Enter email"
  error="Required field"
  helperText="We'll never share"
  fullWidth
/>
```

**Props:**
- `label`: string
- `error`: string
- `helperText`: string
- `fullWidth`: boolean

### BrutalBadge

```tsx
<BrutalBadge variant="primary" size="md">
  Badge
</BrutalBadge>
```

**Props:**
- `variant`: 'default' | 'primary' | 'success' | 'warning' | 'danger'
- `size`: 'sm' | 'md' | 'lg'

### BrutalSpinner

```tsx
<BrutalSpinner size="md" color="primary" />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `color`: 'primary' | 'foreground' | 'accent'

### BrutalAlert

```tsx
<BrutalAlert variant="info" title="Notice" icon={<Icon />}>
  Your message here
</BrutalAlert>
```

**Props:**
- `variant`: 'info' | 'success' | 'warning' | 'danger'
- `title`: string
- `icon`: ReactNode

### Hero

```tsx
<Hero
  title="Main Title"
  subtitle="Subtitle text"
  variant="default"
  actions={<BrutalButton>CTA</BrutalButton>}
/>
```

**Props:**
- `title`: string (required)
- `subtitle`: string
- `variant`: 'default' | 'primary' | 'muted'
- `actions`: ReactNode

### Header

```tsx
<Header
  sticky
  logo={<Logo />}
  navigation={<NavLink href="#home">Home</NavLink>}
  actions={<ThemeToggle />}
/>
```

**Props:**
- `logo`: ReactNode
- `navigation`: ReactNode
- `actions`: ReactNode
- `sticky`: boolean

### Footer

```tsx
<Footer
  sections={<FooterSection title="Product">...</FooterSection>}
  copyright={<p>© 2024</p>}
/>
```

### BrutalCard

```tsx
<BrutalCard variant="default" hoverable padding="md">
  <CardIcon icon={<Icon />} variant="primary" />
  <CardHeading>Title</CardHeading>
  <CardDescription>Description</CardDescription>
</BrutalCard>
```

**Props:**
- `variant`: 'default' | 'primary' | 'accent'
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `hoverable`: boolean

### BrutalTable

```tsx
<BrutalTable>
  <BrutalTableHeader>
    <BrutalTableRow>
      <BrutalTableHead>Name</BrutalTableHead>
    </BrutalTableRow>
  </BrutalTableHeader>
  <BrutalTableBody>
    <BrutalTableRow hoverable>
      <BrutalTableCell>Data</BrutalTableCell>
    </BrutalTableRow>
  </BrutalTableBody>
</BrutalTable>
```

### CodeBlock

```tsx
<CodeBlock
  language="typescript"
  filename="example.ts"
  showCopy
  code={`const hello = "world";`}
/>
```

**Props:**
- `code`: string (required)
- `language`: string
- `filename`: string
- `showCopy`: boolean

### Typography

```tsx
<H1>Main Heading</H1>
<H2>Section</H2>
<H3>Subsection</H3>
<Paragraph size="lg">Text content</Paragraph>
<Blockquote>Quote</Blockquote>
```

## Theme System

### Using the Theme Hook

```tsx
import { useTheme } from "@jamid/ui";

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current: {theme}
    </button>
  );
}
```

### Custom Colors

Override colors in your `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#YOUR_COLOR",
          foreground: "#FFFFFF",
        },
      },
    },
  },
};
```

Or use CSS variables:

```css
:root {
  --color-primary: 230 0 122; /* RGB values */
}

.dark {
  --color-primary: 230 0 122;
}
```

## Development

```bash
# Build package
npm run build

# Run Storybook
npm run storybook

# Lint
npm run lint

# Type check
npm run check-types
```

## Storybook

Explore all components interactively:

```bash
cd packages/ui
npm run storybook
```

Opens at `http://localhost:6006` with:
- All component variants
- Interactive controls
- Dark/Light theme toggle
- Complete landing page example
- Mobile-responsive previews

## Neo-Brutalist Design Principles

- **Bold Typography** - Black font weights, uppercase text
- **High Contrast** - Strong black/white contrast
- **Hard Edges** - Minimal border radius
- **Strong Borders** - 2-4px borders
- **Offset Shadows** - Directional shadows (4px 4px)
- **Functional Layout** - Grid-based structure
- **Pink Accent** - #E6007A primary color

## Example: Landing Page

Check the `Landing Page` story in Storybook for a complete example with:
- Sticky header with navigation
- Hero with CTAs
- Feature cards grid
- Governance section
- Roadmap table
- Code examples
- Multi-section footer

## Troubleshooting

**Styles not appearing:**
- Import `@jamid/ui/styles` in root layout
- Add `./node_modules/@jamid/ui/dist/**/*.{js,mjs}` to Tailwind content
- Set `darkMode: "class"` in Tailwind config
- Wrap app in `<ThemeProvider>`

**Theme not switching:**
- Verify `darkMode: "class"` in Tailwind config
- Ensure `ThemeProvider` wraps entire app

**TypeScript errors:**
- Run `npm run build` in UI package
- Restart TypeScript server

## License

MIT

---

Built with ❤️ for the Polkadot JAM ecosystem
