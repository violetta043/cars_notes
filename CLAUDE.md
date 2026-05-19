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

A client-car management tool for an auto service ("AutoService"). Allows recording cars owned by clients, filtering and searching them, tracking warranty status and last oil change date.

**Data model** (`src/types/car.ts`):
- `id`, `createdAt?`, `model`, `year`, `vin`, `ownerName`, `ownerPhone`, `mileage`, `lastOilChange`, `hasWarranty`, `warrantyExpiry`
- `createdAt` — ISO string, set automatically on `addCar`, used for "+n за месяц" stat. Optional to stay backward-compatible with existing records.

**Persistence**: all data lives in `localStorage` via `useLocalStorage` hook. No backend, no auth.

**Audience**: still being decided — could be personal use or shared among auto-service staff.

**Language**: UI is in Russian.

## Architecture

- `src/App.tsx` — root component; holds all state (`cars`, `filter`, modal open/editing). Filtering logic via `useMemo`.
- `src/hooks/useCars.ts` — CRUD + `importCars` over the cars array.
- `src/hooks/useLocalStorage.ts` — generic localStorage hook with cross-tab sync via `storage` event.
- `src/components/` — CarCard, CarList, CarForm, SearchBar, FilterPanel, WarrantyBadge, **StatsBar**.
- `src/types/` — `car.ts` (Car interface), `filter.ts` (FilterState + helpers).
- Styles: `src/App.css` (all component styles, flat BEM-ish classes) + `src/index.css` (CSS variables, dark palette).

Entry point: `src/main.tsx` → mounts `<App />` into `#root` in `index.html`.

## Design system (dark premium)

Established on branch `feat/ui-redesign` (not yet merged to main as of 2026-05-16).

**Palette** (`src/index.css`):
- `--bg: #1e2433` — page background
- `--surface: #252d3e` — cards, modal, inputs, header
- `--border: #2d3649`
- `--accent: #6366f1` — buttons, focus rings
- `--text: #64748b` — secondary text, labels
- `--text-h: #f1f5f9` — headings, values

**Typography**: Inter (Google Fonts, 400/500/600). Headings `font-weight: 600, letter-spacing: -0.02em`. Labels (`.car-card__label`, `.filter-label`, `.form-label`) — `11px / uppercase / letter-spacing: 0.06em`.

**Header**: sticky, `--surface` bg + `border-bottom`. Brand block: red icon (`#dc2626`, `border-radius: 12px`) + "AutoService" h1 + "Учёт автомобилей" subtitle.

**StatsBar** (above toolbar): 3 tiles — total cars (+n за месяц green), active warranties (shield icon + "активных"), oil change soon (⚠ + "скоро"). Thresholds: warranty checks `warrantyExpiry >= today`; oil — `lastOilChange` null or > 180 days ago.

**Badges**: green `#34d399 / #0d2d1e`, red `#f87171 / #2d0d0d`, grey. All have shield SVG icon.

**Cards**: hover → indigo glow `box-shadow: 0 0 0 1px var(--accent-border)` + border accent.

## Known issues / backlog

### Bugs / Accessibility
- [x] Form `<label>` not linked to inputs — **fixed** via `htmlFor`/`id` (`CarForm.tsx`)
- [x] VIN no `minLength` — **fixed**, added `minLength={17}` (`CarForm.tsx`)
- [ ] Modal has no focus trap — Tab key leaves the dialog (`App.tsx`)
- [ ] `role="dialog"` missing `aria-labelledby` pointing to the `<h2>` (`App.tsx`)
- [ ] `SearchBar` input has no label or `aria-label` (`SearchBar.tsx`)

### UX
- [ ] `window.confirm` for delete — replace with inline confirmation in the card (`App.tsx`)
- [ ] No sort options on the car list (currently insertion order)
- [x] No export/import — **done**: JSON export/import via header buttons

### Code cleanup (низкий приоритет)
- [ ] `src/assets/react.svg` and `src/assets/vite.svg` — unused template assets
- [ ] `FilterPanel` calls `new Date().getFullYear()` on every render — should be a module-level constant
- [ ] Modal not in a React portal (renders inside `#root`)

## Git / branch state (2026-05-16)

- `main` — стабильная ветка, включает: кросс-вкладочный sync, JSON экспорт/импорт, VIN поле, кастомные скроллбары, фиксы меток формы
- `feat/ui-redesign` — активная ветка дизайна, **не смержена в main**. Содержит весь dark premium редизайн (палитра, Inter, StatsBar, brand header, бейджи с иконками). Следующий шаг: PR → merge в main.

## Changelog

### 2026-05-16 — ветка feat/ui-redesign
- **Dark premium redesign**: палитра `#1e2433` / `#252d3e` / `#6366f1`, `color-scheme: dark`
- **Inter** подключён через Google Fonts; заголовки 600/−0.02em; метки 11px uppercase
- **StatsBar**: новый компонент с 3 плитками над поиском (всего, гарантии, масло); `Car.createdAt` добавлен для подсчёта новых за 30 дней
- **WarrantyBadge**: иконка щита во всех трёх состояниях
- **Brand header**: иконка шестерни (красный #dc2626, r-12) + "AutoService" + "Учёт автомобилей"
- **Скроллбары**: кастомные для страницы и модалки (тонкие, акцентные)
- **Карточки**: hover — indigo glow вместо plain shadow
- **Модалка**: scroll перенесён с `.modal` на `.car-form`, header больше не перекрывается

### 2026-05-13 (2)
- **Added** JSON export/import: "Экспорт" button downloads `cars-YYYY-MM-DD.json`; "Импорт" button opens a file picker, validates the JSON (must be array with `id` fields), asks for confirmation if existing data will be overwritten. Hidden `<input type="file">` triggered via `fileInputRef`. `importCars` added to `useCars`. Кнопка "Экспорт" задизейблена когда список пустой.

### 2026-05-13 (1)
- **Fixed** `useLocalStorage` cross-tab sync: added `useEffect` that listens for the `window` `storage` event and calls `setStoredValue` when another tab writes to the same key. Used `useRef` to stabilise `initialValue` and avoid re-registering the listener on every render.
