# Repository Guidelines

## Project Structure

RoboAtlas is a static React/TypeScript/Vite dashboard. `src/App.tsx` assembles the UI; `src/components/` holds components, `src/data/curriculum.ts` defines the roadmap, and `src/lib/` manages progress and backups. Styles: `src/styles.css`; assets: `public/`; tests: `tests/`. Generated `dist/` and `test-results/` are ignored.

## Build, Test, and Development

Use Node.js 24.x and npm.

- `npm ci`: install locked dependencies.
- `npm run dev`: serve at `http://127.0.0.1:5173/`.
- `npm test`, `npm run lint`, `npm run typecheck`: run Vitest, ESLint, and TypeScript checks individually.
- `npm run build`: type-check and build `dist/`.
- `npm run check`: run tests, lint, and the production build.
- `npm run preview`: serve `dist/` at `http://127.0.0.1:4173/`.

## Coding Style and Design

Match two-space indentation, double quotes, semicolons, and strict TypeScript. Use PascalCase component filenames, camelCase functions, and explicit kebab-case curriculum IDs. ESLint is configured; no formatter script exists. Keep resources visually prominent, surrounding controls compact, and dependencies and abstractions minimal.

## Testing Guidelines

Use Vitest in `tests/*.test.ts`. Cover behavior: curriculum selections and current totals (10 stages, 37 resources, 60 units), completion, resume logic, malformed storage, and backup compatibility. No coverage threshold is configured. Check UI changes on desktop and narrow mobile screens, including keyboard navigation. Reuse verification when relevant code is unchanged.

## Commits and Pull Requests

Commit each completed, verified logical change separately, following our agreed workflow. Group by purpose and dependencies; keep related implementation and tests together. Avoid unrelated refactoring and artificially tiny commits that leave the app broken.

Stage only relevant files or hunks. Before every commit, review `git diff --cached` and run `git diff --cached --check`. Use specific Conventional Commit messages, e.g. `feat: make lesson titles clickable`. Report each hash, its purpose, and checks passed or not run. PRs should explain changes, verification, and limitations; link related issues when applicable and include screenshots for UI changes. Do not push, publish, or rewrite history without explicit authorization.

## Working Safely

Before nontrivial work, explain the approach, tradeoffs, and verification. Brainstorming stays discussion until implementation is approved. Challenge unsupported assumptions with concrete reasons; stay within agreed scope.

Protect saved progress, backups, stable IDs, supplied URLs, and unrelated user changes. Preserve `roboatlas.progress.v1` compatibility, including legacy notes. Obtain approval before destructive data changes or directory/storage reorganization; explain impacts and keep recovery possible. Show proposed documentation/instruction wording and obtain approval before editing. After implementation, summarize changed files, verification, and limitations.
