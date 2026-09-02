# Krishi Jain — Portfolio

Static one-page site pitching custom business software, plus a printable
one-page PDF (`one-pager.html` → Print → Save as PDF).

## Files

| File | Purpose |
|------|---------|
| `index.html` | the site |
| `styles.css` / `script.js` | styling + small interactions |
| `one-pager.html` | printable A4 leave-behind |
| `assets/` | images (add `krishi.jpg` for the About photo) |

## Run locally

```bash
npx serve -s .
```

Then open http://localhost:3000

## Deploy (Railway)

Railway detects Node via `package.json` and runs `npm start`, which serves the
static files with [`serve`](https://www.npmjs.com/package/serve) on `$PORT`.

1. Push this repo to GitHub.
2. Railway → **New Project → Deploy from GitHub repo** → pick this repo.
3. After the first deploy, open **Settings → Networking → Generate Domain**.

Every push to the default branch redeploys automatically.
