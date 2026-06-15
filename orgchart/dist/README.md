# AllScale Org Chart

Self-contained interactive org chart. Edit-protected with a 4-digit PIN (default `2026` — change it in `app.jsx` before deploying if you want a different one).

## Deploy to GitHub Pages

1. Create a new GitHub repository (public).
2. Upload `index.html` to the repo root (rename it if you want, but `index.html` is what GitHub Pages serves automatically).
3. In the repo go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
5. Save. After ~1 minute your site is live at:
   `https://<your-username>.github.io/<repo-name>/`

That's it — no build step, no Node, no dependencies to install. The page loads React + Babel from a CDN and runs entirely in the browser.

## Notes

- All data is stored in the visitor's `localStorage`. The chart they see is local to their browser; edits don't sync between users or devices.
- The PIN gates edit mode. View mode is always available without a PIN.
- File size is ~2.3 MB (one HTML file with everything inlined).
