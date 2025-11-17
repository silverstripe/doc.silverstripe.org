# [CHILDREN] Syntax Test Cases

This document outlines all variations of the `[CHILDREN]` tag syntax used in Silverstripe markdown content.

## Overview

The `[CHILDREN]` tag dynamically renders child pages in the navigation hierarchy. It supports multiple options for filtering and formatting output.

---

## 1. Basic [CHILDREN]

**Syntax:** `[CHILDREN]`

**Description:** Renders all direct children of the current page in default (non-list) format.

**Expected behavior:**
- Shows all child pages
- Sorted by filename (numeric prefixes sorted numerically)
- In hierarchical/nested format
- Does not include folder index pages

**Example location:** Page with children, no filtering needed

---

## 2. [CHILDREN asList]

**Syntax:** `[CHILDREN asList]`

**Description:** Renders all direct children as a simple list.

**Expected behavior:**
- Shows all child pages
- Rendered as a list (likely `<ul>` or similar)
- One item per child
- Does not include folder index pages

**Example location:** `v6/index.md` - lists major sections

---

## 3. [CHILDREN Folder="model"]

**Syntax:** `[CHILDREN Folder="foldername"]`

**Description:** Renders children filtered to a specific subfolder.

**Parameters:**
- `Folder` - exact folder name (case-insensitive matching expected)
- Can include underscores in folder names
- May support path separators for nested folders

**Expected behavior:**
- Shows only children from specified folder
- Ignores children from other folders
- Sorted the same as basic CHILDREN

**Example location:** Developer guides pointing to specific subsection

**Variations observed:**
- `[CHILDREN Folder="model"]` - single folder
- `[CHILDREN Folder="model" asList]` - with list format
- `[CHILDREN Folder="model" reverse]` - reverse order
- `[CHILDREN Folder="model" asList reverse]` - combined options

---

## 4. [CHILDREN Exclude="installation,composer"]

**Syntax:** `[CHILDREN Exclude="item1,item2,...]`

**Description:** Renders all children except those specified in the exclusion list.

**Parameters:**
- `Exclude` - comma-separated list of items to exclude
- Items are matched against page titles or file names
- Case-sensitive or insensitive (verify in implementation)

**Expected behavior:**
- Shows all children except excluded items
- Sorted the same as basic CHILDREN
- Useful for omitting deprecated or irrelevant pages

**Example location:** Getting started excluding certain installation methods

**Variations observed:**
- `[CHILDREN Exclude="item1,item2"]` - multiple exclusions
- `[CHILDREN Exclude="item1" asList]` - with list format
- `[CHILDREN Exclude="item1" reverse]` - reverse order

---

## 5. [CHILDREN Only="installation"]

**Syntax:** `[CHILDREN Only="item1,item2,...]`

**Description:** Renders only children specified in the inclusion list.

**Parameters:**
- `Only` - comma-separated list of items to include
- Only pages in this list are shown
- Case-sensitive or insensitive (verify in implementation)

**Expected behavior:**
- Shows only specified children
- In the order they appear in the parameter (or sorted)
- Other children are completely hidden

**Example location:** Highlighting only key sections

**Variations observed:**
- `[CHILDREN Only="item1,item2"]` - multiple inclusions
- `[CHILDREN Only="item1" asList]` - with list format
- `[CHILDREN Only="item1" reverse]` - reverse order

---

## 6. [CHILDREN reverse]

**Syntax:** `[CHILDREN reverse]`

**Description:** Renders all direct children in reverse sort order.

**Expected behavior:**
- Shows all child pages
- Sorted in reverse order (Z-A, 9-1)
- Default format (non-list)
- Useful for showing most recent first or Z-A ordering

**Example location:** Changelog or version listings

**Variations observed:**
- `[CHILDREN reverse]` - basic reverse
- `[CHILDREN asList reverse]` - list format + reverse
- `[CHILDREN Folder="x" reverse]` - folder filtering + reverse

---

## 7. [CHILDREN includeFolders]

**Syntax:** `[CHILDREN includeFolders]`

**Description:** Renders children including folder index pages in the output.

**Expected behavior:**
- Shows all child pages AND folder index pages (marked as `isIndex: true`)
- Default sort order
- Useful when folder structures themselves contain important information

**Example location:** `optional_features/index.md` - shows linkfield folder and its children

**Variations observed:**
- `[CHILDREN includeFolders]` - basic with folders
- `[CHILDREN asList includeFolders]` - list format
- `[CHILDREN includeFolders reverse]` - reverse order
- `[CHILDREN Folder="x" includeFolders]` - folder filtering with folders

---

## 8. Complex Combinations

The following combinations are observed in real content:

### 8.1 `[CHILDREN Folder="model" asList reverse]`

**Description:** Show children from "model" folder as a list in reverse order

**Expected behavior:**
- Filter to "model" folder
- Render as list
- Reverse sort order

---

### 8.2 `[CHILDREN Exclude="installation,composer" includeFolders]`

**Description:** Show all children except specified items, including folder indices

**Expected behavior:**
- Exclude "installation" and "composer" pages
- Include folder index pages in output
- Default sort order

---

### 8.3 `[CHILDREN Only="advanced" asList reverse]`

**Description:** Show only "advanced" page as a list in reverse order

**Expected behavior:**
- Filter to only "advanced" pages
- Render as list format
- Reverse sort (minor effect on single item)

---

## Regex Pattern Reference

From `_gatsby/src/utils/parseChildrenOf.ts`:

```typescript
// Folder parameter
/\[CHILDREN Folder="?([A-Za-z0-9_<>\/]+)"?.*?\]/

// Exclude parameter
/\[CHILDREN Exclude="?([A-Za-z0-9_,]+)"?.*?\]/

// Only parameter
/\[CHILDREN Only="?([A-Za-z0-9_,]+)"?.*?\]/

// Basic CHILDREN
/\[CHILDREN(\sasList)?.*?\]/

// Option matchers
'asList' - matches " asList"
'includeFolders' - matches " includeFolders"
'reverse' - matches " reverse"
```

---

## Mock Data Coverage

The mock content structure includes examples triggering each variation:

### v6/index.md
- `[CHILDREN asList]` - list all top-level sections

### v6/01_Getting_Started/index.md
- `[CHILDREN]` - basic children listing

### v6/02_developer_guides/01_Model/index.md
- `[CHILDREN]` - basic model subsection children

### v6/optional_features/index.md
- `[CHILDREN includeFolders]` - show folders in optional features

### v6/optional_features/linkfield/index.md
- `[CHILDREN]` - basic children in optional module

### v6/optional_features/linkfield/02_configuration/index.md
- `[CHILDREN]` - basic configuration subsection

---

## Implementation Notes for Phase 6 (Rendering)

When implementing [CHILDREN] rendering:

1. **Parse** markdown content for `[CHILDREN ...]` tags
2. **Extract** parameters using regex patterns above
3. **Filter** child documents based on parameters:
   - `Folder`: match by folder/directory
   - `Exclude`: filter out items by title
   - `Only`: keep only specified items
   - `includeFolders`: include index pages (isIndex=true)
   - `reverse`: reverse final sort order
4. **Format** output:
   - Default: hierarchical/nested
   - `asList`: flat list format
5. **Sort** before rendering (unless reversed)
6. **Replace** `[CHILDREN ...]` tag with rendered component

---

## Testing Strategy

- [ ] Unit tests for each regex pattern
- [ ] Integration tests for each parameter combination
- [ ] Test case-insensitivity (if applicable)
- [ ] Test with mock data in mock-content/
- [ ] Verify proper sorting (numeric, alphabetic)
- [ ] Verify reverse sorting
- [ ] Verify filtering accuracy
- [ ] Verify format output (list vs hierarchical)
