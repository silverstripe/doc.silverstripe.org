# Silverstripe CMS Documentation - Next.js Rebuild Context

## Project Overview

Rebuild of doc.silverstripe.org using **Next.js 16+ / Node.js 24+**. Two contexts: `docs` (developer) and `user` (end-user help). Static export with all pages pre-rendered at build time.

---

## Tech Stack

Next.js 16+ • Node.js 24+ • TypeScript (strict) • Tailwind + Bootstrap • Markdown (remark/rehype) • Algolia DocSearch • Jest + RTL • Prism.js

---

## Commands

```bash
npm run mock              # Dev with mock data (tests/fixtures/mock-content/)
npm run dev               # Dev with cloned content (alias: dev:docs, DOCS_CONTEXT=docs)
npm run dev:docs          # Dev with docs context (DOCS_CONTEXT=docs)
npm run dev:user          # Dev with user-help context (DOCS_CONTEXT=user)
npm run clone:docs        # Clone docs content (DOCS_CONTEXT=docs)
npm run clone:user        # Clone user-help content (DOCS_CONTEXT=user)
npm run build             # Build docs (alias: build:docs, DOCS_CONTEXT=docs)
npm run build:docs        # Build with docs context (DOCS_CONTEXT=docs)
npm run build:user        # Build with user-help context (DOCS_CONTEXT=user)
npm run copy-images:docs  # Copy image assets for docs context
npm run copy-images:user  # Copy image assets for user-help context
npm test                  # All tests (auto uses mock data)
```

**Environment variable:** `DOCS_CONTEXT` controls which documentation set loads:
- `docs` (default): Developer documentation
- `user`: End-user help documentation

---

## Architecture

**Static:** `output: 'export'`, all pages pre-rendered, no SSR/ISR  
**Content:** Git clones to `.cache/{docs|user}/`, versions 3-6  
**URLs:** `/en/{version}/{path}/` - case-insensitive, numeric prefixes stripped for URLs but kept for sorting  
**Mock/Real:** `NEXT_USE_MOCK_DATA=true` uses `tests/fixtures/mock-content/`, false uses `.cache/{docs|user}/`

---

## Project Structure

```
src/
  app/                    # Next.js app router pages
    en/[version]/[[...slug]]/page.tsx  # Main doc page
  components/             # React components (PascalCase)
  lib/
    content/              # Document loading, parsing, tree building
    markdown/             # MD→HTML processing (remark/rehype pipeline)
    nav/                  # Navigation tree building
    children/             # [CHILDREN] marker replacement
    versions/             # Version utilities and constants
    seo/                  # Metadata generation
    utils/                # Shared utilities (escapeHtml, slug-utils)
    sources-config.ts     # GitHub repo/branch mapping for 30+ modules
    routing.ts            # URL routing utilities
  types/                  # TypeScript interfaces
  contexts/               # React contexts (MobileMenuContext)
tests/                    # Test files (mirrors src/ structure)
```

---

## Data Model

```typescript
interface DocumentNode {
  slug: string; version: string; filePath: string; fileTitle: string;
  fileAbsolutePath: string; isIndex: boolean; parentSlug: string;
  title: string; content: string; category: 'docs' | 'user';
  summary?: string; icon?: string; hideChildren?: boolean; hideSelf?: boolean;
  order?: number; optionalFeature?: string;
}
```

**Ordering:** `order` is extracted from numeric filename prefixes (e.g., `01_`, `02_`) and stored in the node. Sorting respects directory structure first, then order within directory.

---

## Key Modules

**Version Management:** `src/lib/versions/version-utils.ts` - centralized version constants  
**Source Config:** `src/lib/sources-config.ts` - GitHub repo/branch mappings for all modules  
**Markdown Pipeline:** `src/lib/markdown/processor.ts` - remark→rehype with GFM, alerts, code blocks  
**Navigation:** `src/lib/nav/build-nav-tree.ts` - hierarchical nav tree from documents  
**Utilities:** `src/lib/utils/` - shared utilities (escapeHtml, slug normalization)

---

## Testing

**Auto mock:** Tests use `NEXT_USE_MOCK_DATA=true` → `tests/fixtures/mock-content/`  
**Types:** Unit (utils), Component (React/RTL), Integration (pages)  
**Coverage:** 704 tests across 55 suites  
**Gate:** Tests pass → human validates → next phase

---

## UI Components

**Sidebar:** Expandable folders, localStorage state (`sidebar_state_v{version}`)  
**Header:** Logo, GitHub icon, VersionSwitcher, DarkModeToggle, SearchBox  
**Mobile:** Hamburger menu toggles sidebar at <1024px  
**Edit on GitHub:** Dynamic URLs via `sources-config.ts`, supports optional features  
**Breadcrumbs:** Auto-generated from slug path  
**Code Blocks:** Prism.js highlighting, copy button

---

## Standards

**TS:** Strict mode, minimize `any`, explicit returns  
**React:** Server components default, `'use client'` when needed  
**Names:** Components=PascalCase, utils=kebab-case, tests=`*.test.*`  
**Imports:** Use `@/` path alias for src/ imports

---

## For AI Agents

**Your mission:** Follow plan files (z-plan-*.md) phases sequentially. Each phase is self-contained.

**Approach:**
1. Read phase instructions completely before starting
2. Write tests alongside code  
3. Ensure all tests pass before completing phase
4. Use mock data for development (don't clone real content)
5. Keep functions small, types strict
6. Request validation when complete

**Red flags:** Skipping tests • Using `any` • Large components • Testing with real content • Moving ahead without validation

**Key files to understand:**
- `src/app/en/[version]/[[...slug]]/page.tsx` - main page component
- `src/lib/content/get-document.ts` - document loading and caching
- `src/lib/markdown/processor.ts` - markdown processing pipeline
- `src/lib/sources-config.ts` - GitHub repository configuration
