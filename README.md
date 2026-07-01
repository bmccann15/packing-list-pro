# Packing List Pro

A quick mobile-friendly packing checklist app built with React, TypeScript, and Vite.

## Features

- Create multiple packing lists
- Add and delete items
- Tap to check items off as packed
- Progress counter and progress bar
- Unpack/reset a list
- Duplicate a list
- Delete lists
- Saves automatically using local browser storage
- Designed for iPhone/iPad and GitHub Pages

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages setup

1. Create a GitHub repo named `packing-list-pro`.
2. Upload/push these files.
3. In GitHub, go to **Settings → Pages**.
4. Under **Build and deployment**, choose **GitHub Actions**.
5. Commit/push to `main`.
6. The live site will be available from the Pages URL after the workflow succeeds.

## Important repo-name note

In `vite.config.ts`, this line must match your repo name:

```ts
base: '/packing-list-pro/',
```

If your repo is named something else, change it before committing.
