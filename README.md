# Custom Drop Zone

A lightweight, zero-dependency file drop zone with a modern dark/light UI inspired by shadcn.

## Features

- Drag & drop or click-to-browse file selection
- Image thumbnail preview generated client-side
- Simulated upload progress bar per file
- File validation — type and size (max 10 MB)
- Light / dark mode toggle with `localStorage` persistence
- No frameworks, no build step — plain HTML, CSS, JS

## Accepted Formats

`PNG` `JPG / JPEG` `WEBP` `AVIF`

## Project Structure

```
DropZone/
├── index.html   # Markup and layout
├── style.css    # Design tokens, themes, component styles
└── main.js      # Drag events, file handling, theme toggle
```

## Usage

Open `DropZone/index.html` directly in a browser — no server required.

```bash
# or serve locally with any static server, e.g.
npx serve DropZone
```

## Notes

The progress bar is **simulated** — it animates a random increment on a timer and does not reflect a real network upload. To use this with a real backend, replace `simulateUpload()` in `main.js` with an `XMLHttpRequest` upload using the `upload.onprogress` event.
