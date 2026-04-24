# CAFE 43

CAFE 43 is a pnpm workspace that contains a React + Vite pastry shop website in `artifacts/cafe43`.

## Netlify

This repo is configured for a free Netlify static deploy:

- Build command: `pnpm run build:web`
- Publish directory: `artifacts/cafe43/dist/public`
- Config file: `netlify.toml`

The deployed site uses a browser-side mock API by default, so it does not need the original Express + PostgreSQL backend to run on Netlify. Menu changes, reviews, and orders are stored in the visitor's browser with `localStorage`.

If you want to switch back to a real API later, set:

- `VITE_API_MODE=live`
- `VITE_API_BASE_URL=https://your-api.example.com`

## Local development

Install dependencies:

```bash
corepack pnpm install
```

Run the frontend:

```bash
corepack pnpm --filter @workspace/cafe43 run dev
```

Create a production build:

```bash
corepack pnpm run build:web
```

## Admin

- Route: `/admin`
- Passcode: `cafe43admin`

In static deploy mode, admin changes are saved in the current browser only.
