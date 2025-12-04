# Phase 1: Fix Dark Mode Flash on Page Load

**Objective:** Eliminate the white flash when users with dark mode preference visit the site by applying dark mode before React hydration.

**Tasks:**
1. Create `src/app/dark-mode-script.tsx`
   - Export a React component that renders an inline `<script>` tag
   - Script must run synchronously before paint to read localStorage/system preference
   - Script applies `dark` class to `<html>` immediately if dark mode is preferred
   - Use `dangerouslySetInnerHTML` with IIFE pattern
2. Update `src/app/layout.tsx`
   - Import and render `DarkModeScript` inside `<head>` element
   - Ensure script appears before any stylesheets
3. Update `src/components/DarkModeToggle.tsx`
   - Sync with the class that may already exist from inline script
   - Avoid removing/re-adding class on hydration (no flicker)
4. Create UNIT TEST `tests/components/dark-mode-script.test.tsx`
   - Verify script output contains dark mode detection logic
   - Verify script handles localStorage preference
   - Verify script handles system preference fallback
5. Run tests: `npm test -- --testPathPattern="dark-mode"`
6. Run linting: `npm run lint`

---

# Phase 2: Fix Sidebar Scrollbar Visibility

**Objective:** Sidebar scrollbar should only appear when sidebar content exceeds viewport height, independent of main content scroll.

**Tasks:**
1. Update `src/components/DocsLayout.module.css`
   - Change sidebar height strategy from fixed `calc(100vh - 4rem)` to sticky positioning
   - Use `position: sticky` with `top: var(--header-height)` on sidebar container
   - Set `max-height: calc(100vh - var(--header-height))` with `overflow-y: auto`
   - Sidebar stays visible as user scrolls main content
2. Verify mobile styles still work correctly (sidebar should remain fixed on mobile when open)
3. Create UNIT TEST `tests/styles/sidebar-scroll.test.ts`
   - Verify CSS module contains correct sticky positioning
   - Verify overflow-y is set to auto
   - Verify max-height uses viewport calculation
4. Run tests: `npm test -- --testPathPattern="sidebar-scroll"`
5. Run linting: `npm run lint`

---

# Phase 3: Fix Jest Duplicate Mock Warnings

**Objective:** Eliminate the `jest-haste-map: duplicate manual mock found` warnings by excluding `.cache` directory from Jest's file scanning.

**Tasks:**
1. Update `jest.config.cjs`
   - Add `modulePathIgnorePatterns: ['<rootDir>/.cache']` to exclude cloned content
   - This prevents Jest from scanning mock files in downloaded Silverstripe modules
2. Create UNIT TEST `tests/jest-config.test.ts`
   - Verify jest config exports `modulePathIgnorePatterns` with `.cache` exclusion
3. Run tests: `npm test` (should show no duplicate mock warnings)
4. Run linting: `npm run lint`

---

# Phase 4: Investigate Algolia Search and Create TODO

**Objective:** Determine if Algolia search will work as-is and document required setup steps for the human.

**Tasks:**
1. Analyze `src/components/SearchBox.tsx`
   - Document required environment variables: `NEXT_PUBLIC_DOCSEARCH_APP_ID`, `NEXT_PUBLIC_DOCSEARCH_API_KEY`, `NEXT_PUBLIC_DOCSEARCH_INDEX_NAME`
   - Note that component returns null when env vars not set (graceful degradation)
2. Check if `@docsearch/react` is in `package.json` dependencies
3. Research Algolia DocSearch requirements:
   - Algolia account required with DocSearch application
   - Index must be configured to crawl the deployed site
   - API key must have search permissions
4. Create `z-algolia-todo.txt` with actionable steps:
   - How to apply for Algolia DocSearch (free for open source)
   - Required environment variables and where to set them
   - How to test locally once credentials obtained
   - Note about indexing requirements (site must be deployed first)
5. Run linting: `npm run lint`

---

# Phase 5: Remove Tailwind/Bootstrap References

**Objective:** Remove all mentions of Tailwind and Bootstrap from the codebase, update AGENTS.md tech stack.

**Tasks:**
1. Update `AGENTS.md`
   - Remove `Tailwind + Bootstrap` from Tech Stack section
   - Replace with `CSS Modules + globals.css`
2. Update `README.md`
   - Remove `Tailwind CSS + Bootstrap` from Technology Stack
   - Replace with `CSS Modules + globals.css`
3. Scan `src/app/globals.css` for any Tailwind/Bootstrap utility classes (none expected based on grep)
4. If any utility classes found in CSS, replace with equivalent regular CSS
5. Verify no references remain: `grep -ri "tailwind\|bootstrap" src/`
6. Run linting: `npm run lint`

---

# Phase 6: Remove Index.ts Barrel Files

**Objective:** Remove all index.ts files from `src/lib/*/` and update imports to reference specific modules directly.

**Tasks:**
1. Delete the following index.ts files:
   - `src/lib/content/index.ts`
   - `src/lib/utils/index.ts`
   - `src/lib/seo/index.ts`
   - `src/lib/markdown/index.ts`
   - `src/lib/versions/index.ts`
   - `src/lib/children/index.ts`
   - `src/lib/nav/index.ts`
2. Update imports in source files:
   - `src/app/layout.tsx`: `@/lib/seo` → `@/lib/seo/metadata`
   - `src/app/en/[version]/[[...slug]]/page.tsx`: Update nav, seo, versions imports
   - `src/components/Sidebar.tsx`: Update nav imports
   - `src/components/VersionSwitcher.tsx`: Update versions imports
   - `src/components/VersionBanner.tsx`: Update versions imports
   - `src/components/SearchBox.tsx`: Update versions imports
   - `src/components/ChildrenList.tsx`: Update children imports
   - `src/lib/content/get-document.ts`: Update utils, versions imports
   - `src/lib/children/replace-children-markers.ts`: Update utils imports
   - `src/lib/markdown/api-links.ts`: Update versions imports
   - `src/lib/slug-utils.ts`: Update versions imports
   - `src/lib/versions/get-available-slugs.ts`: Update utils imports
3. Update imports in test files:
   - `tests/page-layout.test.tsx`: Update nav, children, versions imports
   - `tests/integration/navigation.test.ts`: Update children imports
   - `tests/lib/versions/version-fallback.test.ts`: Update versions imports
4. Update `AGENTS.md`
   - Add to Standards section: "Do not create index.ts barrel files in lib/ subdirectories. Import directly from specific module files."
5. Run tests: `npm test`
6. Run linting: `npm run lint`

---

# Phase 7: Rename seo to metadata

**Objective:** Rename `src/lib/seo/` directory to `src/lib/metadata/` for better naming.

**Tasks:**
1. Rename directory `src/lib/seo/` to `src/lib/metadata/`
2. Update imports in source files:
   - `src/app/layout.tsx`: `@/lib/seo/metadata` → `@/lib/metadata/metadata`
   - `src/app/en/[version]/[[...slug]]/page.tsx`: Update seo import
3. Rename test directory `tests/lib/seo/` to `tests/lib/metadata/`
4. Update `AGENTS.md` Project Structure section:
   - Replace `seo/` with `metadata/`
   - Update Key Modules section reference
5. Run tests: `npm test`
6. Run linting: `npm run lint`

---

# Phase 8: Move Utils Files

**Objective:** Move `src/lib/github-utils.ts` and `src/lib/slug-utils.ts` to `src/lib/utils/`.

**Tasks:**
1. Move `src/lib/github-utils.ts` to `src/lib/utils/github-utils.ts`
2. Move `src/lib/slug-utils.ts` to `src/lib/utils/slug-utils.ts`
3. Update imports in source files:
   - `src/components/EditOnGithub.tsx`: Update github-utils import path
   - `src/lib/versions/get-available-slugs.ts`: Update slug-utils import (already uses @/lib/utils)
   - `src/lib/content/get-document.ts`: Update normalizeSlug import path if needed
4. Update imports in test files:
   - `tests/lib/github-utils.test.ts` → move to `tests/lib/utils/github-utils.test.ts`
   - `tests/lib/slug-utils.test.ts` → move to `tests/lib/utils/slug-utils.test.ts`
5. Update `AGENTS.md` Key Modules section if needed
6. Run tests: `npm test`
7. Run linting: `npm run lint`

---

# Phase 9: Reorganize Root-Level Test Files

**Objective:** Move root-level test files in `/tests` to appropriate subdirectories matching src/ structure.

**Tasks:**
1. Move test files to subdirectories:
   - `tests/api-links-and-code-fences.test.ts` → `tests/lib/markdown/api-links-and-code-fences.test.ts`
   - `tests/cache-path-integration.test.ts` → `tests/integration/cache-path-integration.test.ts`
   - `tests/clean-html.test.ts` → `tests/lib/markdown/clean-html.test.ts`
   - `tests/global-config.test.ts` → `tests/lib/global-config.test.ts`
   - `tests/header.test.tsx` → `tests/components/header-main.test.tsx` (rename to avoid conflict)
   - `tests/image-handling-integration.test.ts` → `tests/integration/image-handling-integration.test.ts`
   - `tests/markdown-integration.test.ts` → `tests/integration/markdown-integration.test.ts`
   - `tests/page-layout.test.tsx` → `tests/integration/page-layout.test.tsx`
   - `tests/search-box.test.tsx` → `tests/components/search-box.test.tsx`
   - `tests/sidebar.test.tsx` → `tests/components/sidebar-main.test.tsx` (rename to avoid conflict)
   - `tests/syntax-highlight.test.ts` → `tests/lib/markdown/syntax-highlight.test.ts`
   - `tests/version-switching.test.tsx` → `tests/integration/version-switching.test.tsx`
2. Update any relative imports within moved test files if necessary
3. Run tests: `npm test`
4. Run linting: `npm run lint`

---

# Phase 10: Update README.md and AGENTS.md

**Objective:** Rewrite README.md to be current. Verify AGENTS.md reflects all new standards.

**Tasks:**
1. Find any documentation scattered around in subdirectories (e.g., `scripts/README.md`) and move that content to the root level README.md, then delete the scattered documentation files.
2. Rewrite `README.md`:
   - Quick start commands
   - Docs/User context switching
   - Project structure overview
   - Development workflow
   - Testing instructions
   - Remove outdated info (Tailwind, Bootstrap references)
   - Ensure there are instructions for setting all environment variables (Algolia search)
3. Update `AGENTS.md`:
   - Add useEffect positioning standard (already present, verify)
   - Add cx() className standard for combining class names
   - Update project structure if changed (seo → metadata)
   - Verify tech stack is current (no Tailwind/Bootstrap)
   - Ensure all commands are accurate
   - Add note about not creating index.ts barrel files
4. Delete `scripts/README.md` after merging content
5. Verify no broken references
6. Run linting: `npm run lint`
