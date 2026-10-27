# RoboAtlas

A personal robotics learning dashboard built with React, TypeScript, and Vite: 10 ordered stages, 37 resources, and 60 assigned learning units. Includes manual lesson/group completion, Continue learning, search/content/completion filters, stage notes, dark/light themes, and progress backup/import.

## Run locally

Requires Node.js 22.12+ (or 20.19+) and npm. From this repository, run `npm ci`, then `npm run dev`. Open <http://127.0.0.1:5173/>. Keep the terminal running. The fixed port avoids silently changing the browser storage origin.

## Build and verify

`npm test` runs curriculum and progress/backup tests. `npm run typecheck` checks TypeScript. `npm run lint` checks code. `npm run build` creates `dist/`; `npm run preview` serves that build at <http://127.0.0.1:4173/>. Upload `dist/` to an ordinary static host; no backend or account is required.

## Progress and backups

Progress is saved in localStorage under `roboatlas.progress.v1`. It survives reloads and browser restarts while site data is retained. It does not sync across devices, profiles, or containers. A different protocol, hostname, or port has separate progress. Export before moving to another origin or clearing site data. Progress & backup offers explicit JSON export, validated import with replacement confirmation, and confirmed reset. Backups contain progress, notes, and preferences; no automatic downloads occur.

## Curriculum and Zen

Curriculum content lives in `src/data/curriculum.ts`; preserve stable IDs when editing content. Shared playlist URLs have independent lesson IDs. The 25–30 hour estimate includes reading and pauses and is not verified video runtime. External resource availability and access terms can change.

Open the local URL in Zen and pin the tab in your Robotics workspace or add it to Essentials. Keep the same browser profile/container and URL. The local server must be running; static hosting can provide an always-available URL.
