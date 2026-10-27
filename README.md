# RoboAtlas

A personal robotics learning dashboard built with React, TypeScript, and Vite: 10 ordered stages, 37 resources, and 60 assigned learning units. Includes manual lesson/group completion, Continue learning, search/content/completion filters, stage notes, dark/light themes, and progress backup/import.

## Run locally

Requires Node.js 24.x and npm. This matches the declared build runtime and the Vercel deployment runtime. From this repository, run `npm ci`, then `npm run dev`. Open <http://127.0.0.1:5173/>. Keep the terminal running. The fixed port avoids silently changing the browser storage origin.

## Build and verify

`npm test` runs curriculum and progress/backup tests. `npm run typecheck` checks TypeScript. `npm run lint` checks code. `npm run build` creates `dist/`; `npm run preview` serves that build at <http://127.0.0.1:4173/>. Upload `dist/` to an ordinary static host; no backend or account is required.

Run `npm ci` followed by `npm run check` for release verification. The check command runs the tests, ESLint, TypeScript checking, and the production build, stopping on the first failure. `npm run preview` serves the compiled `dist` files at <http://127.0.0.1:4173/> for a production smoke test; it is not the production hosting service.

## Deploy to Vercel

Import the RoboAtlas GitHub repository into a personal Vercel project. Use the repository root, `main` as the production branch, and Node.js 24.x. The committed `vercel.json` specifies the Vite framework, `npm ci` install command, `npm run check` build command, and `dist` output directory. No environment variables are required. Confirm the intended commit is on GitHub before deploying. Subsequent pushes to `main` trigger production deployments. Stage navigation uses page fragments, so no SPA path rewrite is required.

## Progress and backups

Progress is saved in localStorage under `roboatlas.progress.v1`. It survives reloads and browser restarts while site data is retained. It does not sync across devices, profiles, or containers. A different protocol, hostname, or port has separate progress. Export before moving to another origin or clearing site data. Progress & backup offers explicit JSON export, validated import with replacement confirmation, and confirmed reset. Backups contain progress, notes, and preferences; no automatic downloads occur.

## Move existing progress

Export any existing progress from the local website, open the stable production URL, and import the backup there. Verify a completion and a note survive refresh, then pin that URL in Zen. Local, preview, and production origins have separate browser storage. Future deployments preserve progress when the origin, storage schema, and stable lesson IDs stay compatible. Hosting does not add synchronization between browsers or devices.

## Curriculum and Zen

Curriculum content lives in `src/data/curriculum.ts`; preserve stable IDs when editing content. Shared playlist URLs have independent lesson IDs. The 25–30 hour estimate includes reading and pauses and is not verified video runtime. External resource availability and access terms can change.

Open the local URL in Zen and pin the tab in your Robotics workspace or add it to Essentials. Keep the same browser profile/container and URL. The local server must be running; static hosting can provide an always-available URL.
