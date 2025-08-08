# JP Dip Simulator (Paper Trading, Alpaca)

A minimal Next.js 14 + Tailwind app that shows daily US stock "overreactions" (top losers)
and lets you place **paper** market orders via Alpaca Paper Trading.

## Features
- Screener: previous close vs today last price; shows top 50 losers
- News filter: removes symbols with obviously negative headlines (simple keyword filter)
- Paper orders: market day orders using `/api/order` server route
- Japanese UI copy for Gen Z audience

## Local Setup

```bash
npm i
cp .env.example .env
# Put your ALPACA paper keys in .env
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel
1. Push this repo to GitHub (or import directly in Vercel).
2. In Vercel Project Settings → Environment Variables, add:
   - `ALPACA_KEY` (from paper.alpaca.markets)
   - `ALPACA_SECRET`
3. Deploy. No other config required.

## Notes
- Market data endpoints used are from `data.alpaca.markets`. Ensure your paper account has access.
- For true "real-time streaming" without exposing secrets on the client, either poll via server routes (as in this MVP) or implement a server-side WS proxy.
- This is not investment advice. Paper trading only.
