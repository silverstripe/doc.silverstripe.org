# Silverstripe CMS Documentation - Next.js Rebuild Context

## Project Overview

Rebuild of doc.silverstripe.org using **Next.js 16+ / Node.js 24+**. Starting from Gatsby v2 (`_gatsby/` dir). Two contexts: `docs` (developer) and `user` (end-user help).

---

## Tech Stack

Next.js 16+ • Node.js 24+ • TypeScript (strict) • Tailwind + Bootstrap • Markdown • Algolia DocSearch • Jest + RTL

---

## Commands

```bash
npm run mock        # Dev with mock data (tests/fixtures/mock-content/)
npm run clone       # Clone docs (DOCS_CONTEXT defaults to 'docs')
npm run dev         # Dev with cloned content  
npm run build       # npm run clone && next build
npm test            # All tests (auto uses mock data)
```

---

## Architecture

**Static:** `output: 'export'`, all pages pre-rendered, no SSR/ISR  
**Content:** Git clones to `.cache/content/` (sources in `_gatsby/sources-*.cjs`), versions 3-6  
**URLs:** `/en/{version}/{path}/` - case-insensitive, numeric prefixes stripped, kept for sorting  
**Mock/Real:** `NEXT_USE_MOCK_DATA=true` uses `tests/fixtures/`, false uses `.cache/content/`

---

## Critical Requirements

**Testing:** All tests use mock data automatically. Tests must pass before next phase.

**Capitalization:** Mock data includes varied capitalization (lowercase, Title Case, Mixed). Routing **must** be case-insensitive - all variations work.

**File Structure:** Real content uses `index.md` (not `00_index.md`), directories like `01_Getting_Started/`

---

## Data Model

```typescript
interface DocumentNode {
  slug: string; version: string; filePath: string; fileTitle: string;
  fileAbsolutePath: string; isIndex: boolean; parentSlug: string;
  title: string; content: string; category: 'docs' | 'user';
  summary?: string; icon?: string; hideChildren?: boolean; hide?: boolean; order?: number;
}
```

**Key notes:**
- **Ordering:** `order` is extracted from numeric filename prefixes (e.g., `01_`, `02_`) and stored in the node, not frontmatter
- For directories: `01_Getting_Started/index.md` → order: 1
- For files: `02_Advanced.md` → order: 2
- Files without numeric prefixes have no order value
- Sorting respects directory structure first, then order within directory

## Testing

**Auto mock:** Tests use `NEXT_USE_MOCK_DATA=true` → `tests/fixtures/mock-content/`  
**Types:** Unit (utils), Component (React/RTL), Integration (pages)  
**Manual:** `npm run mock` (dev), `npm run dev` (real after clone)  
**Gate:** Tests pass → human validates → next phase

---

## Mock Data

`tests/fixtures/mock-content/` - v5 & v6 dirs, nested structure, varied capitalization, optional_features/linkfield with nesting.

Example structure:
```
v6/
  index.md
  01_Getting_Started/index.md
  02_developer_guides/index.md
  optional_features/linkfield/02_configuration/index.md
```

---

## Gatsby Reference

`_gatsby/` - **old site file, reference only, don't copy, will be deleted after project complete**.

**Files:** `gatsby-node.js` (slugs), `src/utils/nodes.ts` (nav), `src/utils/sortFiles.ts` (sort), `src/utils/fileToTitle.js` (title), `sources-docs.cjs` (git).

Gatsby = GraphQL+SSR. We = static. Extract logic, not code.

---

## Standards

**TS:** Strict, no `any`, explicit returns, interfaces  
**React:** Server default, `'use client'` when needed, small components  
**Names:** Components=PascalCase, utils=kebab-case, tests=`*.test.*`

---

## Success Criteria

✅ Tests pass ✅ `npm run mock` works ✅ `npm run dev` works ✅ No TS errors ✅ Clean code

and if applicable (per phase):
✅ URLs match Gatsby ✅ Case-insensitive routing

---

## UI Components

**Sidebar:** Navigation with localStorage state (key: `sidebar_state_v{version}`), expandable folders, responsive with hamburger menu on mobile  
**Dark Mode:** Toggle in header, uses localStorage (key: `theme_preference`), applies `dark` class to `document.documentElement`, CSS custom properties  
**Header:** Logo (SVG), GitHub icon, VersionSwitcher, DarkModeToggle, SearchBox  
**Mobile:** Hamburger menu toggles sidebar overlay at <1024px breakpoint, fixed width sidebar above breakpoint

---

## For AI Agents

**Your mission:** Follow plan files e.g. (PLAN*.md, z-plan*.md) phases sequentially. Each phase is self-contained.

**Approach:**
1. Implement phase from provided instructions
2. Write tests alongside code  
3. Ensure tests pass
4. Use mock data (don't test with real content)
5. Keep functions small, types strict
6. Request validation when complete

**Red flags:** Skipping tests • Using `any` • Large components • Testing with real content early • Moving ahead without validation

