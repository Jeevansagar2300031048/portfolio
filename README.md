# Portfolio (Vite + React)

This is a multi-page personal portfolio built with React, Vite, React Router, and Framer Motion.

## Features

- Button-based route navigation (no scroll-based sections)
- Separate pages for Home, About, Projects, Skills, and Contact
- Pre-navigation circuit animation (0.8s)
- Smooth page transitions using Framer Motion + AnimatePresence
- Dark neon UI with glowing controls

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Main Files

- `src/App.jsx` route setup + delayed navigation logic
- `src/components/CircuitLoader.jsx` reusable pre-navigation wire/circuit animation
- `src/components/PageTransition.jsx` page enter/exit transitions
- `src/pages/Home.jsx` and `src/pages/Projects.jsx` example pages
- `src/styles.css` dark futuristic neon theme
