# Phase 1: Fix Sidebar Top Link Visibility and Nested Indentation

**Objective:** Top sidebar link displays correctly on desktop and mobile; second-level and deeper children show proper indentation.

**Tasks:**
1. Update `src/components/Sidebar.module.css`
   - Investigate `.sidebar` overflow/visibility rules affecting first item on desktop
   - Fix indentation logic for `.navItem.nested` to use depth-based margins
   - Use CSS custom properties or utility classes to scale indent by depth level
   - Ensure `.navChildren` properly indents based on parent depth

2. Update `src/components/Sidebar.tsx`
   - Pass depth level to CSS via data attribute or dynamic style for proper nesting indent
   - Ensure depth-based class names are applied correctly (e.g., `depth-0`, `depth-1`, `depth-2`, `depth-3`)

3. Add mock data for 3rd and 4th level navigation
   - Create `tests/fixtures/mock-content/v6/02_developer_guides/01_Model/03_Something/01_DeepChild/` with `index.md`
   - Create `tests/fixtures/mock-content/v6/02_developer_guides/01_Model/03_Something/01_DeepChild/01_DeeperChild.md`

4. Create UNIT TEST
   - Test Sidebar renders all depth levels with correct CSS classes
   - Verify indentation increases with each depth level
   - Ensure top-level item is visible (not clipped)

5. Run tests
   - `npm test -- --testPathPattern="Sidebar"`

---

# Phase 2: Fix Code Block Copy Button After Client-Side Navigation

**Objective:** Code block copy buttons work consistently after initial load and after client-side navigation.

**Tasks:**
1. Update `src/components/RootLayoutClient.tsx`
   - Add `pathname` dependency to the `useEffect` that calls `initializeCodeBlocks()`
   - Import `usePathname` from `next/navigation` (already imported but not used in that effect)
   - Ensure copy buttons are re-initialized after each route change

2. Update `src/lib/markdown/code-block-client.ts`
   - Add cleanup function to remove old event listeners before re-adding (prevent duplicate handlers)
   - Consider using event delegation on a parent element for efficiency
   - Return cleanup function from `initializeCodeBlocks()`

3. Create UNIT TEST
   - Test that `initializeCodeBlocks()` attaches click handlers to buttons
   - Test that calling it multiple times doesn't duplicate handlers
   - Test cleanup function removes handlers properly

4. Run tests
   - `npm test -- --testPathPattern="code-block"`

---

# Phase 3: Fix Card Icon Background and Children Card Spacing

**Objective:** Card icons have transparent background; [CHILDREN] card boxes have balanced vertical padding.

**Tasks:**
1. Update `src/components/ChildrenList.module.css`
   - Set `.cardIconHolder` background to `transparent` (currently uses `var(--theme-bg-light)`)
   - Adjust `.cardBody` padding to balance top and bottom spacing
   - Reduce top padding to match bottom padding (currently `0.75rem 1.25rem 1.25rem 1.25rem`)
   - Target value: equal padding like `1rem 1.25rem` or `0.75rem 1.25rem`

2. Update `src/app/globals.css`
   - Modify `.theme-icon-holder` background to `transparent` if used elsewhere
   - Ensure dark mode maintains consistency

3. Create UNIT TEST
   - Snapshot test for ChildrenList component CSS classes
   - Verify `.cardIconHolder` has transparent background

4. Run tests
   - `npm test -- --testPathPattern="ChildrenList"`

---

# Phase 4: Fix Breadcrumb Colors and Sidebar Border Dark Mode

**Objective:** Light mode breadcrumbs use primary blue; dark mode sidebar border uses appropriate dark gray.

**Tasks:**
1. Update `src/components/Breadcrumbs.module.css`
   - Change `.link` color from `#0066cc` to `var(--theme-color-primary)` for consistency
   - Change `.current` color from `#333` to `var(--theme-text-primary)` for better readability
   - Keep dark mode colors as-is (already correct)

2. Update `src/components/DocsLayout.module.css`
   - Change `.sidebarContainer` border-right color from `#e9ecef` to `var(--theme-border)`
   - This ensures dark mode uses the dark theme border variable automatically

3. Create UNIT TEST
   - Test Breadcrumbs renders with correct CSS classes
   - Test DocsLayout sidebar has border styling

4. Run tests
   - `npm test -- --testPathPattern="Breadcrumbs|DocsLayout"`

---

# Phase 5: Fix Header Logo Text and Site Context Subtitle

**Objective:** Logo shows "Silverstripe CMS" with "DOCS" or "USER HELP" subtitle based on context.

**Tasks:**
1. Update `src/components/Header.tsx`
   - Import `getConfig` from `@/lib/config`
   - Read `docsContext` from config
   - Change `logoTitle` from "Silverstripe" to "Silverstripe CMS"
   - Change `logoSubtitle` to conditionally show "Docs" or "User Help" based on `docsContext`

2. Create UNIT TEST
   - Test Header renders "Silverstripe CMS" as title
   - Test Header renders "Docs" for docs context
   - Test Header renders "User Help" for user context (mock env variable)

3. Run tests
   - `npm test -- --testPathPattern="Header"`

---

# Phase 6: Fix Version Banner Padding and Status Icon/Alignment

**Objective:** V6 banner has balanced padding; status badge is right-aligned with icon.

**Tasks:**
1. Update `src/components/VersionBanner.tsx`
   - Change status icons to use Font Awesome icons (`fa-check-circle` for Supported, `fa-times-circle` for End of Life)
   - Structure status badge using flex for right-alignment
   - Handle icon for security-only status if it exists (check gatsby code: `fa-shield-alt` or similar)

2. Update `src/components/VersionBanner.module.css`
   - Remove bottom margin from `.header` when no message section exists
   - Add flex layout to `.title` with `justify-content: space-between`
   - Style `.status` with flex and icon spacing
   - Adjust padding conditionally: when no `.messageSection`, reduce bottom padding

3. Update `src/lib/versions/version-utils.ts`
   - Verify icon mappings match intended icons (already has times-circle, check-circle)
   - Consider adding `shield-alt` for security-only releases if applicable

4. Create UNIT TEST
   - Test VersionBanner renders correct icon for each version status
   - Test V6 (current/supported) has appropriate padding without extra bottom space
   - Test V5 (supported with message) has correct spacing

5. Run tests
   - `npm test -- --testPathPattern="VersionBanner|version-utils"`

---

# Phase 7: Fix API Links Double Encoding

**Objective:** API links encode backslashes correctly (`%5C` not `%255C`).

**Tasks:**
1. Update `src/lib/markdown/api-links.ts`
   - Review `rewriteAPILink` function encoding logic
   - Ensure backslashes are encoded only once as `%5C`
   - Check if the issue is double-encoding (encoding already-encoded values)
   - Remove any redundant encoding steps

2. Update `src/lib/markdown/rewrite-api-links-html.ts`
   - Review regex replacement to ensure query string isn't double-encoded
   - The `api:` prefix removal may be causing issues with encoding order

3. Update tests for API link generation
   - Test `rewriteAPILink('api:SilverStripe\\ORM\\DataObject', '6')` returns URL with `%5C` (not `%255C`)
   - Test multiple backslashes encode correctly
   - Test version parameter is appended correctly

4. Create/Update UNIT TEST
   - Verify `SilverStripe\ORM\DataObject` → `SilverStripe%5CORM%5CDataObject`
   - Verify the full URL format is correct

5. Run tests
   - `npm test -- --testPathPattern="api-links|rewrite-api"`

---

# [MANUAL_TESTING] Phase 8: Integration Testing and Manual Verification

**Objective:** All fixes work together; visual regression testing passes.

**Tasks:**
1. Run full test suite
   - `npm test`
   - Ensure all 700+ tests pass

2. Manual verification checklist
   - Run `npm run mock` and verify:
     - [ ] Top sidebar link visible on desktop
     - [ ] Nested navigation properly indented at all levels
     - [ ] Code block copy works on initial load
     - [ ] Code block copy works after navigation
     - [ ] Card icons have transparent background
     - [ ] Card boxes have balanced vertical spacing
     - [ ] Breadcrumb links use primary blue in light mode
     - [ ] Breadcrumb current item readable in light mode
     - [ ] Sidebar border subtle in dark mode
     - [ ] Logo shows "Silverstripe CMS" with "Docs" subtitle
     - [ ] V6 version banner has balanced padding
     - [ ] Version status right-aligned with icon
   
3. Build verification
   - Run `npm run build && cd out && python3 -m http.server 8000`
   - Verify static build has same functionality
   - Kill server after testing

4. API link verification
   - Navigate to page with API links
   - Click DataObject link, verify URL has single-encoded backslashes
   - URL should be: `https://api.silverstripe.org/search/lookup?q=SilverStripe%5CORM%5CDataObject&version=6`

5. Update any failing snapshots if intentional changes
   - `npm test -- -u` (only if changes are correct)

6. Run final test suite
   - `npm test`
