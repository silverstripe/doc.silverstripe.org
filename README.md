# Silverstripe CMS Documentation

Next.js rebuild of [doc.silverstripe.org](https://doc.silverstripe.org) and [userhelp.silverstripe.org](https://userhelp.silverstripe.org).

Built with **Next.js 16+ • Node.js 24+ • TypeScript • Markdown (remark/rehype) • Algolia DocSearch • Jest + RTL**.

---

## Quick Start

```bash
npm ci                 # Install dependencies (use npm ci, not npm update)

# Development with mock data (recommended for development)
npm run mock           # Dev server with mock data (no cloning needed)

# Development with real cloned content
npm run dev:docs       # Dev server with developer docs
npm run dev:user       # Dev server with user help
npm run clone:docs     # Clone developer docs without starting dev server
npm run clone:user     # Clone user help docs without starting dev server

# Production build & test
npm run build          # Build & lint (default: docs context, alias for build:docs)
npm run build:docs     # Build developer docs
npm run build:user     # Build user help

# Testing
npm test               # Run all tests
npm run test:watch     # Run tests in watch mode
npm run lint           # Run ESLint (must have 0 errors, 0 warnings)
```

### Port

Dev server runs on **http://localhost:9876**

---

## Environment Setup

### Required Environment Variables

Create `.env.local` for local development:

```bash
# Algolia DocSearch (optional, search disabled if not set)
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=your_index_name
```

**Note:** Never set `DOCS_CONTEXT` in `.env.local` - the npm scripts control this to avoid conflicts.

### Optional Environment Variables

```bash
# Force mock data for testing (automatically set by test runner)
NEXT_USE_MOCK_DATA=true

# Manual context switching (for advanced usage, prefer npm scripts instead)
DOCS_CONTEXT=docs    # or DOCS_CONTEXT=user
```

---

## Context Switching: Docs vs User

This site serves **two independent documentation sets** from a single codebase:

| Context | Content | Source Repository | Cache Location |
|---------|---------|-------------------|----------------|
| `docs` | Developer documentation | silverstripe/developer-docs | `.cache/docs/` |
| `user` | End-user help | silverstripe/silverstripe-userhelp-content | `.cache/user/` |

### How It Works

The `DOCS_CONTEXT` environment variable controls which documentation set is loaded:

- `DOCS_CONTEXT=docs` - Load developer documentation (default)
- `DOCS_CONTEXT=user` - Load end-user help documentation

### Switching Between Contexts

To switch between docs and user contexts during development:

1. **Stop the current dev server** (Ctrl+C)
2. **Run the appropriate script:**
   - `npm run dev:docs` - for developer docs
   - `npm run dev:user` - for user help
3. The server will start with the correct content

**Important:** You must stop and restart the dev server when switching contexts. The Next.js cache (`.next/`) is automatically invalidated when the context changes, but the running process maintains its initial configuration.

### Troubleshooting Context Issues

If the wrong content appears:

1. **Stop the dev server completely** (Ctrl+C)
2. **Clear the Next.js cache:** `rm -rf .next`
3. **Restart with the correct script:** `npm run dev:user` or `npm run dev:docs`

### Why Scripts Use `sh -c '...'`

The npm scripts wrap commands in `sh -c '...'` to ensure environment variables are properly inherited by all commands in the chain:

```json
// ❌ Wrong - DOCS_CONTEXT only applies to the first command
"dev:user": "DOCS_CONTEXT=user npm run copy-images:user && next dev"

// ✅ Correct - DOCS_CONTEXT applies to all commands
"dev:user": "DOCS_CONTEXT=user sh -c 'npm run copy-images:user && next dev'"
```

---

## Project Structure

### Build Output

- **`.next/`** - Next.js build cache (dev server)
- **`out/`** - Static HTML export (production builds via `npm run build`), served at root URL
- **`public/`** - Static assets for dev server (populated during `npm run dev`), served at root URL
- **`assets/`** - Source files for favicon and logo (copied to `public/` and `out/`)

### Source Code

```
.cache/
  docs/               # Cloned developer docs (v3-v6)
  user/               # Cloned user help docs (v3-v6)

assets/               # Static files (favicon, logo)
  favicon.ico
  logo.svg

src/
  app/                # Next.js app router pages
    en/[version]/[[...slug]]/page.tsx  # Main doc page
    en/layout.tsx     # Layout for /en/* routes
    layout.tsx        # Root layout
    robots.ts         # SEO robots.txt
    sitemap.ts        # SEO sitemap.xml
  components/         # React components (PascalCase)
    Sidebar.tsx, Header.tsx, CodeBlock.tsx, etc.
  lib/
    config.ts         # Global config constants
    content/          # Document loading, parsing, tree building
    markdown/         # MD→HTML processing (remark/rehype pipeline)
    nav/              # Navigation tree building
    children/         # [CHILDREN] marker replacement
    toc/              # Table of contents extraction & generation
    versions/         # Version utilities and constants
    metadata/         # Metadata generation (SEO)
    utils/            # Shared utilities (escapeHtml, slug-utils, github-utils)
  types/              # TypeScript interfaces
  contexts/           # React contexts (MobileMenuContext)

scripts/
  clone-docs.mjs      # Clone docs from GitHub (handles versions, optional features)
  copy-images.mjs     # Copy images and static assets to public/ (dev) and out/ (build)

tests/                # Jest tests (mirrors src/ structure)
  fixtures/
    mock-content/     # Mock data for testing (v3-v6 sample docs)

Root-Level Configs
  next.config.mjs     # Next.js configuration (static export, distDir='out', cpus: 2)
  tsconfig.json       # TypeScript configuration (strict mode)
  jest.config.cjs     # Jest test configuration
  sources-docs.ts     # Developer docs GitHub repos config
  sources-user.ts     # User help GitHub repos config
  sources-config.ts   # Unified config wrapper
  .eslintrc.json      # ESLint rules (Airbnb style guide)
```

### Key Modules

- **Version Management:** `src/lib/versions/version-utils.ts` - centralized version constants
- **Source Configs:** `sources-docs.ts`, `sources-user.ts`, `sources-config.ts` at project root
- **Markdown Pipeline:** `src/lib/markdown/processor.ts` - remark→rehype with GFM, alerts, code blocks
- **Navigation:** `src/lib/nav/build-nav-tree.ts` - hierarchical nav tree from documents
- **Utilities:** `src/lib/utils/` - shared utilities (do not create index.ts barrel files)

---

## Development Workflow

### Using Mock Data (Recommended)

Mock data is the fastest way to develop. Tests automatically use mock data.

```bash
npm run mock          # Start dev with mock content
npm test              # Tests use mock data automatically
```

Mock content location: `tests/fixtures/mock-content/` (includes v3-v6 sample docs)

### Using Real Cloned Content

For testing with actual documentation:

```bash
npm run clone:docs    # Clone developer docs
npm run dev:docs      # Start dev server with cloned docs

# Or combine in one command:
npm run dev:docs      # clone + dev (happens automatically)
```

### Building for Production

```bash
# Build and verify locally
npm run build:docs && cd out && python3 -m http.server 8000
# Visit http://localhost:8000/en/6/
# Kill the server when done

# Or for user help
npm run build:user && cd out && python3 -m http.server 8000
```

**Note:** Linting must pass before `npm run build` succeeds. Fix any ESLint errors with `npm run lint`.

---

## Testing

```bash
npm test              # Run all tests (uses mock data automatically)
npm run test:watch    # Watch mode for development
npm run test:all      # Run all tests including special alert tests
```

### Test Structure

- Tests mirror `src/` directory structure under `tests/`
- Files named `*.test.ts` or `*.test.tsx`
- All tests use mock data (automatic via `NEXT_USE_MOCK_DATA=true`)
- Coverage: 704 tests across 55 suites

---

## Dependency Management

```bash
# Add or update a package
npm install --save-dev <package-name>@latest

# Do NOT use npm update - it can cause peer dependency conflicts
# Instead, manually update package.json or use npm install with versions
```

---

## Linting

```bash
npm run lint          # Run ESLint on src/
# Must pass with 0 errors and 0 warnings (Airbnb style guide)
```

This is a **gate for production builds** - `npm run build` runs linting first.

---

## Scripts Documentation

### copy-images.mjs

Copies image files from content directories and static assets (favicon, logo) to both `public/` (development) and `out/` (production) directories.

#### How It Determines the Source

- **Mock mode** (`NEXT_USE_MOCK_DATA=true`): `tests/fixtures/mock-content/`
- **Real mode**: `.cache/{docs|user}/` (determined by `DOCS_CONTEXT`)

#### What It Does

1. **Content Images:** Finds all version directories (v3, v4, v5, v6), recursively finds all image files (.png, .jpg, .jpeg, .gif, .webp, .svg), and preserves directory structure when copying
2. **Static Assets:** Copies `favicon.ico` and `logo.svg` from `assets/` directory
3. **Dual Destinations:** 
   - Copies to `public/` for dev server (Next.js serves static files from `public/`)
   - Copies to `out/` for production (static export build output)

#### Integration with Build

The build process automatically handles images and assets:

```bash
npm run build:docs
# Runs: lint → clone:docs → next build → copy-images:docs

npm run dev:docs
# Runs: copy-images:docs → next dev
```

#### Note on Directories

- **Development (`npm run dev`)**: Next.js serves static files from `public/` directory
- **Production (`npm run build`)**: Static files are in `out/` directory (output from `next build --experimental-app`)

---

## Data Model

```typescript
interface DocumentNode {
  slug: string;
  version: string;
  filePath: string;
  fileTitle: string;
  fileAbsolutePath: string;
  isIndex: boolean;
  parentSlug: string;
  title: string;
  content: string;
  category: 'docs' | 'user';
  summary?: string;
  icon?: string;
  hideChildren?: boolean;
  hideSelf?: boolean;
  order?: number;
  optionalFeature?: string;
}
```

**Ordering:** `order` is extracted from numeric filename prefixes (e.g., `01_`, `02_`) and stored in the node. Sorting respects directory structure first, then order within directory.

---

## Standards & Best Practices

### TypeScript

- Strict mode enabled
- Minimize `any` - use explicit types instead
- All functions must have explicit return types

### React & Components

- Server components by default
- Use `'use client'` only when needed (interactivity, browser APIs)
- useEffect positioning: place immediately before `return` statement (equivalent of `render()` in class components)
- No function definitions, useMemo, or other logic between useEffect and return

### Styling

- Use CSS Modules with `.module.css` files
- Use `cx()` utility (from `classnames` package) for combining class names
- Global styles in `src/app/globals.css`
- No Tailwind, Bootstrap, or SCSS

### Naming Conventions

- **Components:** PascalCase (e.g., `HeaderNav.tsx`)
- **Utils/Functions:** kebab-case (e.g., `slug-utils.ts`)
- **Tests:** `*.test.ts` or `*.test.tsx` (mirrors src/ structure)

### Imports

- Use `@/` path alias for `src/` imports
- **Do not create `index.ts` barrel files** in `lib/` subdirectories - import directly from specific module files
- Example: `import { loadDocument } from '@/lib/content/get-document'` (not from `@/lib/content/index.ts`)

### HTML Injection

- **Avoid `dangerouslySetInnerHTML`** - use it only when there's no other way
- Prefer Next.js script handling, structured JSX, or alternatives

### Linting

Run `npm run lint` - must have **0 errors and 0 warnings** (Airbnb style guide). This is a gate for `npm run build`.

---

## Troubleshooting

### Port 9876 Already in Use

```bash
# Kill the process on port 9876
lsof -i :9876
kill -9 <PID>
```

### Content Not Updating

```bash
# Clear caches and rebuild
rm -rf .cache .next out
npm run dev:docs
```

### Infinite Redirect Loops During Build

```bash
# Kill the server if testing locally
kill -9 <PID>

# Fix the routing issue, then rebuild
npm run build:docs
```

---

## Links

- **Developer Docs:** https://doc.silverstripe.org
- **User Help:** https://userhelp.silverstripe.org
- **GitHub Repository:** https://github.com/creative-commoners/doc.silverstripe.org
