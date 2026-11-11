# MeFlex site

Upload everything in this folder to a GitHub repository and turn on GitHub Pages.

1. On github.com, create a new repository (for example `meflex`).
2. Choose **Add file → Upload files**, drag in all the files from this folder, and commit.
3. Open **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, then pick branch **main** and folder **/ (root)**. Save.
4. After a minute or two the address appears at the top of that page, for example `https://YOUR-USERNAME.github.io/meflex/`.

## Add it to your iPhone home screen
1. Open the address in **Safari**.
2. Tap **Share**, then **Add to Home Screen**.
3. Tap **Add**.

MeFlex then opens full-screen with its own icon.

## Notes
- **Analytics stays off** until a PostHog key is added. The key lives in the project's `app/analytics.config.js`; this folder keeps the placeholder.
- **The site is public:** a GitHub Pages address can be opened by anyone who has the link.
- **Your data stays on the phone:** routine times, history, settings and setup answers are stored only in that phone's browser.
