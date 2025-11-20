# Phase 1: Sidebar Arrow Icon Indentation & FOUT Fix

**Objective:** Fix sidebar navigation arrow alignment and eliminate FOUT (Flash of Unstyled Text) on load.

**Tasks:**
1. Update `src/components/Sidebar.module.css`:
   - Add CSS transitions with `prefers-reduced-motion` support to prevent visible rotation on mount
   - Apply left margin to nested navigation arrows so they maintain same distance from text as base level
   - Calculate indentation: base arrows have X pixels from text, nested arrows should have same X pixels from their nested text
2. Update `src/components/Sidebar.tsx`:
   - Add depth parameter to arrow rendering
   - Apply depth-based margin classes to chevron buttons for nested items
3. Create test `tests/components/Sidebar.test.tsx`:
   - Test that nested items render with correct depth classes
   - Test chevron positioning at different depth levels
   - Verify no initial rotation state on mount (expanded state should not trigger animation class initially)
4. Run tests: `npm test -- Sidebar.test.tsx`

---

# Phase 2: Sidebar Width Consistency & Responsive Behavior

**Objective:** Make sidebar fixed width across all pages and implement proper responsive breakpoint behavior.

**Tasks:**
1. Update `src/components/DocsLayout.module.css`:
   - Remove flexible grid columns, set sidebar to fixed width (use narrower width from /server_requirements/)
   - Add CSS custom property for sidebar width
   - Add media query breakpoint (e.g., 1024px) where sidebar disappears completely
   - Remove any width transitions or squishing behavior before breakpoint
2. Update `src/components/DocsLayout.tsx`:
   - Remove inline grid styles, use CSS modules exclusively
   - Ensure sidebar container uses fixed width at all viewport sizes above breakpoint
3. Create test `tests/components/DocsLayout.test.tsx`:
   - Test layout renders with correct class names
   - Test sidebar container has fixed width class
   - Verify grid structure matches expected markup
4. Add visual regression test note in test file for manual validation of responsive behavior
5. Run tests: `npm test -- DocsLayout.test.tsx`

---

# Phase 3: Header Logo & Navigation Updates

**Objective:** Remove "Home" link, enlarge GitHub icon, add SVG logo to header.

**Tasks:**
1. Extract Gatsby logo SVG:
   - View `_gatsby/src/components/SiteLogo.jsx` to get base64 SVG
   - Save SVG content to `public/logo.svg` as standalone file
2. Update `src/components/Header.tsx`:
   - Remove "Home" link nav item (lines 36-40)
   - Update GitHub icon: add `className={styles.githubIcon}` to icon element, remove text content
   - Update logo section to use `<img src="/logo.svg" alt="SilverStripe" />` or inline SVG
3. Update `src/components/Header.module.css`:
   - Add `.githubIcon` class with `font-size: 2rem` (double current size)
   - Ensure logo SVG has appropriate sizing
4. Create test `tests/components/Header.test.tsx`:
   - Test Header renders without "Home" text link
   - Test GitHub icon has correct class
   - Test logo image/SVG is present
   - Verify VersionSwitcher and SearchBox still render
5. Run tests: `npm test -- Header.test.tsx`

---

# Phase 4: Mobile Hamburger Menu

**Objective:** Add hamburger menu for mobile that toggles sidebar overlay.

**Tasks:**
1. Create `src/components/HamburgerButton.tsx`:
   - Client component with onClick handler
   - Render hamburger icon (three horizontal lines)
   - Accept `onClick` and `isOpen` props
   - Add aria-label and aria-expanded for accessibility
2. Create `src/components/HamburgerButton.module.css`:
   - Style hamburger icon (three stacked divs or SVG)
   - Add animation for open/close state
   - Hide on desktop (above breakpoint), show on mobile
3. Update `src/components/DocsLayout.tsx`:
   - Import HamburgerButton
   - Add state for mobile sidebar open/closed
   - Pass toggle handler to HamburgerButton
   - Add conditional class to sidebar for mobile overlay mode
   - Position sidebar with higher z-index when mobile menu open
4. Update `src/components/DocsLayout.module.css`:
   - Add `.sidebarMobileOverlay` class with fixed positioning and high z-index
   - Add backdrop/overlay styling when mobile menu open
   - Position sidebar off-screen by default on mobile, slide in when open
5. Update `src/components/Header.tsx`:
   - Move HamburgerButton into Header component (top right corner)
   - Add state management and pass to DocsLayout via prop/context
6. Create test `tests/components/HamburgerButton.test.tsx`:
   - Test button renders with correct aria attributes
   - Test onClick handler is called
   - Test icon changes based on isOpen prop
7. Update `tests/components/DocsLayout.test.tsx`:
   - Test mobile overlay classes applied when menu open
   - Test sidebar visibility toggling
8. Run tests: `npm test -- HamburgerButton.test.tsx DocsLayout.test.tsx`

---

# Phase 5: Dark Mode Toggle

**Objective:** Add dark mode toggle in header with localStorage persistence.

**Tasks:**
1. Create `src/components/DarkModeToggle.tsx`:
   - Client component with useState for dark/light mode
   - useEffect to read from localStorage on mount: key `theme_preference`
   - useEffect to save to localStorage on change
   - useEffect to apply `dark` class to document.documentElement
   - Render moon/sun icon button
2. Create `src/components/DarkModeToggle.module.css`:
   - Style toggle button to match header aesthetic
   - Add icon transitions
3. Update `src/components/Header.tsx`:
   - Import and render DarkModeToggle in nav section
   - Position between GitHub icon and VersionSwitcher
4. Update `src/app/globals.css`:
   - Add CSS custom properties for light/dark color schemes
   - Add `.dark` selector with dark mode color values
   - Update existing component styles to use CSS custom properties
5. Create test `tests/components/DarkModeToggle.test.tsx`:
   - Test initial render with default light mode
   - Test clicking toggle changes state
   - Test localStorage is read on mount (mock localStorage)
   - Test localStorage is written on change
   - Test document.documentElement class is applied
6. Run tests: `npm test -- DarkModeToggle.test.tsx`

---

# Phase 6: Children List Fix & Edit on GitHub Link

**Objective:** Fix [CHILDREN] not showing nested pages and add "Edit on GitHub" link to page footer.

**Tasks:**
1. Debug `src/lib/children/get-children.ts`:
   - Review getChildren and getChildrenFiltered logic
   - Ensure nested children (e.g., under /developer_guides/model/) are included
   - Check if hideChildren flag is incorrectly set
   - Verify parent-child relationships in build-tree logic
2. Create mock data for testing:
   - Add `tests/fixtures/mock-content/v6/02_developer_guides/00_model/how-tos/` directory
   - Add `01_dynamic_default_fields.md` and `02_grouping_dataobject_sets.md`
   - Ensure these files have proper frontmatter with titles
3. Update `tests/fixtures/mock-content/v6/02_developer_guides/00_model/index.md`:
   - Ensure it doesn't have `hideChildren: true` in frontmatter
4. Create test `tests/lib/children/get-children.test.ts`:
   - Test getChildren returns nested children correctly
   - Test with hideChildren flag
   - Test filtering options
5. Create `src/components/EditOnGithub.tsx`:
   - Server component
   - Accept props: `version`, `filePath`, `category`
   - Construct GitHub edit URL: `https://github.com/silverstripe/{category === 'docs' ? 'developer-docs' : 'userhelp-docs'}/edit/{version}/{filePath}`
   - Render link with text "Edit on GitHub"
6. Create `src/components/EditOnGithub.module.css`:
   - Style as small text link, positioned at bottom of content
7. Update page template `src/app/en/[version]/[[...slug]]/page.tsx`:
   - Import and render EditOnGithub component after main content
   - Pass doc.version, doc.filePath, doc.category as props
8. Create test `tests/components/EditOnGithub.test.tsx`:
   - Test correct URL generation for docs category
   - Test correct URL generation for user category
   - Test link renders with correct href and text
9. Run tests: `npm test -- get-children.test.tsx EditOnGithub.test.tsx`

---

# Phase 7: Version Banner Improvements

**Objective:** Show banner for v6, update styling to green for supported versions, hide banner above sidebar.

**Tasks:**
1. Update `src/lib/versions/version-utils.ts`:
   - Modify getVersionMessage to return message for v6
   - Set v6 message: `{ stability: 'Supported', style: 'success', icon: 'check-circle', message: '' }`
   - Ensure v5 shows: `{ stability: 'Supported', style: 'success', icon: 'check-circle', message: 'is still supported though will not receive any additional features' }`
2. Update `src/components/VersionBanner.tsx`:
   - Modify display logic: show banner for all versions except latest if they have no message
   - For v6: show banner with just "Version 6 • Supported" and green styling, no message text
   - Remove conditional that hides banner for current version
3. Update `src/components/VersionBanner.module.css`:
   - Ensure `.style-success` class uses green color scheme
   - Verify icon and layout for versions without message text
4. Update `src/components/DocsLayout.tsx`:
   - Move VersionBanner inside main content area, not above sidebar
   - Adjust layout grid so banner is in right column only
5. Update `src/components/DocsLayout.module.css`:
   - Adjust `.bannerRow` positioning to be within main content column
   - Remove spanning across both sidebar and content
6. Update test `tests/lib/versions/version-utils.test.ts`:
   - Test getVersionMessage for v6 returns correct object
   - Test v5 shows support message
   - Test v4 shows unsupported message
7. Create test `tests/components/VersionBanner.test.tsx`:
   - Test v6 banner renders with green styling and no message
   - Test v5 banner renders with message
   - Test banner doesn't render for version without stability info (if applicable)
8. Run tests: `npm test -- version-utils.test.tsx VersionBanner.test.tsx`

---

# Phase 8: Remove Version Footer Text

**Objective:** Remove "Version X • docs" text from page footer.

**Tasks:**
1. Search for version footer text:
   - Run `grep -r "Version.*docs" src/` to locate component
2. Identify and update component:
   - Remove or comment out the version footer rendering
   - If in page template, remove from `src/app/en/[version]/[[...slug]]/page.tsx`
   - If separate component, remove the component render call
3. Update relevant CSS modules:
   - Remove unused styles related to version footer
4. Create/update integration test `tests/integration/page-layout.test.tsx`:
   - Test that version text does not appear in rendered page
   - Test that EditOnGithub link appears instead
5. Run tests: `npm test -- page-layout.test.tsx`
6. Run full test suite: `npm test`

---

# Phase 9: Integration Testing & Polish

**Objective:** Comprehensive testing of all changes, fix any regressions, ensure mock and real data work.

**Tasks:**
1. Run full test suite: `npm test`
   - Fix any failing tests
   - Ensure all new tests pass
   - Verify code coverage for new components
2. Test with mock data: `npm run mock`
   - Verify all UI changes render correctly
   - Test dark mode toggle
   - Test mobile hamburger menu
   - Test sidebar width consistency across pages
   - Test children list shows nested items
   - Test Edit on GitHub links
   - Test version banner for v5 and v6
3. Create comprehensive integration test `tests/integration/ui-features.test.tsx`:
   - Test sidebar navigation with nested items
   - Test header elements (logo, GitHub icon, dark mode, version switcher)
   - Test responsive behavior (mock viewport changes)
   - Test EditOnGithub component integration
4. Manual validation checklist (document in test file):
   - [ ] Sidebar arrows properly indented at all nesting levels
   - [ ] No FOUT on sidebar expansion icons
   - [ ] Sidebar same width on all pages
   - [ ] Sidebar doesn't squish, only shows/hides at breakpoint
   - [ ] Header shows logo, no "Home" link, large GitHub icon
   - [ ] Hamburger menu works on mobile
   - [ ] Dark mode toggle works and persists
   - [ ] Children list shows nested pages under Model
   - [ ] Edit on GitHub links point to correct URLs
   - [ ] Version banner shows for v6 (green) and v5 (green with message)
   - [ ] No "Version X • docs" text at bottom
5. Run linting: `npm run lint` (if lint script exists)
6. Build test: `npm run build`
   - Ensure static export succeeds
   - Check for TypeScript errors
   - Verify no build warnings
7. Run tests: `npm test`

---

# Phase 10: Documentation & Cleanup

**Objective:** Update documentation, add code comments, clean up temporary files.

**Tasks:**
1. Update AGENTS.md:
   - Add section on UI components: "Sidebar navigation with localStorage state, responsive hamburger menu, dark mode toggle"
   - Add note: "Dark mode uses CSS custom properties and document.documentElement class toggle"
   - Keep under 175 lines
2. Create component documentation:
   - Add JSDoc comments to new components (HamburgerButton, DarkModeToggle, EditOnGithub)
   - Document props and state management
3. Update README (if exists) or create inline documentation:
   - Document dark mode localStorage key: `theme_preference`
   - Document sidebar state localStorage key: `sidebar_state_v{version}`
4. Code cleanup:
   - Remove any console.log or debug statements
   - Remove commented-out code
   - Ensure consistent formatting
5. Create tests/README.md (if doesn't exist):
   - Document test structure
   - Explain mock data usage
   - List key test files and their purpose
6. Final test run: `npm test`
7. Final build: `npm run build`
8. Git status check: `git status --porcelain`
   - Document all changed files
   - Ensure no unintended changes
9. Create summary document `IMPLEMENTATION_SUMMARY.md`:
   - List all components created/modified
   - List all tests added
   - Note any breaking changes or migration notes
   - Include before/after screenshots placeholders for human validation
