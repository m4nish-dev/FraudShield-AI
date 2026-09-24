# FraudShield AI

FraudShield AI is a research-grade fraud intelligence platform designed as a Command Center for analysts to investigate suspicious financial activity. It utilizes multi-model machine learning outputs (transaction, behavioural, anomaly, temporal, graph), fusion scores, attack-chain reconstruction, and an LLM investigation agent to provide unparalleled insights into fraud campaigns and risk trajectories.

**Disclaimer:** This is a BTP Research Prototype. It is *not* connected to real payment rails. All data is mock data generated for demonstration purposes.

## Tech Stack

This project is built with a modern, high-performance frontend stack:
- **Core:** React 18 + Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS (v3) + `clsx` + `tailwind-merge`
- **State Management:** Zustand
- **Icons:** Lucide React
- **Charts:** Recharts
- **Node/Graph Visualization:** React Flow (xyflow)
- **Animations:** Framer Motion

## Getting Started

To run this project locally:

1. Clone the repository and navigate into the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173` (or the port specified in your terminal).

## Folder Structure

```
frontend/
├── public/                 # Static assets (favicon, etc.)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── layout/         # AppShell, PageHeader, PageSkeleton
│   │   ├── ui/             # Primitives: Button, Badge, Card, Drawer, etc.
│   │   └── fraud/          # Domain-specific components (RiskGauge, DNA Profile, etc.)
│   ├── lib/                # Utilities: formatters, risk calculators, cn()
│   ├── mock/               # JSON mock data powering the application
│   ├── pages/              # Main route views (Dashboard, Cases, etc.)
│   ├── index.css           # Global Tailwind tokens and base styles
│   ├── main.jsx            # React root
│   └── router.jsx          # React Router configuration
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Design System

The application strictly adheres to a highly analytical, dense, and "cool-professional" design system inspired by top-tier enterprise SaaS tools. 
- **Typography:** Uses `Inter` for standard UI, `Inter Tight` for display headers, and `JetBrains Mono` for all tabular numbers, IDs, and timestamps.
- **Color Tokens:** Built entirely on semantic tokens (`surface`, `canvas`, `elevated`, `border-default`, `text-primary`, etc.) to ensure seamless dark mode rendering and visual consistency.
- **Interactions:** Subtle and deliberate micro-interactions powered by Framer Motion.

## Screenshots

*(Placeholder for Screenshots)*

- Dashboard Overview
- Investigation Showcase
- Global Fraud Network
- Analytics & Model Performance
