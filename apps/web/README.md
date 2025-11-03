# JAMID Web

The official website for JAMID - The trustless identity layer for Polkadot JAM.

## Features

- ⚡ **Next.js 14** - App Router with Server Components
- 🎨 **Tailwind CSS** - Mobile-first responsive design
- 🌙 **Dark Mode** - Seamless light/dark theme switching
- 📦 **JSON Database** - Simple file-based content storage
- 🎯 **TypeScript** - Full type safety
- 💅 **Custom Theme** - Primary color: #E6007A (Polkadot pink)

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Content Management

All content is stored in `src/data/content.json`. The structure includes:

- **Hero** - Main title, subtitle, and CTA buttons
- **Vision** - Core mission statement
- **Why It Matters** - Feature cards
- **Governance** - Treasury information
- **Overview** - Technical specs
- **Roadmap** - Development phases
- **Footer** - Links and credits

Simply edit the JSON file to update any content on the site.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout with theme provider
│   ├── page.tsx          # Homepage composition
│   └── globals.css       # Global styles
├── components/
│   ├── Header.tsx        # Site header with theme toggle
│   ├── Hero.tsx          # Hero section
│   ├── Vision.tsx        # Vision section
│   ├── WhyItMatters.tsx  # Feature cards grid
│   ├── Governance.tsx    # Governance section
│   ├── Overview.tsx      # Technical overview
│   ├── Roadmap.tsx       # Roadmap table/cards
│   ├── Footer.tsx        # Site footer
│   ├── ThemeProvider.tsx # Theme context provider
│   └── ThemeToggle.tsx   # Theme switcher button
├── data/
│   └── content.json      # All site content
└── lib/
    └── db.ts             # Content loader utilities
```

## Design System

The design follows Vercel's minimalist approach with:

- Clean typography (Inter font)
- Subtle borders and shadows
- Smooth transitions
- Mobile-first responsive layouts
- Primary accent color: #E6007A

## Build

To create a production build:

```bash
npm run build
npm run start
```

## License

Built with ❤️ by Snowinch S.L. for the Polkadot ecosystem.
