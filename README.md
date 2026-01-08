# Silverstripe CMS Documentation

Next.js code for [docs.silverstripe.org](https://docs.silverstripe.org) and [userhelp.silverstripe.org](https://userhelp.silverstripe.org).

Built with:
- Next.js 16+
- Node.js 24+
- TypeScript
- Markdown (remark/rehype)
- Algolia DocSearch
- Jest + RTL

---

## What to update when creating a new pre-release major branch, making a stable major release, or making a major EOL

When **creating a new major branch for a pre-release major version**

- Make sure you've added a new major branch to both `silverstripe/developer-docs` and `silverstripe/silverstripe-userhelp-content`
- Add the new major to `sources-docs.json` and `sources-user.json`
- Add the new major branches for various modules as defined in `sources-docs.json` and `sources-user.json` as well
- Add the new major to `ALL_VERSIONS` in `src/lib/versions/version-utils.ts`
- Add the new major version to the [algolia crawler script](https://crawler.algolia.com/admin/crawlers/3d14ccdd-f9ae-4957-bc0a-5b21b4c29af3/configuration/edit)

For **new stable releases**, you will need to do the following

- Remove the old major from `PREVIOUS_RELEASE_VERSIONS` in `src/lib/versions/version-utils.ts` (if applicable)
- Update `PREVIOUS_RELEASE_VERSIONS` to include the previously current major in `src/lib/versions/version-utils.ts`
- Update `CURRENT_VERSION` constant to the new stable major in `src/lib/versions/version-utils.ts`
- Update `DEFAULT_VERSION` constant to the new stable major in `global-config.ts`
- Update redirects in `netlify.toml` to point to the new stable major

When a **major goes EOL**, add the major to the `EOL_VERSIONS` array in `src/lib/versions/version-utils.ts`

## Quick Start

### Using Mock Data 

You can develop without clone data using mock data, which is the same mock data used in tests:

```bash
npm run mock          # Start dev with mock content
```

### Using Real Cloned Content

For testing with actual documentation:

```bash
npm run clone:docs    # Clone developer docs (or user help with clone:user)
npm run dev:docs      # Start dev server with cloned developer docs (or user help docs with dev:user)
```

### Building Static Files (Deployment)

Note that static files are not committed to the repository - they are built during deployment.

```bash
# Build and verify locally
npm run build:docs

# Or for user help
npm run build:user
```

To test the output of `npm run build` locally:

```bash
# Serve the built static site in the out/ directory on port 9877
npm run start
```

### Full Command Reference

```bash
npm install            # Install dependencies (use npm install, not npm update)

# Development with mock data (intended for development without clone, uses same mock data as tests)
npm run mock           # Dev server with mock data (no cloning needed)

# Clone content
npm run clone          # Clone content based on DOCS_CONTEXT (default: docs, alias for clone:docs)
npm run clone:docs     # Clone developer docs in preparation for starting dev or build scripts
npm run clone:user     # Clone user help docs in preparation for starting dev or build scripts

# Development servers (after cloning)
npm run dev            # Dev server with developer docs on port 9876  (default: docs context, alias for dev:docs)
npm run dev:docs       # Dev server with developer docs on port 9876
npm run dev:user       # Dev server with user help on port 9876

# Build static files for deployment
npm run build          # Clone content, build static files and copy images (default: docs context, alias for build:docs)
npm run build:docs     # Clone content, build static files and copy images for developer docs
npm run build:user     # Clone content, build static files and copy images for user help

# Testing
npm test               # Run all tests
npm run lint           # Run ESLint (must have 0 errors, 0 warnings)

# Utility commands
npm run start          # Serve built static files from out/ directory on port 9877
npm run kill           # Kill processes running on ports 9876, 9877
```

---

## Environment Setup

### Environment Variables

Create `.env.local` for local development:

```bash
# Algolia DocSearch (optional, search disabled if not set)
# Note that the NEXT_PUBLIC_ prefix is required for Next.js to expose these to the browser
# The NEXT_PUBLIC_DOCSEARCH_API_KEY must be a search-only API key
NEXT_PUBLIC_DOCSEARCH_APP_ID=your_app_id
NEXT_PUBLIC_DOCSEARCH_API_KEY=your_api_key
NEXT_PUBLIC_DOCSEARCH_INDEX_NAME=your_index_name
```

#### Additional Environment Variables

Additional environment variables, though these should not be set manually

```bash
# Force mock data for testing (automatically set by test runner in setup-tests.js)
NEXT_USE_MOCK_DATA=true

# Manual context switching - used by deployment or npm scripts to control which docs are loaded
DOCS_CONTEXT=docs    # or DOCS_CONTEXT=user
```

---

## Context Switching: Docs vs User

This site serves **two independent documentation sets**:

| Context | Content | Cache Location |
|---------|---------|----------------|
| `docs` | Developer documentation | `.cache/docs/` |
| `user` | End-user help | `.cache/user/` |

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

## Project Directories

### Committed to repo
- **`assets/`** - Source files we want to be exposed (e.g. for favicon and logo). These are copied to `public/` and `out/`.
- **`src/`** - Main source code (React components, pages, lib, types, contexts)
- **`scripts/`** - Node.js scripts for cloning docs and copying images
- **`tests/`** - Jest tests (mirrors `src/` structure)

### Directories not committed to repo
- **`.cache/`** - Cloned documentation content
- **`.next/`** - Next.js build cache
- **`public/`** - Static assets for dev server (populated during `npm run dev`)
- **`out/`** - Static HTML export and static assets (populated during `npm run build`)

---
