# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with HMR at localhost:5173
npm run build     # Type-check then bundle for production (output: dist/)
npm run lint      # Run ESLint across all TS/TSX files
npm run preview   # Serve the production build locally
```

No test runner is configured.

## Stack

- **React 19** with TypeScript, bundled by **Vite 8**
- ESLint uses `typescript-eslint` (recommended, not strict type-checked), `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`
- `@vitejs/plugin-react` (Oxc transform, not SWC)

## What this app does

A client-car management tool for an auto service. Allows recording cars owned by clients, filtering and searching them, tracking warranty status and last oil change date.

**Data model** (`src/types/car.ts`):
- `id`, `model`, `year`, `vin`, `ownerName`, `ownerPhone`, `mileage`, `lastOilChange`, `hasWarranty`, `warrantyExpiry`

**Persistence**: all data lives in `localStorage` via `useLocalStorage` hook. No backend, no auth.

**Audience**: still being decided — could be personal use or shared among auto-service staff.

**Language**: UI is in Russian.

## Architecture

- `src/App.tsx` — root component; holds all state (`cars`, `filter`, modal open/editing). Filtering logic via `useMemo`.
- `src/hooks/useCars.ts` — CRUD over the cars array (add / update / delete).
- `src/hooks/useLocalStorage.ts` — generic localStorage hook with cross-tab sync via `storage` event.
- `src/components/` — CarCard, CarList, CarForm, SearchBar, FilterPanel, WarrantyBadge.
- `src/types/` — `car.ts` (Car interface), `filter.ts` (FilterState + helpers).
- Styles: `src/App.css` (all component styles, flat BEM-ish classes) + `src/index.css` (CSS variables, resets, dark mode).

Entry point: `src/main.tsx` → mounts `<App />` into `#root` in `index.html`.

## Known issues / backlog

Items identified in code review, ordered roughly by priority:

### Bugs / Accessibility
- [ ] Form `<label>` elements not linked to inputs via `htmlFor`/`id` — clicking a label doesn't focus the field, screen readers are blind to the relationship (`CarForm.tsx`)
- [ ] VIN field has no `minLength` — can save a 1-character VIN (`CarForm.tsx`)
- [ ] Modal has no focus trap — Tab key leaves the dialog (`App.tsx`)
- [ ] `role="dialog"` missing `aria-labelledby` pointing to the `<h2>` (`App.tsx`)
- [ ] `SearchBar` input has no label or `aria-label` (`SearchBar.tsx`)

### UX
- [ ] `window.confirm` for delete — replace with inline confirmation in the card (`App.tsx:69`)
- [ ] No sort options on the car list (currently insertion order)
- [x] No export/import — **done**: JSON export/import via header buttons (`App.tsx`, `useCars.ts`)

### Code cleanup
- [ ] `index.css` contains leftover Vite template styles (h1 56px, `#social`, `.counter`, `code`) not used by the app
- [ ] `src/assets/react.svg` and `src/assets/vite.svg` are unused template assets
- [ ] `<title>` in `index.html` is still "car"
- [ ] `FilterPanel` calls `new Date().getFullYear()` on every render — should be a module-level constant
- [ ] Modal not in a React portal (renders inside `#root`)
- [ ] `.form-input--mono` defined in the car-card section of `App.css` instead of near form styles

## Changelog

### 2026-05-13 (2)
- **Added** JSON export/import: "Экспорт" button downloads `cars-YYYY-MM-DD.json`; "Импорт" button opens a file picker, validates the JSON (must be array with `id` fields), asks for confirmation if existing data will be overwritten. Hidden `<input type="file">` triggered via `fileInputRef`. `importCars` added to `useCars`. Кнопка "Экспорт" задизейблена когда список пустой.

### 2026-05-13 (1)
- **Fixed** `useLocalStorage` cross-tab sync: added `useEffect` that listens for the `window` `storage` event and calls `setStoredValue` when another tab writes to the same key. Used `useRef` to stabilise `initialValue` and avoid re-registering the listener on every render.
