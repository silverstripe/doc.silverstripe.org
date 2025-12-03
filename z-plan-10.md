# Phase 1: Add Diff Syntax Highlighting

**Objective:** Support diff code blocks with proper highlighting (+ green, - red). Add mock data to test.

**Tasks:**
1. Update `src/lib/markdown/syntax-highlight.ts`
   - Add `diff` to LANGUAGE_ALIASES mapping
2. Update `src/components/SyntaxHighlighter.tsx`
   - Import prismjs diff component: `await import('prismjs/components/prism-diff');`
3. Update `src/app/globals.css`
   - Add diff token styles: `.token.inserted` (green), `.token.deleted` (red), `.token.coord` (cyan)
4. Update `tests/fixtures/mock-content/v6/08_Changelogs/v6_0_0.md`
   - Add diff code block example with `+` and `-` lines
5. Create UNIT TEST: `tests/lib/markdown/diff-highlight.test.ts`
   - Verify diff language class applied to code blocks
   - Verify language alias resolution
6. Run tests: `npm test -- diff-highlight`
7. Run linting: `npm run lint`

---

# Phase 2: Replace Raw HTML with JSX Components

**Objective:** Convert `replace-children-markers.ts` to TSX with proper React components instead of raw HTML strings.

**Tasks:**
1. Rename `src/lib/children/replace-children-markers.ts` → `replace-children-markers.tsx`
2. Update to use React/JSX:
   - Import React, `renderToStaticMarkup` from `react-dom/server`
   - Create `ListItem`, `CardItem` functional components
   - Replace string concatenation with JSX rendering
   - Use `renderToStaticMarkup()` to produce HTML string output
3. Update any imports of this module
4. Update existing tests in `tests/children/replace-children-markers.test.ts`
   - Ensure tests still pass with JSX implementation
5. Run tests: `npm test -- replace-children`
6. Look any other examples of `.ts` files returning raw HTML and repeat the above process for them
7. Run tests: `npm test`
8. Run linting: `npm run lint`

---

# Phase 3: Remove Utility Classes from globals.css

**Objective:** Remove Bootstrap-like utility classes from globals.css. Apply styles directly on components that need them.

**Tasks:**
1. Identify components using utility classes from globals.css:
   - Search for: `d-flex`, `gap-`, `mb-`, `mt-`, `ms-`, `me-`, `py-`, `px-`, `text-center`, etc.
   - Copy all these styles to a temporary file that you can reference and will later delete.
2. Update `src/app/globals.css`:
   - Remove utility class definitions (lines ~716-909)
   - Keep: theme colors, typography, code blocks, alerts, cards
3. For each component using utilities, add styles to their CSS module:
   - Create inline styles or CSS module classes as needed
   - Focus on: ChildrenList, layout containers, any Bootstrap-like usage
5. Run tests: `npm test`
6. Delete the temporary file
7. Run linting: `npm run lint`

---

# Phase 4: Move Layout Styles and Centralize Version Config

**Objective:** Move inline styles from layout.tsx to CSS. Centralize the default version "6" to a config file.

**Tasks:**
1. Update `src/app/layout.tsx`:
   - Remove `style={{ display: 'flex', justifyContent: 'center' }}` from body
   - Remove `style={{ width: '100%', maxWidth: 1280 }}` from wrapper div
   - Add CSS classes instead
2. Update `src/app/globals.css`:
   - Add `.body-container` and `.main-wrapper` classes with the styles
3. Create `global-config.ts`:
   - Export `DEFAULT_VERSION = '6'` as a named constant
4. Update `src/app/en/page.tsx`:
   - Import `DEFAULT_VERSION` from global-config
   - Replace hardcoded `'/en/6/'` with template literal
5. Create UNIT TEST: Verify DEFAULT_VERSION export exists
6. Run tests: `npm test`
7. Run linting: `npm run lint`

---

# Phase 5: Evaluate and Remove PostCSS/Baseline Patch

**Objective:** Remove postcss.config.mjs if not needed. Remove the hacky baseline-warning patch script.

**Tasks:**
1. Check if autoprefixer is actually needed:
   - Modern browsers handle CSS fine; Tailwind not heavily used
   - If removable: delete `postcss.config.mjs`
2. Remove `scripts/patch-baseline-warning.mjs`
3. Update `package.json`:
   - Remove `"postinstall": "node scripts/patch-baseline-warning.mjs"`
   - Remove autoprefixer and postcss from devDependencies if unused
4. Run build to verify no issues: `npm run build:docs`
5. Run tests: `npm test`
6. Run linting: `npm run lint`

---

# Phase 6: Remove routing.ts and Delete Obsolete Config

**Objective:** Inline routing.ts exports directly. Delete the obsolete src/config/ directory.

**Tasks:**
1. Delete `src/lib/routing.ts` (it only re-exports from slug-utils)
2. Search for any imports from `@/lib/routing` and update to `@/lib/slug-utils`
3. Delete entire `src/config/` directory:
   - `src/config/sources-docs.cjs`
   - `src/config/sources-user.cjs`
4. Verify root-level configs are used: `sources-docs.ts`, `sources-user.ts`
5. Run tests: `npm test`
6. Run linting: `npm run lint`

---

# Phase 7: Move Tests from src/ to tests/

**Objective:** Relocate all test files from src/lib/**/__tests__/ to tests/lib/**/

**Tasks:**
1. Move test files:
   - `src/lib/versions/__tests__/*.test.ts` → `tests/lib/versions/`
   - `src/lib/utils/__tests__/*.test.ts` → `tests/lib/utils/`
   - `src/lib/seo/__tests__/*.test.ts` → `tests/lib/seo/`
   - `src/lib/markdown/__tests__/*.test.ts` → `tests/lib/markdown/`
   - `src/lib/content/__tests__/*.test.ts` → `tests/lib/content/`
2. Delete empty `__tests__` directories from src/
3. Update imports in moved test files if necessary (should work with `@/` alias)
4. Run all tests: `npm test`
5. Run linting: `npm run lint`

---

# Phase 8: Standardize className with classnames/cx

**Objective:** Replace template literal className patterns with the classnames library. Use `cx()` function.

**Tasks:**
1. Update components to use cx():
   - `src/components/HamburgerButton.tsx`
   - `src/components/Sidebar.tsx`
   - `src/components/VersionSwitcher.tsx`
   - `src/components/DocsLayout.tsx`
   - `src/components/ChildrenList.tsx`
   - `src/components/Header.tsx` (if any template literals)
2. Pattern:
   ```tsx
   import cx from 'classnames';
   const className = cx(styles.base, { [styles.active]: isActive });
   ```
3. Fix type annotation in `src/lib/versions/get-available-slugs.ts`:
   - Change `let slugsByVersion:` to `const slugsByVersion:` (not if unit tests fail after this because of this change then just revert back to `let`)
4. Run tests: `npm test`
5. Run linting: `npm run lint`

---

# Phase 9: Enforce useEffect Positioning in Components

**Objective:** Ensure no functions are defined between useEffect hooks and return statement (return statement being equivalent of `render()` function in react class component). Update AGENTS.md.

**Tasks:**
1. Update `src/components/Header.tsx`:
   - Move `handleMobileMenuToggle` function above useEffect hooks
   - Can be defined with useCallback or as const before useEffects
2. Review and fix all client components:
   - `src/components/Sidebar.tsx` - move `toggleExpanded`, `renderNode` above useEffects
   - `src/components/DarkModeToggle.tsx` - move `handleToggle` above useEffects
   - `src/components/RootLayoutClient.tsx` - move `handleMobileMenuClose` above useEffects
   - `src/components/SearchBox.tsx` - already uses useCallback, verify positioning
3. Update AGENTS.md - add standard:
   - "useEffect hooks must be positioned immediately before the return statement (return statement being equivalent of `render()` function in react class component). No function definitions between useEffect and return."
4. Run tests: `npm test`
5. Run linting: `npm run lint`

---

# Phase 10: Update README.md and AGENTS.md

**Objective:** Rewrite README.md to be current. Verify AGENTS.md reflects all new standards.

**Tasks:**
1. Rewrite `README.md`:
   - Quick start commands
   - Docs/User context switching
   - Project structure overview
   - Development workflow
   - Testing instructions
   - Remove outdated info
2. Update `AGENTS.md`:
   - Add useEffect positioning standard
   - Add cx() className standard
   - Update project structure if changed
   - Verify tech stack is current
   - Ensure all commands are accurate
3. Verify no broken references
4. Run lint: `npm run lint`
5. Run full test suite: `npm test`
6. Test build: `npm run build`
