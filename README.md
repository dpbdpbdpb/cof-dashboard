# COF Portfolio Dashboard

Clinical-Operational-Financial Three-Pillar Governance Dashboard for CommonSpirit Health.

## Setup

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

```bash
npm run build
# Push dist/ to gh-pages branch
```

## Data Flow

- **Linear API** → Fetches live issue data from Linear projects
- **data/*.json** → Cached/transformed data for dashboard
- **docs/*.md** → Observable Framework pages

## Project IDs

| Service Line | Linear Project ID |
|--------------|-------------------|
| Cardiovascular | `67cab51b-1c35-4d13-b4fa-20800fafb8fa` |
| Orthopedic | `f94960e7-254e-4987-92bc-a2d36d643cf5` |
| Neuroscience | `14140c87-a1a4-4c2a-bcf7-936ad14174f7` |

## Structure

```
cof-dashboard/
├── .env                    # LINEAR_API_KEY
├── observablehq.config.js  # Observable Framework config
├── package.json
├── data/
│   ├── linear-issues.json.js  # Linear API data loader
│   └── service-lines.json     # Service line config
└── docs/
    ├── index.md            # Main dashboard
    ├── style.css           # CommonSpirit branding
    └── components/         # Reusable components
```
