# RoboAtlas

RoboAtlas is a personal robotics learning dashboard built with React, TypeScript, and Vite. The roadmap is organized into stages, core learning sections, and linked resources. Includes section completion, Continue learning, search and filters, dark/light themes, optional resources, and progress backup/import.

## Run locally

Requires Node.js 24.x and npm. This matches the declared build runtime and the Vercel deployment runtime. From this repository, run `npm ci`, then `npm run dev`. Open <http://127.0.0.1:5173/>. Keep the terminal running. The fixed port avoids silently changing the browser storage origin.

## Build and verify

`npm test` runs curriculum and progress/backup tests. `npm run typecheck` checks TypeScript. `npm run lint` checks code. `npm run build` creates `dist/`; `npm run preview` serves that build at <http://127.0.0.1:4173/>. Upload `dist/` to an ordinary static host; no backend or account is required.

Run `npm ci` followed by `npm run check` for release verification. The check command runs the tests, ESLint, TypeScript checking, and the production build, stopping on the first failure. `npm run preview` serves the compiled `dist` files at <http://127.0.0.1:4173/> for a production smoke test; it is not the production hosting service.

## Deploy to Vercel

Import the RoboAtlas GitHub repository into a personal Vercel project. Use the repository root, `main` as the production branch, and Node.js 24.x. The committed `vercel.json` specifies the Vite framework, `npm ci` install command, `npm run check` build command, and `dist` output directory. No environment variables are required. Confirm the intended commit is on GitHub before deploying. Subsequent pushes to `main` trigger production deployments. Stage navigation uses page fragments, so no SPA path rewrite is required.

## Progress and backups

Progress is saved in localStorage under `roboatlas.progress.v2`. Completion belongs to core sections; optional resources do not affect totals or Continue learning. Progress survives reloads while site data is retained and does not sync between devices, profiles, containers, or origins. Version-1 progress is migrated conservatively: the original payload, unmatched completions, legacy notes, and preferences are retained. Added exercises are not completed from old video completion alone. Valid version-2 progress takes precedence, including after an uncheck or reset. Explicit JSON export/import supports both backup versions and retains legacy recovery data. Import replacement and reset require confirmation; no automatic downloads occur. Invalid stored data is preserved and blocks ordinary saves until an explicit recovery action.

## Move existing progress

Export any existing progress from the local website, open the stable production URL, and import the backup there. Verify a section completion survives refresh, then pin that URL in Zen. Local, preview, and production origins have separate browser storage. Future deployments preserve progress when the origin, storage schema, and stable lesson IDs stay compatible. Hosting does not add synchronization between browsers or devices.

## Curriculum and Zen

Core curriculum and optional resources live in `src/data/roadmap.ts`. `src/legacy/curriculum.ts` retains the original curriculum for legacy compatibility. Preserve stable IDs and exact resource selections. Source verification and workload assumptions are internal data; the website displays no study schedules or duration estimates. External resource availability and access terms can change.

Open the local URL in Zen and pin the tab in your Robotics workspace or add it to Essentials. Keep the same browser profile/container and URL. The local server must be running; static hosting can provide an always-available URL.
