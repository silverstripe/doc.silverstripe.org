# Build Scripts

## copy-images.mjs

Copies image files from content directories to the `out/` folder for static export.

### Usage

```bash
# Copy images from mock content
NEXT_USE_MOCK_DATA=true node scripts/copy-images.mjs

# Or use npm script
npm run copy-images:mock

# Copy images from real content
node scripts/copy-images.mjs

# Or use npm script
npm run copy-images
```

### What It Does

1. Determines source directory:
   - Mock mode: `tests/fixtures/mock-content/`
   - Real mode: `.cache/{docs|user}/`

2. Finds all version directories (v5, v6, etc.)

3. Recursively finds all image files (.png, .jpg, .jpeg, .gif, .webp, .svg)

4. Preserves directory structure when copying to `out/`

### Example

Input:
```
tests/fixtures/mock-content/v6/_images/screenshot.svg
tests/fixtures/mock-content/v6/02_developer_guides/_images/diagram.svg
```

Output:
```
out/v6/_images/screenshot.svg
out/v6/02_developer_guides/_images/diagram.svg
```

### Integration with Build

The `npm run build` command automatically runs:
```bash
npm run clone && next build && npm run copy-images
```

This ensures images are copied after the Next.js build completes.

### Notes

- Script handles cases where source directory doesn't exist (silently skips)
- Uses built-in Node.js `fs` module (no external dependencies)
- Logs progress with emoji indicators
- Exits with code 1 on error
