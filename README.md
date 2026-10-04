# ⚽ EPL Data Analytics

An interactive dashboard for exploring English Premier League match data. Built with React and Vite, it turns raw fixture data into charts that answer a few classic football questions.

**🔗 Live demo:** [epl-data-analytics.vercel.app](https://epl-data-analytics.vercel.app/)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-7-007FFF?logo=mui&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)

<!-- Add a screenshot or GIF of the dashboard here, e.g.:
![Dashboard screenshot](docs/screenshot.png)
-->

---

## 📊 What it answers

| Question | How the dashboard explores it |
| --- | --- |
| **Is home advantage real?** | League-wide breakdown of home wins vs. away wins vs. draws, with win rates. |
| **Do more shots on goal mean more goals?** | A scatter plot of every match, filterable by team. |
| **Does discipline cost points?** | For a selected team, cards (yellow = 1, red = 3) plotted against points earned, with a trend line. |
| **What happened in a match?** | Pick any fixture to see its match statistics and an event timeline of goals, cards, and substitutions. |

### Dataset at a glance

- **51** Premier League fixtures
- **20** teams (the full league)
- **24 Jan – 23 Feb 2026** date range

---

## 🛠️ Built with

- [React 19](https://react.dev/) + [Vite 7](https://vite.dev/) for the app and build tooling
- [React Router 7](https://reactrouter.com/) for page navigation
- [Material UI](https://mui.com/) and [MUI X Charts](https://mui.com/x/react-charts/) for UI components and charts
- [Chart.js](https://www.chartjs.org/) for additional visualizations
- [Tailwind CSS 4](https://tailwindcss.com/) for styling
- [ESLint](https://eslint.org/) for linting
- [Vercel](https://vercel.com/) for hosting

---

## 🚀 Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.19+ or 22.12+ (required by Vite 7)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/NicholasCloud4/English-Premier-League-Data-Analysis.git
cd English-Premier-League-Data-Analysis

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

No API key or environment variables are needed, since all match data ships with the repo as static JSON.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reloading |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## 📁 Project structure

```
.
├── public/
│   └── data/          # Static JSON match data (from API-FOOTBALL)
├── src/               # React components, pages, and chart logic
├── index.html         # App entry point
├── vite.config.js     # Vite configuration
├── vercel.json        # Vercel deployment config
├── eslint.config.js   # ESLint configuration
└── package.json
```

---

## 📦 Data

Match data was retrieved from [API-FOOTBALL](https://www.api-football.com/) and saved as static JSON files in `public/data/`. Bundling the data this way means the app runs entirely client-side, loads quickly, and doesn't need an API key or backend.

Because the data is a fixed snapshot, the dashboard reflects only the fixtures in the date range above and won't update automatically as the season continues.

---

## ☁️ Deployment

The app is deployed on Vercel. To deploy your own copy:

1. Fork this repository.
2. Import it into [Vercel](https://vercel.com/new).
3. Vercel auto-detects Vite, so the default settings (`npm run build`, output directory `dist`) work as-is.

The included `vercel.json` handles routing so that React Router pages load correctly on refresh.

---

## 🔮 Possible future improvements

- Expand the dataset to cover a full season (or multiple seasons)
- Add team-vs-team head-to-head comparisons
- Include expected goals (xG) and possession analysis
- Refresh data automatically via a scheduled fetch

---

## 📝 Disclaimer

This is an independent project made for learning and portfolio purposes. It is not affiliated with or endorsed by the Premier League or any of its clubs. Match data is provided by API-FOOTBALL.

---
