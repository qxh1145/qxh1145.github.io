# Tran Anh Quan · Portfolio

Personal portfolio, live at <https://qxh1145.github.io/>.

## Stack

React 18 and Vite. No UI library: the page is one component with hand-written CSS and generated SVG artwork.

The site is in English and Vietnamese. It opens in the visitor's browser language and remembers the choice made with the EN/VI button.

## Structure

- `src/data.js`: all content and interface text in both languages (profile, projects, experience, process, contacts). Edit this file to change what the site says.
- `src/FolderTabPortfolio.jsx`: the page component.
- `src/graphics.jsx`: stroke lettering, the signature and the generated SVG art.
- `src/FolderTabPortfolio.css`: styles for the light and dark themes.
- `src/assets/`: portrait and project cover screenshots.

## Run

```bash
npm install
npm run dev
```

`npm run deploy` builds the site and pushes `dist/` to the `gh-pages` branch, which GitHub Pages serves.

## Credits

The layout and visual design come from the "Folder Tab Portfolio Template" shown in a 21st.dev component workshop: <https://21stdev-my-components-one.vercel.app/#folder-tab-portfolio-template>.

Adapted for this site: the content and its data layer, the English/Vietnamese switch (with Vietnamese diacritics added to the stroke lettering), real project screenshots, live-demo links, readable colour contrast, and fixes for phone layouts.
