# Phase 1: Navigation & Links Logic

**Objective:** Fix logic for external links, optional modules, and version switching.

**Tasks:**
1. Update `src/components/EditOnGithub.tsx`:
   - Logic to detect if current page is part of an optional module (check `src/lib/sources-config.ts` or `doc.optionalFeature`).
   - Generate correct URL for optional modules (different repo/branch).
2. Update `src/components/Header.tsx`:
   - Logic to change GitHub icon link based on current section (optional modules).
   - If in optional module section, link to that module's repo.
3. Update `src/components/VersionSwitcher.tsx`:
   - Add logic to check if the current path exists in the target version.
   - If not, fallback to the root of the target version (e.g., `/en/3/`).
   - (Optional) Use a client-side check or pre-calculated map if possible, otherwise safe fallback.
4. Create test `tests/components/NavigationLogic.test.tsx`:
   - Test EditOnGithub URLs for core and optional modules.
   - Test Header GitHub link changes.
   - Test VersionSwitcher fallback logic.
5. Run tests: `npm test -- NavigationLogic.test.tsx`

---

# Phase 2: Sidebar & Mobile Menu Polish

**Objective:** Improve sidebar indentation and mobile menu behavior.

**Tasks:**
1. Update `src/components/Sidebar.module.css`:
   - Adjust indentation for 3rd level items (and deeper) - each nesting level should have a consistent increase in padding/margin.
   - Ensure visual hierarchy is clear.
2. Update `src/components/Sidebar.tsx`:
   - Verify `depth` prop is passed correctly to recursive calls.
3. Update `src/components/DocsLayout.tsx` or `HamburgerButton.tsx`:
   - Add `window.scrollTo(0, 0)` when mobile menu is opened.
4. Create test `tests/components/SidebarIndentation.test.tsx`:
   - Verify CSS classes for depth levels (snapshot or class check).
5. Run tests: `npm test -- SidebarIndentation.test.tsx`

---

# Phase 3: Children Cards Styling

**Objective:** Fix styling issues in Children cards (padding, backgrounds).

**Tasks:**
1. Update `src/components/ChildrenList.module.css`:
   - Reduce top padding in cards.
   - Remove green background from icons (make transparent).
   - Remove green background on hover (make transparent or subtle grey).
   - Ensure text contrast is accessible.
2. Create test `tests/components/ChildrenListStyling.test.tsx`:
   - Visual regression note or check for class application.
3. Run tests: `npm test -- ChildrenListStyling.test.tsx`

---

# Phase 5: Heading Anchors

**Objective:** Add self-links to headings for easy sharing.

**Tasks:**
1. Install dependencies (if needed): `npm install rehype-slug rehype-autolink-headings`
2. Update `src/lib/markdown/processor.ts`:
   - Add `rehype-slug` to pipeline (adds IDs to headings).
   - Add `rehype-autolink-headings` to pipeline (adds anchor links).
   - Configure behavior: wrap heading or add icon after/before.
3. Update CSS:
   - Style the anchor link (e.g., opacity 0 until hover, specific icon '¶' or '#').
4. Create test `tests/lib/markdown/anchors.test.ts`:
   - Verify HTML output contains IDs and anchor links.
5. Run tests: `npm test -- anchors.test.ts`

---

# Phase 6: Code Blocks Enhancements

**Objective:** Improve code block experience with highlighting and copy button.

**Tasks:**
1. Update `src/lib/markdown/syntax-highlight.ts`:
   - Implement `highlightCodeBlocks` using `shiki`.
   - Ensure it transforms code blocks into highlighted HTML.
2. Create `src/components/CodeBlock.tsx` (Client Component):
   - Wrapper for code blocks to add "Copy" button.
   - Handle click to copy to clipboard.
   - Show "Copied!" feedback.
3. Update `src/lib/markdown/processor.ts`:
   - Use a custom rehype handler to replace `<pre><code>` with the `CodeBlock` component (or hydrate it).
   - Alternatively, render the copy button alongside the pre block using a wrapper in the markdown processor.
4. Create test `tests/components/CodeBlock.test.tsx`:
   - Test copy functionality (mock clipboard).
   - Test rendering of highlighted code.
5. Update `src/app/globals.css` or relevant CSS module:
   - Change background color of inline `code` tags (backticks) from green to blue/grey.
   - Ensure it matches the design system.
6. Run tests: `npm test -- CodeBlock.test.tsx`

---

# Phase 7: Breadcrumbs

**Objective:** Add breadcrumb navigation to the top of pages.

**Tasks:**
1. Create `src/components/Breadcrumbs.tsx`:
   - Calculate path segments based on current slug.
   - Retrieve titles for each segment (might need a lookup or pass full nav tree).
   - Render list of links: Home > Version > Section > Page.
2. Update `src/components/DocsLayout.tsx` or page template:
   - Insert `Breadcrumbs` at the top of the main content area.
3. Create `src/components/Breadcrumbs.module.css`:
   - Style breadcrumbs (small text, separators).
4. Create test `tests/components/Breadcrumbs.test.tsx`:
   - Test path generation.
   - Test rendering of links.
5. Run tests: `npm test -- Breadcrumbs.test.tsx`

---

# Phase 8: GitHub Callouts (Alerts)

**Objective:** Support GitHub-flavored markdown alerts (Note, Warning, etc.).

**Tasks:**
1. Install `remark-github-blockquote-alert` or implement custom transformer.
2. Update `src/lib/markdown/processor.ts`:
   - Add plugin to pipeline.
3. Update CSS:
   - Style the alerts (colors, icons) to match GitHub's look or Silverstripe brand.
   - Ensure `!CAUTION` and `!WARNING` have distinct styles (red vs orange/yellow).
4. Create test `tests/lib/markdown/alerts.test.ts`:
   - Verify transformation of `[!NOTE]` syntax.
   - Verify correct classes/styles applied.
5. Run tests: `npm test -- alerts.test.ts`

---

# Phase 9: Update config

**Objective:** Ensure configuration files are up to date.

**Tasks:**
1. Analyse how the configuration files are currently set up.
2. Identify any outdated or incorrect settings i.e. still uses files in `_gatsby`
3. Ensure config files are located in appropriate directories (do not delete any `_gatsby` files), simply copying may be appropriate.
4. Ensure no code is still referencing old config paths.
5. Ensure configuration works as expected after changes - may need to run a full local build.
6. Run tests: `npm test` to ensure no regressions.

---

# Phase 10: Scan for gatsby references

**Objective:** Ensure no code references Gatsby.

**Tasks:**
1. Search codebase for any references to `gatsby` (imports, config, comments).
2. Remove or update any found references to use Next.js equivalents.
3. Test the application to ensure no functionality is broken due to these changes.
4. Run tests: `npm test` to ensure no regressions.

===== NOPE =====

# Phase 9x: Search Integration

**Objective:** Restore Search functionality.

**Tasks:**
1. Investigate `src/components/SearchBox.tsx`.
2. Ensure Algolia environment variables are correctly used (`NEXT_PUBLIC_ALGOLIA_APP_ID`, etc.).
3. If env vars are missing in dev, ensure it fails gracefully or shows a placeholder.
4. Verify styling of the search box and results dropdown.
5. Create test `tests/components/SearchBox.test.tsx`:
   - Test rendering.
   - Test behavior when env vars are missing.
6. Run tests: `npm test -- SearchBox.test.tsx`

---

# Phase 10: Final Polish & Verification

**Objective:** Comprehensive testing and cleanup.

**Tasks:**
1. Run full test suite: `npm test`.
2. Run `npm run mock` and manually verify all changes:
   - Navigation links.
   - Sidebar indentation.
   - Children cards.
   - Code highlighting and copy.
   - Breadcrumbs.
   - Alerts.
   - Search.
3. Fix any regressions.
4. Update documentation (AGENTS.md, IMPLEMENTATION_SUMMARY.md).
5. Clean up temporary files.
