# MeFlex site

This folder is the MeFlex web app that GitHub Pages serves at `https://ccomp2013.github.io/meflex/meflex-site/meflex-site/`.

## How it's updated
- **Built from source:** every file here comes from the private source repository (`meflex/app/build.py`). Nothing is edited here by hand.
- **Published by pull request:** each update is one pull request with only the changed files (pictures and clips in `figures/`, `index.html` and `sw.js`).
  - **Check:** Cowork runs the publish check and merges.
  - **Approval:** Chris approves anything going live.
- **Two files always together:** `index.html` and `sw.js`. The offline worker's version must match the page.

## What's here
- `index.html`: the whole app.
- `sw.js`: the offline worker. It keeps the app's own files at install. Each picture, clip and recording is kept the first time it's used.
- `figures/`: each stretch's picture for both coaches (192, 640 and 960 px), plus the Show me clips (`*-loop.mp4`).
- `voice/`: the recorded coach voice.
- The icons and `manifest.webmanifest`, for the Home Screen.

## Add it to your iPhone Home Screen
1. Open the address in **Safari**.
2. Tap **Share**, then **Add to Home Screen**.
3. Tap **Add**.

## Notes
- **Analytics stays off** until a key is added in the source. With no key, Settings says MeFlex collects nothing.
- **The site is public:** anyone with the link can open it.
- **Your data stays on the phone:** routine times, history, settings and setup answers are stored only in that phone's browser.
