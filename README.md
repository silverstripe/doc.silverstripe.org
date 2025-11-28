# Silverstripe CMS Documentation

Next.js rebuild of [doc.silverstripe.org](https://doc.silverstripe.org) and [userhelp.silverstripe.org](https://userhelp.silverstripe.org).

## Quick Start

```bash
npm install

# Development with real content
npm run clone:docs   # Clone developer documentation
npm run dev:docs     # Start dev server with docs

npm run clone:user   # Clone user help documentation  
npm run dev:user     # Start dev server with user help

# Development with mock data (no cloning needed)
npm run mock

# Production build
npm run build:docs   # Build developer documentation
npm run build:user   # Build user help documentation
```

## How the Docs/User System Works

This site serves **two independent documentation sets** from a single codebase:

| Context | Content | Source Repository | Cache Location |
|---------|---------|-------------------|----------------|
| `docs` | Developer documentation | silverstripe/developer-docs | `.cache/docs/` |
| `user` | End-user help | silverstripe/silverstripe-userhelp-content | `.cache/user/` |

### Environment Variable

The `DOCS_CONTEXT` environment variable controls which documentation set is loaded:

- `DOCS_CONTEXT=docs` - Load developer documentation (default)
- `DOCS_CONTEXT=user` - Load end-user help documentation

### NPM Scripts

The dev/build scripts are designed to work independently:

| Script | Context | Description |
|--------|---------|-------------|
| `npm run dev` | docs | Development server with docs |
| `npm run dev:docs` | docs | Development server with docs |
| `npm run dev:user` | user | Development server with user help |
| `npm run build` | docs | Production build with docs |
| `npm run build:docs` | docs | Production build with docs |
| `npm run build:user` | user | Production build with user help |

### Switching Between Contexts

To switch between docs and user contexts during development:

1. Stop the current dev server (Ctrl+C)
2. Run the appropriate script (`npm run dev:docs` or `npm run dev:user`)
3. The server will start with the correct content

**Important:** You must stop and restart the dev server when switching contexts. The Next.js cache (`.next/`) is automatically invalidated when the context changes, but the running process maintains its initial configuration.

### Why Scripts Use `sh -c`

The npm scripts wrap commands in `sh -c '...'` to ensure environment variables are properly inherited:

```json
// ❌ Wrong - DOCS_CONTEXT only applies to first command
"dev:user": "DOCS_CONTEXT=user npm run copy-images:user && next dev"

// ✅ Correct - DOCS_CONTEXT applies to all commands  
"dev:user": "DOCS_CONTEXT=user sh -c 'npm run copy-images:user && next dev'"
```

### Troubleshooting Context Issues

If the wrong content appears:

1. **Stop the dev server** completely
2. **Clear the Next.js cache**: `rm -rf .next`
3. **Restart with the correct script**: `npm run dev:user` or `npm run dev:docs`

**Do not** set `DOCS_CONTEXT` in `.env.local` - this can override script values and cause confusion.

## Project Structure

```
.cache/
  docs/          # Cloned developer docs (v3-v6)
  user/          # Cloned user help docs (v3-v6)
src/
  app/           # Next.js app router pages
  components/    # React components
  lib/           # Core libraries (content, markdown, nav)
tests/           # Jest tests
  fixtures/
    mock-content/  # Mock data for testing
```

## Testing

```bash
npm test              # Run all tests (uses mock data automatically)
npm run test:watch    # Watch mode
```

## Building for Production

```bash
# Build and serve locally
npm run build:docs && cd out && python3 -m http.server 8000
# Visit http://localhost:8000/en/6/

# Or for user help
npm run build:user && cd out && python3 -m http.server 8000
```

## Technology Stack

- **Framework:** Next.js 16+ with static export
- **Content:** Markdown with remark/rehype processing  
- **Styling:** Tailwind CSS + Bootstrap
- **Search:** Algolia DocSearch
- **Testing:** Jest + React Testing Library
