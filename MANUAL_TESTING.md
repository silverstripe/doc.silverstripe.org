# Phase 9: Manual Testing Checklist

## Objective
Verify that all three Phase 8 epic features work together correctly and there are no regressions in existing functionality.

## Test Environment
All manual tests use mock data to avoid cloning real repositories.

```bash
npm run mock   # Starts dev server with mock data on port 9876
```

---

## Test Suite 1: DOCS_CONTEXT Filtering

### Scenario 1a: Docs Context (Default)
**Command:** `DOCS_CONTEXT=docs npm run mock`

**Expected Behavior:**
- [ ] Dev server starts successfully
- [ ] Sidebar shows only "docs" category content
- [ ] No user-help or end-user documentation appears in navigation
- [ ] All pages load correctly
- [ ] Breadcrumbs show correct paths under `/en/6/` structure

**Verification Steps:**
1. Start the dev server: `npm run mock`
2. Navigate to http://localhost:9876/en/6/
3. Expand sidebar folders and verify content is developer-focused (Getting Started, Developer Guides, etc.)
4. Check page source or browser console - should not see 'category: "user"' in document metadata

---

### Scenario 1b: User Context
**Command:** `DOCS_CONTEXT=user npm run mock`

**Expected Behavior:**
- [ ] Dev server starts successfully
- [ ] Sidebar shows only "user" category content
- [ ] No developer-focused documentation appears in navigation
- [ ] All pages load correctly
- [ ] Breadcrumbs show correct paths

**Verification Steps:**
1. In a separate terminal: `DOCS_CONTEXT=user npm run mock`
2. Navigate to http://localhost:9876/en/6/
3. Expand sidebar folders and verify content is end-user focused
4. Compare with docs context - should see different content

---

## Test Suite 2: Navigation & Sidebar Functionality

### Scenario 2a: Sidebar Navigation Works with Filtering
**Status:** Docs context active

**Expected Behavior:**
- [ ] Clicking sidebar links navigates to correct pages
- [ ] Active page is highlighted in sidebar
- [ ] Nested folders expand/collapse correctly
- [ ] Sidebar state persists on refresh (localStorage test)

**Verification Steps:**
1. With dev server running (docs context)
2. Click on "01_Getting_Started" in sidebar
3. Verify page loads and link is highlighted
4. Click on nested item "01_Installation"
5. Verify breadcrumb updates correctly
6. Refresh page - verify "01_Installation" remains loaded
7. Refresh again - verify sidebar state persists

---

### Scenario 2b: Mobile Hamburger Menu
**Status:** Docs context active

**Expected Behavior:**
- [ ] Hamburger button visible on screens < 1024px
- [ ] Clicking hamburger toggles sidebar visibility
- [ ] Sidebar closes when clicking a link
- [ ] Mobile experience is usable

**Verification Steps:**
1. Resize browser window to < 1024px width (or use browser dev tools mobile view)
2. Verify hamburger menu appears (≡ icon)
3. Click hamburger to toggle sidebar open/closed
4. Click a link in sidebar
5. Verify sidebar closes after navigation
6. Resize back to > 1024px
7. Verify hamburger disappears, sidebar is always visible

---

## Test Suite 3: Syntax Highlighting & Code Blocks

### Scenario 3a: Code Highlighting Persists
**Status:** Docs context active

**Expected Behavior:**
- [ ] Code blocks render with syntax highlighting
- [ ] Copy button appears on hover over code blocks
- [ ] Highlighting works for multiple languages (PHP, JavaScript, HTML, etc.)
- [ ] Code highlighting remains after navigation

**Verification Steps:**
1. Navigate to a page with code blocks (e.g., "Getting Started")
2. Verify code is displayed with colors/highlighting
3. Hover over code block - copy button should appear
4. Click copy button - code should be copied to clipboard
5. Navigate to another page with code, verify highlighting works there too
6. Navigate back - highlighting should persist
7. Test with pages containing different code languages

---

### Scenario 3b: Code Block Languages
**Status:** Docs context active

**Expected Behavior:**
- [ ] PHP code renders correctly
- [ ] JavaScript/JS renders correctly  
- [ ] HTML/Template syntax renders correctly
- [ ] YAML renders correctly
- [ ] Unsupported languages degrade gracefully

**Verification Steps:**
1. Open browser DevTools to inspect code elements
2. Check that language classes are applied: `language-php`, `language-js`, etc.
3. Verify syntax highlighting CSS is applied correctly
4. Each language should have distinct visual styling

---

## Test Suite 4: Version Switching

### Scenario 4a: Version Switcher Component
**Status:** Docs context active

**Expected Behavior:**
- [ ] Version switcher dropdown appears in header
- [ ] All available versions (3, 4, 5, 6) are listed
- [ ] Selecting a version changes URL to `/en/{version}/`
- [ ] Navigation rebuilds for the new version
- [ ] Content loads correctly for the new version

**Verification Steps:**
1. Navigate to http://localhost:9876/en/6/
2. Look for version selector in top right (near search box)
3. Click on version selector dropdown
4. Verify it shows: 3, 4, 5, 6
5. Click on version "5"
6. Verify URL changes to `/en/5/`
7. Verify sidebar content updates for v5
8. Repeat for other versions

---

### Scenario 4b: Fallback to Homepage
**Status:** Docs context active

**Expected Behavior:**
- [ ] Switching to version without a specific page goes to version homepage
- [ ] URL shows `/en/{version}/` (not a 404)
- [ ] Version homepage content loads
- [ ] Breadcrumb shows only version number

**Verification Steps:**
1. Navigate to http://localhost:9876/en/6/some_nonexistent_page
2. Verify 404 or fallback to homepage
3. Click version switcher and select v5
4. Verify it goes to `/en/5/` (homepage)
5. Sidebar loads correctly for v5
6. Verify version banner shows "Version 5"

---

## Test Suite 5: Feature Integration - All Three Working Together

### Scenario 5a: DOCS_CONTEXT + Syntax Highlighting + Navigation
**Status:** All features enabled

**Expected Behavior:**
- [ ] Docs context filtering applies
- [ ] Sidebar shows filtered content only
- [ ] Clicking links navigates correctly
- [ ] Code blocks on destination page have highlighting
- [ ] No mixed content from other categories

**Verification Steps:**
1. Start: `npm run mock` (docs context)
2. Navigate sidebar: Getting Started → Installation
3. Verify page loads with docs-category content only
4. Look for code blocks on page
5. Verify code has syntax highlighting
6. Verify copy button works
7. Navigate to another page using sidebar
8. Repeat verification steps

---

### Scenario 5b: DOCS_CONTEXT + Navigation + Version Switching
**Status:** All features enabled

**Expected Behavior:**
- [ ] All content stays in docs context when switching versions
- [ ] Version switching doesn't lose filtering
- [ ] Sidebar updates for new version while maintaining filtering
- [ ] Breadcrumbs update correctly

**Verification Steps:**
1. Start: `npm run mock`
2. Navigate to some page in v6
3. Verify docs context (no user-help content)
4. Click version switcher, select v5
5. Verify still in docs context (sidebar shows docs content only)
6. Navigate a link in v5
7. Verify code blocks have highlighting
8. Switch to v4, repeat steps
9. Throughout, verify no user-help content appears

---

## Test Suite 6: Regression Testing

### Scenario 6a: Existing Navigation Still Works
**Status:** Docs context active

**Expected Behavior:**
- [ ] All previously working sidebar navigation still works
- [ ] Folder expansion/collapse still works
- [ ] Active page highlighting still works
- [ ] Nested navigation levels still work

**Verification Steps:**
1. Expand multiple levels of sidebar folders
2. Verify all levels are navigable
3. Click on deeply nested items
4. Verify correct page loads
5. Use browser back button
6. Verify navigation history works

---

### Scenario 6b: Existing Search Functionality
**Status:** Docs context active

**Expected Behavior:**
- [ ] Search box appears in header
- [ ] Search still works after filtering
- [ ] Search results are filtered by category
- [ ] Search results link to correct pages

**Verification Steps:**
1. Look for search box in top navigation
2. Type a search term
3. Verify results appear
4. Click a result
5. Verify it links to correct filtered page
6. Verify result content matches docs category

---

### Scenario 6c: Breadcrumbs Still Work
**Status:** Docs context active

**Expected Behavior:**
- [ ] Breadcrumbs appear at top of page
- [ ] All breadcrumb levels are clickable
- [ ] Clicking breadcrumb navigates to that level
- [ ] Breadcrumb reflects current page structure

**Verification Steps:**
1. Navigate to a deeply nested page
2. Verify breadcrumbs appear and are correct
3. Click each level in breadcrumb
4. Verify navigation to that level works
5. Verify breadcrumbs update after navigation

---

### Scenario 6d: Dark Mode Still Works
**Status:** Docs context active

**Expected Behavior:**
- [ ] Dark mode toggle appears in header
- [ ] Clicking toggle switches theme
- [ ] Theme persists on refresh
- [ ] All content is readable in both themes
- [ ] Code highlighting works in both themes

**Verification Steps:**
1. Look for dark mode toggle in header (moon/sun icon)
2. Click to toggle to dark mode
3. Verify page renders in dark theme
4. Verify code blocks are visible and readable
5. Refresh page - theme should persist
6. Click toggle to light mode
7. Verify light theme applies
8. Check code blocks in light theme

---

### Scenario 6e: Edit on GitHub Links Work
**Status:** Docs context active

**Expected Behavior:**
- [ ] "Edit on GitHub" link appears on pages
- [ ] Link points to correct GitHub repository
- [ ] Link includes correct file path
- [ ] Link uses correct branch/version

**Verification Steps:**
1. Navigate to a documentation page
2. Look for "Edit on GitHub" link (usually bottom of page or sidebar)
3. Right-click and "Open link in new tab"
4. Verify it points to GitHub
5. Verify URL includes the correct file path
6. Verify branch matches the version

---

## Test Suite 7: Performance & Edge Cases

### Scenario 7a: Multiple Rapid Navigations
**Status:** Docs context active

**Expected Behavior:**
- [ ] Navigating rapidly between pages works smoothly
- [ ] No memory leaks or performance degradation
- [ ] Sidebar state updates correctly
- [ ] Code highlighting applies to each page

**Verification Steps:**
1. Rapidly click between sidebar links (5-10 clicks in succession)
2. Verify each page loads correctly
3. Verify sidebar active state updates for each
4. Monitor DevTools Performance tab - should see no major issues
5. Verify page remains responsive

---

### Scenario 7b: Long Page with Many Code Blocks
**Status:** Docs context active

**Expected Behavior:**
- [ ] Pages with many code blocks render correctly
- [ ] Highlighting applies to all code blocks
- [ ] Page doesn't lag or become unresponsive
- [ ] All copy buttons work

**Verification Steps:**
1. Find a documentation page with many code examples
2. Scroll through entire page
3. Verify all code blocks are highlighted
4. Test copy button on multiple code blocks
5. Verify page remains responsive while scrolling

---

## Test Summary

After completing all scenarios above, summarize:

- [ ] **Category Filtering Works:** DOCS_CONTEXT correctly filters content
- [ ] **Navigation Preserved:** Sidebar, breadcrumbs, and links all function correctly
- [ ] **Syntax Highlighting Works:** Code blocks display with highlighting across all features
- [ ] **Version Switching Works:** Versions switch correctly while maintaining all features
- [ ] **No Regressions:** All existing functionality continues to work
- [ ] **Performance OK:** No noticeable performance issues or memory problems

### Issues Found
_Document any issues discovered during testing:_

1. 
2. 
3. 

### Sign-Off
- Tester: ________________
- Date: ________________
- Status: ☐ PASS ☐ FAIL

---

## Notes for Developers

All 704 unit/integration tests must pass before manual testing:
```bash
npm test
# Test Suites: 55 passed, 55 total
# Tests: 704 passed, 704 total
```

Mock data is used for testing. Real content would be cloned via `npm run clone:docs`.

The three epic features integrated in Phase 9:
1. **Phase 7:** DOCS_CONTEXT environment variable for content filtering (docs vs user)
2. **Phase 8:** Syntax highlighting with Prism.js in code blocks
3. **Phase 9:** Integration testing ensuring all features work together
