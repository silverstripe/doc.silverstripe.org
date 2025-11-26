# Phase 1: Split npm scripts and DOCS_CONTEXT filtering

**Objective:** npm scripts correctly set DOCS_CONTEXT environment variable, and content loading filters by category. Running `npm run dev` shows only docs content, `npm run build:user` builds only user content.

**Tasks:**
1. Update `package.json` scripts:
   - `dev` and `dev:docs`: Set `DOCS_CONTEXT=docs` before running next dev
   - `build` and `build:docs`: Set `DOCS_CONTEXT=docs` before running clone + next build
   - `build:user`: Set `DOCS_CONTEXT=user` before running clone + next build
   - `clone`: Set `DOCS_CONTEXT=docs` by default (update from current behavior)
   - `copy-images` and `copy-images:mock`: Split for docs/user contexts

2. Update `scripts/clone-docs.mjs`:
   - Already reads `DOCS_CONTEXT` env variable, no changes needed

3. Update `src/lib/config.ts`:
   - Ensure `docsContext` is properly typed and exported for use in content filtering

4. Update `src/lib/content/get-document.ts`:
   - Filter documents by `category` matching `config.docsContext`
   - Only return documents where `doc.category === config.docsContext`

5. Update `src/lib/content/build-tree.ts`:
   - Already receives category parameter, verify it's passed correctly

6. Create UNIT TEST at `tests/lib/content/docs-context-filter.test.ts`:
   - Test that `getAllDocuments()` returns only docs when `DOCS_CONTEXT=docs`
   - Test that `getAllDocuments()` returns only user when `DOCS_CONTEXT=user`
   - Mock environment variables and content appropriately

7. Run tests: `npm test -- docs-context-filter`

---

# Phase 2: Fix syntax highlighting on client-side navigation

**Objective:** Prism.js syntax highlighting applies after client-side navigation via Next.js Link component, not just on full page loads.

**Tasks:**
1. Update `src/components/RootLayoutClient.tsx`:
   - The current `useEffect` only runs once on mount
   - Need to re-run Prism highlighting when route changes
   - Add `usePathname()` from `next/navigation` as a dependency
   - Move Prism initialization to a separate function and call it on pathname change

2. Alternative approach - Create `src/components/SyntaxHighlighter.tsx`:
   - Create a client component that watches for route changes
   - Uses `usePathname()` hook to detect navigation
   - Calls `Prism.highlightAllUnder(document.body)` when pathname changes
   - Export and use in `RootLayoutClient.tsx`

3. Update `src/components/RootLayoutClient.tsx`:
   - Import and use the new SyntaxHighlighter component
   - Or add `pathname` to the useEffect dependencies

4. Create UNIT TEST at `tests/components/SyntaxHighlighter.test.tsx`:
   - Test that Prism is called on initial mount
   - Test that Prism is re-called when pathname changes
   - Mock Prism module and usePathname hook

5. Run tests: `npm test -- SyntaxHighlighter`

---

# Phase 3: Version switcher fallback to version homepage

**Objective:** When switching versions and the current page doesn't exist in target version, redirect to that version's homepage instead of showing 404.

**Tasks:**
1. Update `src/components/VersionSwitcher.tsx`:
   - Import `getAllDocuments` or create a client-safe version check
   - Before navigating, check if target path exists
   - If not found, navigate to `/en/{targetVersion}/` instead

2. Create `src/lib/versions/get-available-slugs.ts`:
   - Export a function to get all valid slugs per version
   - This can be generated at build time and exposed via a static JSON file

3. Alternative simpler approach - Update `src/app/en/[version]/[[...slug]]/page.tsx`:
   - In the page component, when `notFound()` would be called
   - Instead of `notFound()`, redirect to version homepage
   - Use `redirect()` from `next/navigation` to `/en/{version}/`

4. Create `src/app/not-found.tsx` or update existing:
   - Custom 404 page that suggests navigating to version homepages
   - Shows links to available versions

5. Update `src/components/VersionSwitcher.tsx`:
   - Use a simpler approach: just navigate and let the page handle the fallback
   - The page component will redirect if needed

6. Create UNIT TEST at `tests/components/VersionSwitcher.test.tsx`:
   - Test version switching generates correct URLs
   - Ensure it replaces version segment correctly

7. Create UNIT TEST at `tests/app/version-fallback.test.ts`:
   - Test that navigation to non-existent page in target version redirects to homepage

8. Run tests: `npm test -- VersionSwitcher version-fallback`

---

# Phase 4: Integration testing and cleanup

**Objective:** All three features work together correctly. No regressions in existing functionality.

**Tasks:**
1. Run full test suite:
   - `npm test` - ensure all 600+ existing tests pass

2. Manual testing checklist (document in test file):
   - `npm run mock` - verify docs content only (no user-help in sidebar)
   - Click sidenav links - verify syntax highlighting persists
   - Switch versions - verify fallback to homepage works

3. Update `AGENTS.md`:
   - Document new npm scripts: `dev:docs`, `build:user`
   - Document DOCS_CONTEXT environment variable
   - Update commands section with new scripts

4. Create integration test at `tests/integration/epic-features.test.ts`:
   - Test DOCS_CONTEXT filtering works
   - Test that mock data structure supports both categories
   - Test navigation preserves functionality

5. Run full test suite: `npm test`

---
