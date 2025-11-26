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

# Phase 2: Update clone-docs.mjs to Output to Context-Specific Subdirectory

**Objective:** The clone script writes content to `.cache/docs/` or `.cache/user/` based on DOCS_CONTEXT env variable (defaulting to 'docs').

**Tasks:**
1. Update `scripts/clone-docs.mjs`
   - Change output path from `.cache/content/v{version}` to `.cache/{context}/v{version}` where context is from `DOCS_CONTEXT` env var (default: 'docs')
   - Update `buildRepoConfig()` function line 161 to use context in path
   - Update temp clone dir to include context to avoid conflicts: `.cache/temp-clones/{context}/...`
2. Create UNIT TEST `tests/scripts/clone-docs-path.test.ts`
   - Mock file system operations
   - Verify `buildRepoConfig()` returns correct output path for DOCS_CONTEXT=docs
   - Verify `buildRepoConfig()` returns correct output path for DOCS_CONTEXT=user
   - Verify default is 'docs' when DOCS_CONTEXT is not set
3. Run tests: `npm test -- tests/scripts/clone-docs-path.test.ts`

---

# Phase 3: Update get-document.ts Content Path Resolution

**Objective:** The document loading reads from `.cache/{context}/` instead of `.cache/content/` based on DOCS_CONTEXT.

**Tasks:**
1. Update `src/lib/content/get-document.ts`
   - Modify `resolveContentBasePath()` (line 33-57) to use `.cache/{docsContext}/` instead of `.cache/content/`
   - When `useMockData` is false, build path as: `path.join(process.cwd(), '.cache', config.docsContext)`
2. Update existing tests `tests/lib/content/get-document.test.ts`
   - Verify tests still pass (mock data path unchanged)
3. Update `tests/lib/content/docs-context-filter.test.ts`
   - Verify tests still pass with new path logic
4. Run tests: `npm test -- tests/lib/content/`

---

# Phase 4: Update copy-images.mjs for Context-Specific Source

**Objective:** The image copy script reads from `.cache/{context}/` based on DOCS_CONTEXT env variable.

**Tasks:**
1. Update `scripts/copy-images.mjs`
   - Modify line 90 to read `DOCS_CONTEXT` env var (default: 'docs')
   - Change real content source from `.cache/content` to `.cache/{context}`
2. Create UNIT TEST `tests/scripts/copy-images-path.test.ts`
   - Verify correct source path for DOCS_CONTEXT=docs
   - Verify correct source path for DOCS_CONTEXT=user
   - Verify mock data path is unchanged (tests/fixtures/mock-content)
3. Run tests: `npm test -- tests/scripts/copy-images-path.test.ts`

---

# Phase 5: Update resolve-image-paths.ts Comments and Documentation

**Objective:** Documentation and comments accurately reflect the new `.cache/{context}/` structure.

**Tasks:**
1. Update `src/lib/markdown/resolve-image-paths.ts`
   - Update comment on line 27 from `.cache/content/` to `.cache/{docs|user}/`
2. Update `IMAGE_HANDLING.md`
   - Change line 145 reference from `.cache/content/` to `.cache/{docs|user}/`
3. Update `scripts/README.md`
   - Update line 27 reference from `.cache/content/` to `.cache/{docs|user}/`
4. Update `AGENTS.md`
   - Update line 30 reference from `.cache/content/` to `.cache/{docs|user}/`
   - Update line 32 reference from `.cache/content/` to `.cache/{docs|user}/`
5. Run all tests to verify no regressions: `npm test`

---

# Phase 6: Verify End-to-End Functionality

**Objective:** Confirm the entire system works with the new cache structure.

**Tasks:**
1. Verify all existing tests pass
   - Run `npm test`
2. Verify mock development still works
   - Confirm `tests/fixtures/mock-content/` structure unchanged
   - Verify `npm run mock` command compatibility (uses NEXT_USE_MOCK_DATA=true, bypasses .cache)
3. Create integration test `tests/cache-path-integration.test.ts`
   - Test that resolveContentBasePath returns correct path for docs context
   - Test that resolveContentBasePath returns correct path for user context
   - Test that mock data path is used when NEXT_USE_MOCK_DATA=true
4. Run tests: `npm test -- tests/cache-path-integration.test.ts`
5. Run full test suite: `npm test`

---

# Phase 7: Fix syntax highlighting on client-side navigation

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

# Phase 8: Version switcher fallback to version homepage

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

# Phase 9: Integration testing and cleanup

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
