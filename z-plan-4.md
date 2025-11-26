# Phase 1: Create Shared Utilities Module

**Objective:** Extract duplicate utility functions into a shared module to eliminate code duplication.

## Context
The codebase has duplicate implementations of `escapeHtml` and slug normalization logic across multiple files. This phase creates a centralized utilities module.

## Tasks

### 1.1 Create the shared utils module

Create `src/lib/utils/escape-html.ts`:
```typescript
/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
```

### 1.2 Create slug utilities

Create `src/lib/utils/slug-utils.ts`:
```typescript
/**
 * Normalize a slug to ensure consistent format
 * - Adds leading slash if missing
 * - Adds trailing slash if missing
 * - Converts to lowercase for comparison
 */
export function normalizeSlug(slug: string): string {
  let normalized = slug.startsWith('/') ? slug : `/${slug}`;
  normalized = normalized.endsWith('/') ? normalized : `${normalized}/`;
  return normalized;
}

/**
 * Normalize slug for case-insensitive comparison
 */
export function normalizeSlugForComparison(slug: string): string {
  return normalizeSlug(slug).toLowerCase();
}
```

### 1.3 Create barrel export

Create `src/lib/utils/index.ts`:
```typescript
export { escapeHtml } from './escape-html';
export { normalizeSlug, normalizeSlugForComparison } from './slug-utils';
```

### 1.4 Update files that use escapeHtml

Update `src/lib/children/replace-children-markers.ts`:
- Add import: `import { escapeHtml } from '@/lib/utils';`
- Remove the local `escapeHtml` function (lines 91-98)

Update `src/lib/markdown/syntax-highlight.ts`:
- Add import: `import { escapeHtml } from '@/lib/utils';`
- Remove the local `escapeHtml` function (lines 50-57)

### 1.5 Update files that normalize slugs

Update `src/lib/content/get-document.ts` in `getDocumentBySlug`:
- Add import: `import { normalizeSlug } from '@/lib/utils';`
- Replace lines 165-166 with: `const normalizedSlugEnd = normalizeSlug(slug);`

Update `src/lib/navigation-logic.ts` in `doesSlugExistInVersion`:
- Add import: `import { normalizeSlug } from '@/lib/utils';`
- Replace lines 51-52 with: `const normalizedSlugEnd = normalizeSlug(slug);`

### 1.6 Create tests

Create `src/lib/utils/__tests__/escape-html.test.ts`:
- Test HTML entity encoding
- Test all special characters: &, <, >, ", '

Create `src/lib/utils/__tests__/slug-utils.test.ts`:
- Test normalizeSlug with various inputs
- Test edge cases (empty string, double slashes, etc.)

### 1.7 Verify

Run tests: `npm test`
Ensure all 589+ tests pass.

---

# Phase 2: Consolidate Version Constants

**Objective:** Eliminate hardcoded version strings and use the centralized version utilities.

## Context
Version strings ('3', '4', '5', '6') are hardcoded in multiple files instead of using the existing `@/lib/versions` module.

## Tasks

### 2.1 Add missing exports to version-utils

Update `src/lib/versions/version-utils.ts`:
- Ensure `ALL_VERSIONS` is available (it's currently const, may need export)
- Add function: `export function getVersionDirs(): string[] { return ALL_VERSIONS.map(v => \`v\${v}\`); }`

Update `src/lib/versions/index.ts` to export the new function.

### 2.2 Update slug-map.ts

File: `src/lib/slug-map.ts`
- Add import: `import { getAllVersions } from '@/lib/versions';`
- Replace line 22 `for (const version of ['3', '4', '5', '6'])` with:
  `for (const version of getAllVersions())`

### 2.3 Update routing.ts

File: `src/lib/routing.ts`
- Add import: `import { getAllVersions } from '@/lib/versions';`
- Replace line 47 `return ['3', '4', '5', '6'];` with:
  `return getAllVersions();`

### 2.4 Update get-document.ts

File: `src/lib/content/get-document.ts`
- Add import: `import { getAllVersions } from '@/lib/versions';`
- Replace lines 71-72 with:
  `const versionDirs = getAllVersions().map(v => \`v\${v}\`);`

### 2.5 Update navigation-logic.ts

File: `src/lib/navigation-logic.ts`
- Add import: `import { getDefaultVersion } from '@/lib/versions';`
- Replace line 106 `return { version: '6', optionalFeature: null };` with:
  `return { version: getDefaultVersion(), optionalFeature: null };`

### 2.6 Update api-links.ts

File: `src/lib/markdown/api-links.ts`
- Add import: `import { getDefaultVersion } from '@/lib/versions';`
- Replace line 10 `let currentVersion = '6';` with:
  `let currentVersion = getDefaultVersion();`

### 2.7 Update SearchBox.tsx

File: `src/components/SearchBox.tsx`
- Add import: `import { getDefaultVersion } from '@/lib/versions';`
- Replace line 17 `return '6';` with:
  `return getDefaultVersion();`

### 2.8 Update Header.tsx

File: `src/components/Header.tsx`
- Add import: `import { getDefaultVersion } from '@/lib/versions';`
- Replace line 27 `const version = pathParts[1] || '6';` with:
  `const version = pathParts[1] || getDefaultVersion();`

### 2.9 Verify

Run tests: `npm test`
Ensure all tests pass.

---

# Phase 3: Remove Duplicate HTML Cleanup Functions

**Objective:** Remove duplicate cleanHeaders and cleanWhitespace functions from processor.ts.

## Context
`src/lib/markdown/processor.ts` defines local versions of `cleanHeaders` and `cleanWhitespace` (lines 149-167) while the same functions exist in `src/lib/markdown/clean-html.ts`. The processor.ts uses its local versions instead of importing.

## Tasks

### 3.1 Update processor.ts

File: `src/lib/markdown/processor.ts`

- Add import: `import { cleanHeaders, cleanWhitespace } from './clean-html';`
- Remove local function `cleanHeaders` (lines 149-154)
- Remove local function `cleanWhitespace` (lines 161-167)
- Keep the `markdownToHtmlWithCleanup` function that uses them

### 3.2 Verify the functions are identical

Before removing, verify the functions in clean-html.ts match those in processor.ts:
- cleanHeaders: Same regex and replacement logic
- cleanWhitespace: Same while-loop approach with same regex

### 3.3 Verify

Run tests: `npm test`
Run: `npm run mock` to verify markdown rendering still works.

---

# Phase 4: Improve Type Safety

**Objective:** Replace `any` types with proper TypeScript types where practical.

## Context
Several files use `any` type which bypasses TypeScript's type checking. This phase improves type safety without breaking functionality.

## Tasks

### 4.1 Fix frontmatter.ts

File: `src/lib/content/frontmatter.ts`
- Change line 26 from `export function validateFrontmatter(data: any)` to:
  `export function validateFrontmatter(data: Record<string, unknown>)`
- Update internal type handling to work with `unknown` types

### 4.2 Add HAST types to syntax-highlight.ts

File: `src/lib/markdown/syntax-highlight.ts`

Add type imports:
```typescript
import type { Element as HastElement, Root as HastRoot, Text as HastText } from 'hast';
```

Define internal types:
```typescript
interface CodeBlockNode extends HastElement {
  tagName: 'pre' | 'code';
  properties?: {
    className?: string | string[];
  };
  children?: (HastElement | HastText)[];
}
```

Replace `any` types with proper types:
- Line 66: Use `HastElement` type
- Line 80: Use `CodeBlockNode` type
- Line 100: Define proper wrapper node type
- Lines 167-173: Use proper node types

Note: Some `any` may need to remain due to rehype plugin system flexibility. Add JSDoc comments explaining why.

### 4.3 Fix remark-images.ts

File: `src/lib/markdown/remark-images.ts`
- Add import: `import type { Image } from 'mdast';`
- Change line 15 from `(node: any)` to `(node: Image)`

### 4.4 Verify

Run tests: `npm test`
Run: `npm run build` to verify no type errors.

---

# Phase 5: Remove Dead Code

**Objective:** Remove unused code that adds complexity without benefit.

## Context
The syntax-highlight.ts file imports shiki and has an unused `getHighlighterInstance()` function. The actual highlighting is done by Prism on the client side.

## Tasks

### 5.1 Clean up syntax-highlight.ts

File: `src/lib/markdown/syntax-highlight.ts`

Remove unused imports and functions:
- Remove line 1: `import { createHighlighter, type Highlighter } from 'shiki';`
- Remove lines 5-6: The `highlighter` singleton variable
- Remove lines 37-45: The `getHighlighterInstance()` function

Keep the `LANGUAGE_ALIASES` map as it's used.
Keep the `highlightCodeBlocks` rehype plugin as it's used.

### 5.2 Update package.json if needed

If shiki is no longer used anywhere:
- Check for other shiki usages: `grep -r "shiki" src/`
- If none found, consider removing from dependencies (optional, low priority)

### 5.3 Verify

Run tests: `npm test`
Run: `npm run mock` to verify code highlighting still works.

---

# Phase 6: Consolidate doesSlugExistInVersion

**Objective:** Remove duplicate slug existence check function.

## Context
Two functions named `doesSlugExistInVersion` exist:
- `src/lib/slug-map.ts` (async, uses cache)
- `src/lib/navigation-logic.ts` (sync, takes documents as parameter)

## Tasks

### 6.1 Decide which to keep

The navigation-logic.ts version is more flexible (takes documents as parameter).
The slug-map.ts version is async and builds its own cache.

**Decision:** Keep navigation-logic.ts version, update slug-map.ts to use it or remove if not needed.

### 6.2 Check slug-map.ts usage

Search for imports: `grep -r "from '@/lib/slug-map'" src/`
Search for function usage: `grep -r "doesSlugExistInVersion.*slug-map" src/`

If slug-map.ts `doesSlugExistInVersion` is not used externally, remove it.

### 6.3 Update slug-map.ts

File: `src/lib/slug-map.ts`
- If the function is unused, remove `doesSlugExistInVersion` (lines 40-54)
- Keep `getSlugsByVersion` if it's used elsewhere
- Keep `clearSlugMapCache` for testing

### 6.4 Verify

Run tests: `npm test`

---

# Phase 7: Update AGENTS.md

**Objective:** Update AGENTS.md with accurate project information after refactoring.

## Tasks

### 7.1 Review current AGENTS.md

Read the current content and identify outdated sections.

### 7.2 Update sections

Update these sections:
- **Architecture:** Add `src/lib/utils/` module
- **File Structure:** Ensure it matches actual structure
- **Standards:** Confirm coding standards are followed
- **Recent Improvements:** Document the refactoring work completed in phases 1-6

### 7.3 Keep it concise

AGENTS.md should remain concise. Don't add excessive detail.
- Keep the same approximate length
- Update rather than add new sections
- Remove any references to planned work that isn't implemented

### 7.4 Verify

Ensure AGENTS.md accurately reflects the current codebase state.
Run: `npm test` to confirm nothing broke.
Run: `npm run mock` for manual verification.
