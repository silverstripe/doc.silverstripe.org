# Phase 1: Update Dependency & Remove Tailwind

**Objective:** Fix baseline-browser-mapping warning and remove all Tailwind CSS traces.

**Tasks:**
1. Carefully scan to the codebase to see if there is any Tailwind CSS usages.
2. If found, refactor those usages to standard CSS or other styling methods.
3. Update package.json
   - Run `npm i baseline-browser-mapping@latest -D` to update the dependency
   - Remove `tailwindcss` and `@tailwindcss/postcss` from devDependencies
4. Delete `tailwind.config.mjs`
5. Update `postcss.config.mjs`
   - Remove `@tailwindcss/postcss` plugin
   - Keep only autoprefixer (or make file minimal)
7. Update `src/app/globals.css`
   - Remove commented `@tailwind` directives (lines 1-3)
8. Run `npm install` to update lock file
9. Verify no Tailwind imports remain: `grep -r "tailwind" src/`
10. Run tests: `npm test`
11. When reporting back, ensure that if there were any Tailwind usages, describe how they were refactored and where to manually test those areas.

---

# Phase 2: Consolidate Tests - Move src/lib/__tests__ to tests/lib

**Objective:** Move tests from `/src/lib/__tests__/` to `/tests/lib/` to match project convention.

**Tasks:**
1. Move test files:
   - `src/lib/__tests__/config.test.ts` → `tests/lib/config.test.ts`
   - `src/lib/__tests__/sources-config.test.ts` → `tests/lib/sources-config.test.ts`
   - `src/lib/__tests__/types.test.ts` → `tests/lib/types.test.ts`
2. Update imports in moved files
   - Change `@/lib/...` imports if needed (should work unchanged)
3. Delete `src/lib/__tests__/` directory
4. Run tests: `npm test -- tests/lib/config.test.ts tests/lib/sources-config.test.ts tests/lib/types.test.ts`

---

# Phase 3: Remove tests/build and Relocate version-fallback Tests

**Objective:** Remove package.json script tests and merge version-fallback tests.

**Tasks:**
1. Delete `tests/build/BuildScripts.test.ts`
2. Delete `tests/build/DevScripts.test.ts`
3. Delete `tests/build/` directory
4. Review `tests/app/version-fallback.test.ts`
   - This tests `getVersionHomepage` and `slugExistsInVersion` from versions module
   - Move to `tests/lib/versions/version-fallback.test.ts` (create dir if needed)
5. Delete `tests/app/` directory if empty after move
6. Run tests: `npm test -- tests/lib/versions/`

---

# Phase 4: Move sources-config.ts to Project Root

**Objective:** Move `/src/lib/sources-config.ts` to `/sources-config.ts` for familiarity with old _gatsby structure.

**Tasks:**
1. Move file: `src/lib/sources-config.ts` → `sources-config.ts` (project root)
2. Update imports in:
   - `src/components/EditOnGithub.tsx`: `from '@/lib/sources-config'` → `from '@/../sources-config'`
   - `src/lib/navigation-logic.ts`: same pattern
   - `tests/lib/sources-config.test.ts`: update import path
3. Update AGENTS.md
   - Change reference from `src/lib/sources-config.ts` to `sources-config.ts`
4. Run tests: `npm test -- sources-config`

---

# Phase 5: Refactor Dark Mode Script to React Component

**Objective:** Replace inline `dangerouslySetInnerHTML` script with proper Next.js Script component.

**Tasks:**
1. Create `src/components/DarkModeScript.tsx`
   - Use Next.js `<Script strategy="beforeInteractive">` 
   - Move dark mode logic to this component
   - Export as default
2. Update `src/app/layout.tsx`
   - Remove `darkModeScript` const
   - Remove `<script dangerouslySetInnerHTML>` from head
   - Import and use `<DarkModeScript />` component
3. Create test `tests/components/DarkModeScript.test.tsx`
   - Verify component renders Script element
4. Run tests: `npm test -- DarkModeScript`

---

# Phase 6: Add ESLint with Airbnb Config

**Objective:** Add ESLint linting with Airbnb style guide, integrated into build process.

**Tasks:**
1. Install dependencies:
   - `npm i -D eslint eslint-config-airbnb-typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y`
2. Create `.eslintrc.json` with Airbnb + TypeScript config
   - Extend airbnb-typescript
   - Set parser to @typescript-eslint/parser
   - Configure parserOptions for tsconfig.json
3. Add to package.json scripts:
   - `"lint": "eslint src/ --ext .ts,.tsx"`
   - Update `"build"` to run lint before build: `"npm run lint && npm run build:docs"`
4. Update AGENTS.md
   - Add lint command to Commands section
   - Add instruction to run lint alongside tests
5. Run lint and fix critical errors (may need multiple iterations)
6. Run: `npm run lint`

---

# Phase 7: Fix Syntax Highlighting on Same-Page Navigation

**Objective:** Fix bug where clicking nav link to current page removes syntax highlighting.

**Tasks:**
1. Update `src/components/SyntaxHighlighter.tsx`
   - The issue: clicking same link doesn't trigger useEffect because pathname doesn't change
   - Solution: Add a unique key or use router events to detect navigation
   - Alternative: Use MutationObserver to watch for DOM changes, or re-run on any navigation
2. Update `src/components/Sidebar.tsx` (if needed)
   - May need to prevent default on same-page links or force re-render
3. Create/update test `tests/components/SyntaxHighlighter.test.tsx`
   - Test that highlighting is applied after navigation
4. Manual verification: Click same nav link, verify code blocks stay highlighted
5. Run tests: `npm test -- SyntaxHighlighter`

---

# Phase 8: Consolidate /src/lib Navigation/Slug Utilities

**Objective:** Reduce file fragmentation by merging related navigation/slug utilities.

**Tasks:**
1. Create `src/lib/slug-utils.ts` (new consolidated file)
   - Merge content from:
     - `src/lib/utils/slug-utils.ts` (normalizeSlug, normalizeSlugForComparison)
     - `src/lib/routing.ts` (buildSlugFromParams, extractVersionAndSlug, getAvailableVersions)
   - Export all functions from single file
2. Update `src/lib/utils/index.ts`
   - Re-export from new location for backward compatibility OR remove slug exports
3. Delete `src/lib/utils/slug-utils.ts`
4. Update `src/lib/routing.ts` 
   - Either delete file and re-export from slug-utils, OR keep as thin re-export layer
5. Update imports across codebase:
   - `src/lib/content/get-document.ts`
   - `src/lib/versions/get-available-slugs.ts`
   - `src/app/en/[version]/[[...slug]]/page.tsx`
   - Any other files importing from routing or utils/slug-utils
6. Move/update tests to `tests/lib/slug-utils.test.ts`
7. Run tests: `npm test`

---

# Phase 9: Consolidate Navigation Logic

**Objective:** Merge navigation-logic.ts functions into appropriate modules.

**Tasks:**
1. Review `src/lib/navigation-logic.ts` functions:
   - `getOptionalFeatureFromDocument` - relates to documents
   - `getDocumentGithubInfo` - relates to sources-config
   - `doesSlugExistInVersion` - relates to slug-utils
   - `getFallbackSlugForVersion` - relates to versions
   - `extractVersionAndFeatureFromSlug` - relates to slug-utils
2. Move functions:
   - GitHub-related → keep near sources-config or create `src/lib/github-utils.ts`
   - Slug/version functions → merge into `src/lib/slug-utils.ts`
3. Delete `src/lib/navigation-logic.ts`
4. Update imports in:
   - `src/components/Header.tsx`
   - Any other consumers
5. Update/create tests in `tests/lib/`
6. Run tests: `npm test`

---

# Phase 10: Final Cleanup and Verification

**Objective:** Verify all changes, update documentation, run full test suite.

**Tasks:**
1. Update AGENTS.md with new structure:
   - Remove references to deleted files/directories
   - Update Project Structure section
   - Ensure Commands section is current
2. Run full test suite: `npm test`
3. Run lint: `npm run lint`
4. Test build: `npm run mock` (verify site works)
5. Verify no orphaned files:
   - `src/lib/__tests__/` should not exist
   - `tests/build/` should not exist
   - `tests/app/` should not exist (or only if needed)
   - `tailwind.config.mjs` should not exist
6. Clean up any `z-plan-*.md` and `z-AGENTS_EPIC.md` files if requested
