# Image Handling in Next.js Documentation

## Overview

This project includes a complete image handling system for markdown documentation that:
- Resolves relative image paths correctly
- Supports absolute paths and HTTP URLs
- Works with static export for production builds
- Integrates seamlessly with the remark/rehype markdown pipeline

## Configuration

### Next.js Config (`next.config.mjs`)
Images are configured for static export:
```javascript
images: {
  unoptimized: true  // Required for 'output: export'
}
```

This allows images to be served as static files without Next.js Image optimization, which is necessary for static-only sites.

## Image Path Resolution

### How It Works

The image path resolution system (`src/lib/markdown/resolve-image-paths.ts`) handles:

1. **Relative Paths** (e.g., `../images/screenshot.png`)
   - Resolved relative to the markdown file's directory
   - Converted to absolute paths from content root

2. **Absolute Paths** (e.g., `/images/screenshot.png`)
   - Passed through unchanged

3. **HTTP URLs** (e.g., `https://example.com/image.png`)
   - Passed through unchanged

### Usage in Markdown

When writing markdown files, use relative paths:

```markdown
# My Document

![Alt text](../_images/screenshot.png)

Content here...

![Another image](./_images/diagram.svg)
```

### Directory Structure

Images should be organized in `_images/` directories alongside content:

```
v6/
  index.md
  01_Getting_Started/
    index.md
    _images/
      screenshot.png
      diagram.svg
  02_Developer_Guides/
    _images/
      model-diagram.png
```

## Implementation Details

### Remark Plugin (`src/lib/markdown/remark-images.ts`)

The `remarkImages` plugin processes the markdown AST before HTML rendering:

```typescript
.use(remarkImages, { currentFilePath: filePath })
```

It:
- Visits all image nodes in the markdown tree
- Resolves relative image paths based on the file's location
- Supports optional file path parameter

### Processor Integration

Update calls to `markdownToHtml` to include file path:

```typescript
// With file path - images resolved relative to file
const html = await markdownToHtml(content, '/path/to/file.md');

// Without file path - relative paths preserved
const html = await markdownToHtml(content);
```

## Testing

### Image Path Resolution Tests
Location: `src/lib/markdown/__tests__/resolve-image-paths.test.ts`

Tests cover:
- Absolute path preservation
- HTTP URL preservation
- Relative path resolution
- Nested path resolution
- Windows path compatibility
- Edge cases

Run with:
```bash
npm test -- resolve-image-paths.test.ts
```

### Integration Tests
Location: `tests/image-handling-integration.test.ts`

Tests verify:
- Mock content contains image references
- Image files exist in correct directories
- Documents with images are parsed correctly
- Nested image directories work properly

Run with:
```bash
npm test
```

## Mock Content

Test images are included in the mock content:

- `tests/fixtures/mock-content/v6/_images/screenshot.svg`
- `tests/fixtures/mock-content/v6/_images/diagram.svg`
- `tests/fixtures/mock-content/v6/02_developer_guides/_images/datatype-model.svg`

Example references in markdown:
- Getting Started: Overview and architecture diagram
- Data Types: Data model diagram

## Production Build

For production static exports:

1. All images must be in the `.cache/content/` directory (real content)
2. Use relative paths in markdown files
3. Build with: `npm run build` (images are automatically copied to `out/`)
4. Images will be served as static files from their resolved paths

### Build Process

The `npm run build` command now:
1. Clones content: `npm run clone`
2. Builds the site: `next build`
3. Copies images to output: `npm run copy-images`

The `copy-images` script:
- Finds all image files in content directories (v5, v6, etc.)
- Preserves directory structure
- Copies to `out/` for static export
- Supports both mock and real content

### Image Serving in Production

For static-exported sites:
- Next.js generates HTML and JavaScript files in `out/`
- Images are copied to `out/v6/_images/`, `out/v5/_images/`, etc.
- Deploy entire `out/` directory to static hosting
- CDN or web server serves images alongside HTML

Example production deployment:
```
out/
├── index.html
├── en/
│   └── 6/
│       ├── getting-started/index.html
│       └── ...
├── v6/
│   └── _images/
│       ├── screenshot.svg
│       └── diagram.svg
└── _next/
    └── static/
        └── ...
```

## Development

### `npm run mock`

During development with mock data:
- Automatically runs `copy-images:mock` before starting dev server
- Images are copied to `public/` folder for dev server access
- Development server serves images from `public/v6/_images/`, etc.
- Images now display correctly in browser ✅

Simply run:
```bash
npm run mock
```

Then visit http://localhost:3000/en/6/getting-started/ and images should load!

### `npm run dev`

When using real cloned content:
- First clone content: `npm run clone`
- Copy images: `npm run copy-images`
- Then start dev server: `npm run dev`
- Images served from `public/` folder during development

### npm Scripts

Useful commands:
```bash
# Development with mock data (images auto-copied)
npm run mock

# Development with real content
npm run clone && npm run copy-images && npm run dev

# Copy mock images to public/ and out/
npm run copy-images:mock

# Copy real content images to public/ and out/
npm run copy-images

# Full production build with image copying
npm run build

# Run all tests (includes image tests)
npm test
```

## Troubleshooting

### Images Not Displaying

1. **Check file path format**
   - Use forward slashes: `../images/file.png` ✓
   - Avoid backslashes on any platform

2. **Verify relative paths**
   - Use `../` to go up one directory
   - Check image file exists in expected location

3. **Check Alt Text**
   - Always include alt text: `![Alt description](path.png)`
   - Alt text is required for accessibility

4. **Verify image serving in production**
   - Ensure images are served from the correct location
   - Check Content-Type headers are correct
   - Verify CORS settings if serving from CDN

### Path Resolution Issues

If images paths aren't resolving correctly:

1. Check the file path is passed to markdown processor
2. Verify directory structure matches expected layout
3. Run tests: `npm test -- image-handling`
4. Check browser console for 404 errors

## Implementation Notes

**Static Export Constraint:**
With `output: 'export'`, Next.js cannot use dynamic route handlers. This means:
- API routes cannot be used to serve dynamic content
- All routes must be pre-built or static at build time
- Images must be served by external infrastructure (static hosting, CDN, etc.)

**Path Resolution Result:**
The path resolver converts markdown image references to absolute paths from the content root. For development with mock content, these paths would be:
- Input: `![Alt](../images/file.png)` in `/v6/01_Getting_Started/index.md`
- Output: `/v6/_images/file.png`

This is correct - it means "serve from `/v6/_images/` which corresponds to the version root".

## Future Enhancements

Potential improvements:
- Automatic image optimization for production
- Image lazy loading configuration  
- Image validation during build time
- Responsive image sizing
- Integration with image CDNs

