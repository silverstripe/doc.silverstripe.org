# Phase 1: Fix VersionBanner CSS Chrome Compatibility and z-index

**Objective:** VersionBanner displays correctly in Chrome with proper background colors and does not overlap the scrollbar on narrow viewports.

**Tasks:**
1. Update `src/components/VersionBanner.module.css`
   - Replace background-color with background shorthand property for Chrome compatibility on `.banner` class
   - Add `isolation: isolate` or set a stacking context to prevent z-index conflicts
   - Ensure z-index is appropriately scoped so it doesn't overlap the main content scrollbar

2. Update `src/components/DocsLayout.module.css`
   - Set `overflow: hidden` on the layout root to prevent horizontal scrollbar at page level
   - Ensure `.mainContent` uses `overflow-x: auto` so horizontal scrolling is contained within content area if needed
   - Set `flex: 1` with `min-width: 0` on `.mainContent` to allow it to shrink properly while keeping sidebar fixed width

3. Create UNIT TEST `tests/components/VersionBanner.test.tsx`
   - Test that banner renders with correct style classes for each style variant (success, info, warning, danger)
   - Test that component renders with and without message

4. Run tests: `npm test -- VersionBanner`

5. Run linting: `npm run lint`

---

# Phase 2: Remove Hardcoded TOC from Changelog Pages

**Objective:** Changelog pages in `/changelogs/` directory display only the auto-generated table of contents, not any hardcoded TOC in the markdown source.

**Tasks:**
1. Create `src/lib/markdown/strip-changelog-toc.ts`
   - Export function `stripChangelogToc(markdown: string, slug: string): string`
   - Detect if slug contains `/changelogs/` (not the index, so check slug ends with version number pattern)
   - If changelog page, remove markdown content that matches TOC patterns:
     - Lines starting with `- [` or `* [` that link to anchors (e.g., `- [Breaking Changes](#breaking-changes)`)
     - Remove the section up until first H2 (`## `) if it only contains such links
   - Return cleaned markdown

2. Update `src/app/en/[version]/[[...slug]]/page.tsx`
   - Import `stripChangelogToc`
   - Before extracting headings and processing markdown, call `stripChangelogToc(doc.content, doc.slug)` for changelog pages

3. Create mock changelog with hardcoded TOC: `tests/fixtures/mock-content/v6/08_Changelogs/6_1_0.md`
   - Add YAML frontmatter with title
   - Add H1 heading
   - Add hardcoded TOC using `- [Section](#section)` format
   - Add H2/H3 sections for the changelog content
   - This will be used to verify the hardcoded TOC is stripped

4. Create UNIT TEST `tests/lib/markdown/strip-changelog-toc.test.ts`
   - Test that function returns unchanged markdown for non-changelog slugs
   - Test that function strips TOC links from changelog slugs
   - Test that regular content is preserved
   - Test edge cases: empty content, no TOC present, mixed content

5. Run tests: `npm test -- strip-changelog-toc`

6. Run linting: `npm run lint`

---

# Phase 3: Fix Table of Contents Heading Text Processing

**Objective:** TOC displays heading text correctly, stripping backticks but preserving underscores.

**Tasks:**
1. Update `src/lib/toc/extract-headings.ts`
   - Modify the text cleaning logic in `extractHeadings` function
   - Currently removes backticks but may not handle underscores correctly
   - The regex `.replace(/`([^`]+)`/g, '$1')` should extract the content from backticks
   - Ensure underscores in the extracted content remain intact
   - Test with text like `` `many_many_extraFields` `` should result in `many_many_extraFields`

2. Update slugify function in same file
   - The current slugify removes special chars with `/[^\w\s-]/g`
   - This correctly keeps underscores (part of `\w`) but verify
   - Ensure slugs with underscores work correctly

3. Create/Update UNIT TEST `tests/lib/toc/extract-headings.test.ts`
   - Test heading with backticks only: `` ## `codeText` `` → text: "codeText", id: "codetext"
   - Test heading with underscores only: `## some_variable_name` → text: "some_variable_name", id: "some_variable_name"
   - Test heading with both: `` ## Defining `many_many_extraFields` `` → text: "Defining many_many_extraFields"
   - Test that the generated ID is correct for anchor links

4. Run tests: `npm test -- extract-headings`

5. Run linting: `npm run lint`

---

# Phase 4: Fix Markdown Link Resolution for Root-Relative Paths

**Objective:** Links like `/developer_guides/security/secure_coding` are properly prefixed with `/en/{version}`.

**Tasks:**
1. Update `src/lib/markdown/resolve-link-paths.ts`
   - Modify `resolveMarkdownLink` function
   - Currently only handles relative paths (starting with `./` or `../`) that end with `.md`
   - Add handling for root-relative markdown links that start with `/` but don't include `/en/{version}`
   - Check if link starts with `/` and contains a known directory segment (like `developer_guides`, `getting_started`, etc.)
   - If so, prefix with `/en/{version}`
   - Handle anchor fragments (e.g., `/path#anchor` should become `/en/6/path/#anchor`)

2. Update `src/lib/markdown/remark-links.ts`
   - Ensure the plugin passes through all link types including root-relative paths

3. Create/Update UNIT TEST `tests/lib/markdown/resolve-link-paths.test.ts`
   - Test root-relative path: `/developer_guides/security/secure_coding` → `/en/6/developer_guides/security/secure_coding/`
   - Test root-relative path with anchor: `/developer_guides/security/secure_coding#filesystem` → `/en/6/developer_guides/security/secure_coding/#filesystem`
   - Test that external URLs are unchanged
   - Test that paths already prefixed with `/en/` are unchanged
   - Test relative `.md` paths still work

4. Run tests: `npm test -- resolve-link-paths`

5. Run linting: `npm run lint`

---

# Phase 5: Relocate global-config.ts and SITE_URL

**Objective:** `global-config.ts` is in project root and `SITE_URL` is centralized there.

**Tasks:**
1. Move `src/global-config.ts` to project root `global-config.ts`
   - Keep `DEFAULT_VERSION` export

2. Add `SITE_URL` to root `global-config.ts`
   - Export `const SITE_URL = process.env.SITE_URL || 'https://doc.silverstripe.org';`

3. Update `src/lib/metadata/metadata.ts`
   - Import `SITE_URL` from `../../global-config` (adjust relative path for new location)
   - Remove local `SITE_URL` constant
   - Keep `DEFAULT_DESCRIPTION` and `DEFAULT_OG_IMAGE` in this file

4. Update `src/app/sitemap.ts`
   - Import `SITE_URL` from `../../global-config`
   - Remove local `SITE_URL` constant

5. Update `src/app/robots.ts`
   - Import `SITE_URL` from `../../global-config`
   - Remove local `SITE_URL` constant

6. Update any other files importing from `@/global-config` to use relative path from root
   - Search for imports of `global-config` and update paths
   - Since it's now at root, imports should be `from '../../global-config'` or similar based on file location

7. Update `tsconfig.json` if needed
   - May need to add root-level path alias or adjust moduleResolution

8. Create UNIT TEST `tests/global-config.test.ts`
   - Test that DEFAULT_VERSION is exported correctly
   - Test that SITE_URL is exported correctly

9. Run tests: `npm test`

10. Run linting: `npm run lint`

---

# Phase 6: Change Build Output Directory to Match Gatsby

**Objective:** Static build files go to `public/` (Gatsby's output directory) instead of `out/`.

**Tasks:**
1. Check `_gatsby/gatsby-config.js` for output directory
   - Gatsby outputs to `public/` by default (confirmed by standard Gatsby behavior)

2. Update `next.config.mjs`
   - Add `distDir: 'public'` to the config object to change output from `out/` to `public/`

3. Update `.gitignore`
   - Replace `out/` with appropriate ignore pattern for `public/` (be careful: `public/` may need special handling since Next.js uses it for static assets)
   - Actually: Gatsby uses `public/` for output, but Next.js uses `public/` for static assets
   - Use `distDir: '.next-output'` or keep `out/` and update deployment scripts
   - OR: Check if Gatsby actually outputs elsewhere (e.g., `docs/`)
   - Decision: Keep output as `out/` if that's what deployment expects, OR align with `_gatsby` structure

4. Review `_gatsby/netlify.toml` for publish directory setting
   - If there's a `publish` setting, that indicates where Gatsby outputs go
   - Update Next.js config to match

5. Run builds to verify:
   - `npm run build:docs`
   - `npm run build:user`
   - Verify files go to correct output directory

6. Update documentation in `AGENTS.md` if output directory changed

7. Inform user to manually delete old `out/` directory if output changed

---
