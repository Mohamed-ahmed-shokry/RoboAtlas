# Repository Guidelines

## Project Structure

RoboAtlas is a static React/TypeScript/Vite dashboard. `src/App.tsx` assembles the page; `src/components/` holds UI, `src/data/roadmap.ts` defines the current curriculum, and `src/lib/` manages current progress and backups. Retained version-1 modules live in `src/legacy/`. Styles: `src/styles.css`; assets: `public/`; tests: `tests/`, with historical tests named `legacy-*.test.ts`. Generated `dist/` and `test-results/` are ignored.

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

Keep the current section and Continue learning tied to the first unfinished core section in roadmap order. Keep section disclosure buttons separate from completion checkboxes and preserve keyboard operation. Maintain shared alignment between section titles and resource bodies, with surrounding controls visually secondary.

Maintain a neat project structure in every change. Group files by responsibility, use clear names, reuse existing modules, and remove superseded code when compatibility does not require it. Keep legacy code clearly identified and tested. Add folders or split files only when doing so makes the project easier to navigate. Keep structural cleanup in small, logical commits.

## Testing Guidelines

Use Vitest in `tests/*.test.ts`. Cover behavior: all 13 topic groups, verified stage and section totals, exact resource selections, resource placement and conservative completion mapping for added sections, completion, resume logic, malformed storage, legacy migration, and backup compatibility. No coverage threshold is configured. Check UI changes on desktop and narrow mobile screens, including keyboard navigation. Reuse verification when relevant code is unchanged.

## Commits and Pull Requests

Keep `main` stable and ready for deployment. Before implementing each new feature, create and switch to an `ms/<feature-name>` branch from `main`. Keep related changes on that branch. Merge completed features into `main` only after `npm run check` passes and the user explicitly authorizes the merge. Build deployments from `main`.

Commit each completed, verified logical change separately, following our agreed workflow. Group by purpose and dependencies; keep related implementation and tests together. Avoid unrelated refactoring and artificially tiny commits that leave the app broken.

Stage only relevant files or hunks. Before every commit, review `git diff --cached` and run `git diff --cached --check`. Use specific Conventional Commit messages, e.g. `feat: make lesson titles clickable`. Report each hash, its purpose, and checks passed or not run. PRs should explain changes, verification, and limitations; link related issues when applicable and include screenshots for UI changes. Do not push, publish, or rewrite history without explicit authorization.

## Working Safely

Explain repository work with concrete technical detail. Before implementing, describe the intended changes, the relevant files or components, the technical terms involved, and why the approach fits the request. After implementing, explain the actual changes, important CSS properties or code behavior, verification results, and limitations. Define unfamiliar terms briefly and use enough detail to make the work understandable. Keep the implementation simple and continue making small, complete logical commits.

Before nontrivial work, explain the approach, tradeoffs, and verification. Brainstorming stays discussion until implementation is approved. Challenge unsupported assumptions with concrete reasons; stay within agreed scope.

Protect saved progress, backups, stable IDs, supplied URLs, and unrelated user changes. Preserve version-1 backups and version-2 progress compatibility, including unmatched legacy data and notes. Obtain approval before destructive data changes or directory/storage reorganization; explain impacts and keep recovery possible. Show proposed documentation/instruction wording and obtain approval before editing. After implementation, summarize changed files, verification, and limitations.
