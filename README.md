# EPL Data Analytics

An interactive dashboard exploring English Premier League match data.

**Live site:** https://epl-data-analytics.vercel.app/

## What it answers

- **Is home advantage real?** League-wide home wins vs away wins vs draws, with win rates.
- **Do more shots on goal mean more goals?** A scatter plot of every match, filterable by team.
- **Does discipline cost points?** For a selected team, cards (yellow = 1, red = 3) plotted against points earned, with a trend line.
- **What happened in a match?** Pick a fixture to see its match statistics and an event timeline of goals, cards and substitutions.

The dataset covers 51 Premier League fixtures (24 Jan – 23 Feb 2026) across all 20 teams.

## Built with

- React 19 + Vite
- React Router
- Material UI and MUI X Charts
- Chart.js
- Tailwind CSS

## Running locally

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # production build
```

## Data

Match data comes from [API-FOOTBALL](https://www.api-football.com/) and is stored as static JSON in `public/data/`, so the app needs no API key to run. This is an independent project made for learning and portfolio purposes.
