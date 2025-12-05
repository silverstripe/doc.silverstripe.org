# Silverstripe CMS Documentation

Next.js code for [doc.silverstripe.org](https://doc.silverstripe.org) and [userhelp.silverstripe.org](https://userhelp.silverstripe.org).

Built with:
- Next.js 16+
- Node.js 24+
- TypeScript
- Markdown (remark/rehype)
- Algolia DocSearch
- Jest + RTL

---

## Quick Start

```bash
npm ci                 # Install dependencies (use npm ci, not npm update)

# Development with mock data (recommended for development)
npm run mock           # Dev server with mock data (no cloning needed)

# Development with real cloned content
npm run dev:docs       # Dev server with developer docs on port 9876
npm run dev:user       # Dev server with user help on port 9876
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

---

## Environment Setup

### Environment Variables

Create `.env.local` for local development:

```bash
# Algolia DocSearch (optional, search disabled if not set)
NEXTJS_ALGOLIA_APP_ID=your_app_id
NEXTJS_ALGOLIA_SEARCH_API_KEY=your_search_key
NEXTJS_ALGOLIA_INDEX_NAME=your_index_name
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

src/
  app/                # Next.js app router pages
    en/[version]/[[...slug]]/page.tsx  # Main doc page
    en/layout.tsx     # Layout for /en/* routes
    layout.tsx        # Root layout
  components/         # React components (PascalCase)
    Sidebar.tsx, Header.tsx, CodeBlock.tsx, etc.
  lib/
    config/           # Configuration
      config.ts       # Global config constants
    content/          # Document loading, parsing, tree building
    markdown/         # MD→HTML processing (remark/rehype pipeline)
    nav/              # Navigation tree building
    children/         # [CHILDREN] marker replacement
    toc/              # Table of contents extraction & generation
    versions/         # Version utilities and constants
    metadata/         # Metadata generation (SEO)
    utils/            # Shared utilities (slug-utils, github-utils, html-utils)
  types/
    types.ts          # TypeScript interfaces
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

### Note on Directories

- **Development (`npm run dev`)**: Next.js serves static files from `public/` directory
- **Production (`npm run build`)**: Static files are in `out/` directory (output from `next build --experimental-app`)

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

The test `npm run build` locally, then serve the `out/` directory with a simple HTTP server to verify the static export.

```bash
cd out
python3 -m http.server 8000
```

---

## Dependency Management

```bash
# Add or update a package
npm install --save-dev <package-name>@latest

# Do NOT use npm update - it can cause peer dependency conflicts
# Instead, manually update package.json or use npm install with versions
```

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

---

## Linting

```bash
npm run lint          # Run ESLint on src/
# Must pass with 0 errors and 0 warnings (Airbnb style guide)
```

This is a **gate for production builds** - `npm run build` runs linting first.

---
