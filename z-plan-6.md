# Phase 1: Fix Custom Anchor ID Handling in Headings

**Objective:** Custom anchor IDs like `{#dot-notation}` should be stripped from heading text and used as the heading's ID, not displayed literally.

**Tasks:**
1. Update `src/lib/markdown/processor.ts`
   - Add a remark or rehype plugin to handle custom heading IDs with `{#id}` syntax
   - The plugin should: (a) extract `{#custom-id}` from heading text, (b) set the heading's ID to `custom-id`, (c) remove `{#custom-id}` from the visible heading text
   - This is a common Markdown Extended Syntax feature (similar to kramdown/pandoc)
2. Update `src/lib/markdown/clean-html.ts`
   - Remove or update the `cleanHeaders()` function since it's an incomplete workaround for the `<em>` issue with underscores
   - The new plugin should handle this case correctly by processing before markdown parsing mangles the syntax
3. Create UNIT TEST in `tests/lib/markdown/custom-heading-ids.test.ts`
   - Test: `## Dot notation {#dot-notation}` renders as `<h2 id="dot-notation">Dot notation</h2>`
   - Test: `### Preview states {#preview-states-php}` renders with correct ID (underscore handling)
   - Test: Headings without custom IDs still get auto-generated slugified IDs
4. Run tests: `npm test -- custom-heading-ids`

---

# Phase 2: Fix Changelog Children Not Showing in Sidenav

**Objective:** Changelog child pages should appear in sidenav even when `hideChildren: true` is set (they use [CHILDREN] for rendering but should still navigate).

**Tasks:**
1. Analyze the issue in `src/lib/nav/build-nav-tree.ts`
   - Changelogs index has `hideChildren: true` which hides children from nav
   - However, [CHILDREN] markers should still work for content rendering
   - The nav tree respects `hideChildren` correctly - this is intentional behavior
2. Investigate the dark-mode FOUT (Flash of Unstyled Content)
   - When clicking [CHILDREN] rendered links, there's a background flash in dark mode
   - Check `src/components/DocsLayout.tsx` and dark mode initialization
   - Check if Tailwind dark mode class is being applied late
3. Update dark mode handling in `src/app/layout.tsx` or `RootLayoutClient.tsx`
   - Ensure dark mode class is applied before first paint
   - Add script to set dark mode class based on localStorage/system preference before React hydration
4. Create UNIT TEST in `tests/components/dark-mode.test.tsx`
   - Test: Dark mode preference is applied on initial render
   - Test: No class flash when navigating between pages
5. Run tests: `npm test -- dark-mode`

# Phase 3: Fix Static Build v6 Index Page 404/Redirect Loop

**Objective:** `/en/6/` should render correctly instead of causing an infinite redirect loop in static export.

**Tasks:**
1. Investigate `src/app/en/[version]/[[...slug]]/page.tsx`
   - The issue: When `getDocumentByParams('6', undefined)` returns null, it redirects to `/en/6/` causing infinite loop
   - Root cause: The v6 index document is not being found during static build
2. Update `src/lib/content/get-document.ts`
   - Debug why `/en/6/` document is not found - check slug normalization for version root
   - Ensure `getDocumentBySlug('/en/6/')` returns the index document correctly
   - Check if `filterByContext` is incorrectly filtering out v6 index
3. Update `src/app/en/[version]/[[...slug]]/page.tsx`
   - Change redirect fallback behavior: when at version root and doc not found, show 404 instead of redirect loop
   - Add guard: if `!doc && (!params.slug || params.slug.length === 0)` then `notFound()`
4. Create UNIT TEST in `tests/lib/content/version-index.test.ts`
   - Test: `getDocumentByParams('6', undefined)` returns the v6 index document
   - Test: `getDocumentByParams('5', undefined)` returns the v5 index document
   - Test: `getDocumentBySlug('/en/6/')` returns correct document
5. Run tests: `npm test -- version-index`

---

# Phase 4: Fix Static Build Redirect Issues for Existing Pages

**Objective:** Pages like `/en/5/changelogs/` and `/en/6/contributing/issues_and_bugs/` should render instead of redirecting home.

**Tasks:**
1. Investigate `src/app/en/[version]/[[...slug]]/page.tsx`
   - The current behavior redirects to version homepage when document not found
   - This is wrong for pages that SHOULD exist but aren't being matched
2. Update `src/lib/content/get-document.ts` - `getDocumentByParams()`
   - Debug slug building: params `{version: '5', slug: ['changelogs']}` should map to `/en/5/changelogs/`
   - Ensure case-insensitive matching works correctly
   - Check trailing slash normalization
3. Update `src/lib/utils/slug-utils.ts` (or create if doesn't exist)
   - Create `normalizeSlug()` function that handles case-insensitivity and trailing slashes consistently
   - Ensure slug comparison is consistent across the codebase
4. Update `src/app/en/[version]/[[...slug]]/page.tsx`
   - Improve error handling: only redirect to homepage for truly missing pages
   - Log/debug when document lookup fails to help diagnose issues
5. Create UNIT TEST in `tests/lib/content/slug-matching.test.ts`
   - Test: params `{version: '5', slug: ['changelogs']}` matches `/en/5/changelogs/`
   - Test: params `{version: '6', slug: ['contributing', 'issues_and_bugs']}` matches doc
   - Test: Case-insensitive slug matching works
6. Run tests: `npm test -- slug-matching`

---

# Phase 5: Fix User Site Optional Features Not Showing in Navigation

**Objective:** On `npm run dev:user`, Optional Features should appear in the left navigation menu with their child pages from external repos.

**Tasks:**
1. Analyze `src/lib/content/get-document.ts`
   - User site has `03_Optional_features/index.md` with `[CHILDREN includeFolders]`
   - Actual optional features content is in `optional_features/` directory (loaded separately)
   - These two need to be connected - optional features should be children of 03_Optional_features
2. Update `src/lib/content/get-document.ts` - `getAllDocumentsInternal()`
   - For user context: when loading `optional_features/` content, set `parentSlug` to point to `03_Optional_features` index
   - The optional feature module content should become children of the main Optional Features section
3. Update `scripts/clone-docs.mjs`
   - Review the current logic at line 77-81 that skips `userguide` directory
   - For user context, the logic is OPPOSITE - we WANT userguide content, not docs
   - Fix: Check context and keep `userguide/` for user context, skip it for docs context
4. Update `src/config/sources-user.cjs`
   - Verify all optional feature sources have correct patterns for user content
   - Patterns should be `docs/en/userguide/**` for user context modules
5. Create UNIT TEST in `tests/lib/content/user-optional-features.test.ts`
   - Mock user context with optional features content
   - Test: Optional features appear as children of the Optional Features section
   - Test: User optional features have correct `optionalFeature` field set
6. Run tests: `npm test -- user-optional-features`

---

# Phase 6: Integration Testing and Verification

**Objective:** Verify all fixes work correctly in both dev and build modes.

**Tasks:**
1. Create integration test script at `tests/integration/navigation.test.ts`
   - Test: All version index pages load without redirect loops
   - Test: Changelog pages render correctly with [CHILDREN] content
   - Test: Contributing sub-pages are accessible
   - Test: Custom heading anchors render correctly
2. Create mock data fixtures for testing
   - Add `tests/fixtures/mock-content/v6/08_Changelogs/index.md` with `hideChildren: true`
   - Add child changelog files to test [CHILDREN] rendering
   - Add files with custom heading IDs `{#custom-id}`
3. Update existing tests if any are broken by changes
   - Run full test suite and fix any regressions
4. Manual verification checklist (to be done by human):
   - `npm run dev` - verify /en/6/ loads, changelogs work, custom anchors work
   - `npm run build && cd out && python3 -m http.server 8000` - verify /en/6/ doesn't loop
   - `npm run dev:user` - verify Optional Features shows in navigation
5. Run tests: `npm test`
