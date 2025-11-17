## PHASE 1: Project Setup & Foundation

**Goal:** Set up Next.js project with TypeScript, testing infrastructure, and basic configuration.

### Steps

1.1. **Initialize Next.js Project**
   - Create new Next.js 16 app with TypeScript, App Router, and Tailwind CSS
   - Requires Node.js 24+ LTS
   - Install dependencies: `react`, `react-dom`, `next`
   - Configure `tsconfig.json` for strict type checking

1.1a. **Create .gitignore**
   - Create `.gitignore` file with:
     ```
     # Dependencies
     node_modules/
     
     # Next.js
     .next/
     out/
     
     # Content cache
     .cache/
     
     # Environment
     .env.local
     .env*.local
     
     # Testing
     coverage/
     
     # OS
     .DS_Store
     Thumbs.db
     ```

1.2. **Install Testing Dependencies**
   ```bash
   npm install -D jest @testing-library/react @testing-library/jest-dom
   npm install -D @types/jest @testing-library/user-event
   npm install -D ts-node @types/node
   ```
   - Configure `jest.config.js` for TypeScript and React
   - Create `setupTests.ts` for Jest DOM matchers
   - Add test scripts to `package.json`:
     - `"test": "jest"`
     - `"test:watch": "jest --watch"`

1.3. **Configure Static Export**
   - Update `next.config.js`:
     ```javascript
     module.exports = {
       output: 'export',
       trailingSlash: true,
       images: { unoptimized: true }
     }
     ```
   - This ensures dev and build use same static generation approach

1.4. **Create Environment Configuration**
   - Create `.env.local` with:
     - `DOCS_CONTEXT=docs` (defaults to `docs` if not set)
     - `NEXT_PUBLIC_DOCSEARCH_APP_ID=`
     - `NEXT_PUBLIC_DOCSEARCH_API_KEY=`
     - `NEXT_PUBLIC_DOCSEARCH_INDEX_NAME=`
   - Create `src/lib/config.ts` to read environment variables with defaults
   - Config should return `docs` context if `DOCS_CONTEXT` not set
   - Write tests for config loading

1.5. **Setup Package Scripts**
   - Add to `package.json`:
     ```json
     "scripts": {
       "dev": "next dev",
       "mock": "NEXT_USE_MOCK_DATA=true next dev",
       "build": "npm run clone && next build",
       "clone": "node scripts/clone-docs.mjs",
       "clone:docs": "DOCS_CONTEXT=docs node scripts/clone-docs.mjs",
       "clone:user": "DOCS_CONTEXT=user node scripts/clone-docs.mjs",
       "test": "jest",
       "test:watch": "jest --watch"
     }
     ```
   - Note: `clone` defaults to docs context
   - Note: `mock` command uses mock data for testing
   - Note: `dev` command uses cloned content

1.6. **Validation**
   - [ ] `npm run mock` starts successfully (even without mock data yet)
   - [ ] `npm test` runs (even if no tests yet)
   - [ ] TypeScript compiles without errors
   - [ ] Can access `http://localhost:3000`

---

## PHASE 2: Mock Data Creation

**Goal:** Create comprehensive mock data that covers all real-world scenarios without requiring git clones.

### Steps

2.1. **Analyze Gatsby Data Structures**
   - Study `_gatsby/src/types/index.ts` - `SilverstripeDocument` interface
   - Document all frontmatter fields and their purposes
   - List all [CHILDREN] syntax variations from `parseChildrenOf.ts`

2.2. **Create Mock Data Type Definitions**
   - Create `src/types/index.ts` with:
     - `DocumentNode` interface (simplified from SilverstripeDocument)
     - `DocumentMeta` interface (frontmatter fields)
     - `ContentTree` interface (hierarchical structure)
   - Write unit tests for type validation

2.3. **Create Mock Content Structure**
   - Create `tests/fixtures/mock-content/` directory
   - Structure (includes v5 and v6 for version switching tests):
     ```
     mock-content/
       v6/
         index.md
         01_Getting_Started/
           index.md
           01_Installation.md
           02_composer.md
         02_developer_guides/
           index.md
           01_Model/
             index.md
             01_data_types.md
             02_Relations.md
         optional_features/
           linkfield/
             index.md
             01_Usage.md
             02_configuration/
               index.md
               01_basic.md
               02_Advanced_Options.md
       v5/
         index.md
         01_getting_started/
           index.md
           01_installation.md
     ```
   - **Note on capitalization:** Mock data includes various capitalization patterns:
     - `01_Getting_Started` - each word capitalized
     - `01_getting_started` - all lowercase
     - `01_Installation` - first letter capitalized
     - `01_installation` - all lowercase
     - `02_Advanced_Options` - mixed case
   - **Important:** Routing must be case-insensitive - all variations should work
   - Tests must verify all capitalization permutations work correctly

2.4. **Create [CHILDREN] Test Cases Documentation**
   - Create `tests/fixtures/children-test-cases.md` documenting ALL variations:
     - `[CHILDREN]` - basic, all children
     - `[CHILDREN asList]` - list format
     - `[CHILDREN Folder="model"]` - specific folder
     - `[CHILDREN Exclude="installation,composer"]` - exclusions
     - `[CHILDREN Only="installation"]` - inclusions only
     - `[CHILDREN reverse]` - reverse order
     - `[CHILDREN includeFolders]` - include index pages
     - `[CHILDREN Folder="model" asList reverse]` - combinations
   - Each variation should have expected output documented
   - Reference Gatsby file: `_gatsby/src/utils/parseChildrenOf.ts` for regex patterns
   - This file serves as requirements documentation for Phase 6

2.5. **Create Mock Markdown Files**
   - Add realistic frontmatter to each mock file:
     ```yaml
     ---
     title: "Installation Guide"
     summary: "Learn how to install Silverstripe"
     icon: "download"
     order: 1
     ---
     ```
   - Include various content: headings, code blocks, links, images
   - Add [CHILDREN] markers in appropriate locations

2.6. **Validation**
   - [ ] All mock files have valid frontmatter YAML
   - [ ] Directory structure matches real repository patterns (index.md not 00_index.md)
   - [ ] Both v5 and v6 directories exist
   - [ ] All [CHILDREN] variations documented in test cases file
   - [ ] Files include `01_`, `02_` prefixes for sort testing
   - [ ] Multiple capitalization patterns present (lowercase, Title Case, Mixed)
   - [ ] At least 3 levels of nesting exist
   - [ ] Optional features (linkfield) has nested structure

---

## PHASE 3: Content Processing Core

**Goal:** Build the data layer that transforms markdown files into a usable content tree.

### Steps

3.1. **Create File System Utilities**
   - Create `src/lib/content/fs-utils.ts`:
     - `readMarkdownFile(path: string): Promise<RawDocument>`
     - `listMarkdownFiles(dir: string): Promise<string[]>`
     - `parseFilePath(path: string): PathInfo`
   - Write unit tests with mock filesystem (use `mock-fs` or similar)

3.2. **Create Frontmatter Parser**
   - Create `src/lib/content/frontmatter.ts`:
     - `parseFrontmatter(content: string): { data: DocumentMeta, content: string }`
     - `validateFrontmatter(data: any): DocumentMeta`
   - Use `gray-matter` library
   - Write unit tests with various frontmatter formats

3.3. **Create Filename → Title Converter**
   - Create `src/lib/content/file-to-title.ts`:
     - `fileToTitle(filename: string): string`
     - Strips numeric prefixes (`01_`, `02_`, etc.)
     - Converts underscores to spaces
     - Handles `index.md` → parent directory name
   - Port logic from `_gatsby/src/utils/fileToTitle.js`
   - Write comprehensive unit tests:
     - `"01_getting_started"` → `"getting started"`
     - `"index"` → (parent dir name)
     - `"02_Model_Data_Types"` → `"Model Data Types"`

3.4. **Create Slug Generator**
   - Create `src/lib/content/slug-generator.ts`:
     - `generateSlug(filePath: string, version: string, optional?: string): string`
     - Strips numeric prefixes from path segments
     - Converts to lowercase (case-insensitive routing)
     - Converts underscores to hyphens
     - Returns format: `/en/{version}/{path}/`
   - Port logic from `_gatsby/gatsby-node.js` `createSlug()` function
   - Write unit tests with various capitalization patterns:
     - `"01_Getting_Started/02_Installation.md"` + `v6` → `"/en/6/getting-started/installation/"`
     - `"01_getting_started/02_installation.md"` + `v6` → `"/en/6/getting-started/installation/"`
     - `"02_Advanced_Options.md"` → `"/en/6/advanced-options/"`
     - Handle optional features path correctly

3.5. **Create Content Tree Builder**
   - Create `src/lib/content/build-tree.ts`:
     - `buildContentTree(basePath: string, version: string): Promise<DocumentNode[]>`
     - Recursively reads directory
     - Parses each markdown file
     - Generates slugs
     - Builds parent-child relationships
     - Determines `isIndex` for `index.md` files
     - Checks `NEXT_USE_MOCK_DATA` env var to determine content source
     - If true, loads from `tests/fixtures/mock-content/`
     - If false, loads from `.cache/content/`
   - Write integration tests using mock content directory

3.6. **Create File Sorting Logic**
   - Create `src/lib/content/sort-files.ts`:
     - `sortDocuments(docs: DocumentNode[]): DocumentNode[]`
     - Numeric prefixes affect sort order
     - Alphabetical for non-numbered files
     - Special handling for semantic versions
   - Port logic from `_gatsby/src/utils/sortFiles.ts`
   - Write unit tests with various file naming patterns

3.7. **Validation**
   - [ ] All unit tests pass
   - [ ] Can build tree from `tests/fixtures/mock-content/v6/`
   - [ ] Slugs generated correctly (test with assertions)
   - [ ] Parent-child relationships correct
   - [ ] Sort order respects numeric prefixes
   - [ ] Frontmatter merged with defaults

---

## PHASE 4: Routing & URL Rewriting (HARD PART)

**Goal:** Implement Next.js dynamic routing and ensure URLs match Gatsby output exactly.

### Steps

4.1. **Understand Required URL Patterns**
   - Document all URL patterns from Gatsby:
     - `/en/{version}/` - home page for version
     - `/en/{version}/{category}/` - index pages
     - `/en/{version}/{category}/{page}/` - content pages
     - `/en/{version}/optional_features/{module}/{page}/` - optional modules
   - Legacy redirects: `/en/something/` → `/en/6/something/` (latest version)

4.2. **Create Dynamic Route Structure**
   - Create `src/app/en/[version]/[[...slug]]/page.tsx`
   - This catches all paths: `/en/6/`, `/en/6/getting-started/`, `/en/6/model/data-types/`
   - Handle empty slug (index page for version)

4.3. **Implement `generateStaticParams`**
   - In `src/app/en/[version]/[[...slug]]/page.tsx`:
     ```typescript
     export async function generateStaticParams() {
       const allDocs = await getAllDocuments();
       return allDocs.map(doc => {
         const parts = doc.slug.split('/').filter(Boolean);
         return {
           version: parts[1], // 'en/6/...' -> '6'
           slug: parts.slice(2), // remaining path segments
         };
       });
     }
     ```
   - This generates all possible static routes at build time

4.4. **Create Document Fetcher**
   - Create `src/lib/content/get-document.ts`:
     - `getDocumentBySlug(slug: string): Promise<DocumentNode | null>`
     - `getAllDocuments(): Promise<DocumentNode[]>`
     - Loads from built content tree
   - Write unit tests using mock data

4.5. **Implement Page Component**
   - Basic page rendering in `src/app/en/[version]/[[...slug]]/page.tsx`:
     ```typescript
     export default async function Page({ params }) {
       const slug = buildSlugFromParams(params);
       const doc = await getDocumentBySlug(slug);
       if (!doc) notFound();
       return <article>{doc.title}</article>;
     }
     ```

4.6. **Test Routing**
   - Create `tests/routing.test.ts`:
     - Test `generateStaticParams()` returns all expected routes
     - Test slug reconstruction from params
     - Test 404 for non-existent routes
   - Create `tests/url-parity.test.ts`:
     - Compare Next.js generated URLs against Gatsby URLs
     - Ensure exact match for all test cases

4.7. **Implement Homepage Redirects**
   - Create `src/app/page.tsx` - redirect to `/en/6/` (latest version)
   - Create `src/app/en/page.tsx` - redirect to `/en/6/`
   - Use Next.js `redirect()` function

4.8. **Validation**
   - [ ] `npm run mock` starts and shows pages
   - [ ] Can navigate to `/en/6/` and `/en/5/`
   - [ ] Can navigate to `/en/6/getting-started/`
   - [ ] URL format exactly matches Gatsby output
   - [ ] All routing tests pass
   - [ ] 404 page shown for invalid routes

---

## PHASE 5: Markdown Rendering

**Goal:** Convert markdown content to HTML and render it correctly.

### Steps

5.1. **Install Markdown Dependencies**
   ```bash
   npm install remark remark-html remark-gfm gray-matter
   npm install rehype-raw rehype-sanitize
   npm install @types/remark @types/remark-html
   ```

5.2. **Create Markdown Processor**
   - Create `src/lib/markdown/processor.ts`:
     - `markdownToHtml(content: string): Promise<string>`
     - Uses `remark` → `rehype` pipeline
     - Supports GitHub Flavored Markdown
     - Allows raw HTML (for [CHILDREN] replacement later)
   - Write unit tests with various markdown features

5.3. **Create Syntax Highlighter**
   - Install `shiki` or `prism-react-renderer`
   - Create `src/lib/markdown/syntax-highlight.ts`
   - Add custom language aliases (`ss` → `html`, etc.)
   - Write tests for code block rendering

5.4. **Update Page Component to Render Markdown**
   - In `src/app/en/[version]/[[...slug]]/page.tsx`:
     ```typescript
     const htmlContent = await markdownToHtml(doc.content);
     return (
       <article dangerouslySetInnerHTML={{ __html: htmlContent }} />
     );
     ```

5.5. **Create Markdown Utilities**
   - Create `src/lib/markdown/clean-html.ts`:
     - `cleanWhitespace(html: string): string`
     - `cleanHeaders(html: string): string`
   - Port logic from Gatsby `_gatsby/src/utils/clean*.ts` files
   - Write unit tests

5.6. **Test Markdown Rendering**
   - Create `tests/markdown-rendering.test.ts`:
     - Test headings, lists, code blocks render correctly
     - Test links are preserved
     - Test images are handled (even if broken for now)
   - Visual inspection: run dev server and check rendered pages

5.7. **Validation**
   - [ ] Markdown converts to HTML correctly
   - [ ] Code blocks have syntax highlighting
   - [ ] Headings, lists, tables render properly
   - [ ] All markdown tests pass
   - [ ] `npm run mock` shows rendered markdown content

---

## PHASE 6: [CHILDREN] Implementation (HARD PART)

**Goal:** Implement the [CHILDREN] marker replacement system with all variations.

### Steps

6.1. **Analyze [CHILDREN] Requirements**
   - Study `_gatsby/src/utils/parseChildrenOf.ts` thoroughly
   - Reference `tests/fixtures/children-test-cases.md` (created in Phase 2.4)
   - Document EVERY regex pattern and what it matches
   - Understand all syntax variations:
     - `[CHILDREN]` - basic, all children
     - `[CHILDREN asList]` - list format
     - `[CHILDREN Folder="model"]` - specific folder
     - `[CHILDREN Exclude="installation,composer"]` - exclusions
     - `[CHILDREN Only="installation"]` - inclusions only
     - `[CHILDREN reverse]` - reverse order
     - `[CHILDREN includeFolders]` - include index pages
     - Combinations of above flags
   - Edge cases: no children, non-index page, invalid folder names

6.2. **Create Children Utilities**
   - Create `src/lib/children/get-children.ts`:
     - `getChildren(doc: DocumentNode, includeFolders: boolean): DocumentNode[]`
     - `getSiblings(doc: DocumentNode): DocumentNode[]`
     - `getChildrenFiltered(doc: DocumentNode, options: FilterOptions): DocumentNode[]`
   - Port logic from `_gatsby/src/utils/nodes.ts`
   - Write comprehensive unit tests using mock tree

6.3. **Create [CHILDREN] Parser**
   - Create `src/lib/children/parse-children-marker.ts`:
     - `parseChildrenMarker(text: string): ChildrenConfig | null`
     - Parses `[CHILDREN ...]` syntax
     - Returns configuration object
   - Reference `_gatsby/src/utils/parseChildrenOf.ts` for regex patterns
   - Write unit tests for ALL variations:
     - `[CHILDREN]`
     - `[CHILDREN asList]`
     - `[CHILDREN Folder="model"]`
     - `[CHILDREN Exclude="installation,composer"]`
     - `[CHILDREN Only="installation"]`
     - `[CHILDREN reverse]`
     - `[CHILDREN includeFolders]`
     - Combined flags

6.4. **Create Children Renderer (Server Component)**
   - Create `src/components/ChildrenList.tsx`:
     - Server component (no 'use client')
     - Takes `config: ChildrenConfig` and `doc: DocumentNode` props
     - Renders card grid or list based on `asList` flag
     - Handles filtering, ordering, etc.
   - Port logic from `_gatsby/src/components/ChildrenOf.tsx`
   - Uses Tailwind/Bootstrap classes for styling

6.5. **Create [CHILDREN] Replacement Logic**
   - Create `src/lib/children/replace-children-markers.ts`:
     - `replaceChildrenMarkers(html: string, doc: DocumentNode, allDocs: DocumentNode[]): string`
     - Finds all `[CHILDREN ...]` markers in HTML
     - For each marker:
       - Parse configuration
       - Get matching children
       - Generate replacement HTML
     - Returns HTML with markers replaced
   - This must work with server-side rendering

6.6. **Create Test Function for Children Data**
   - Create `src/lib/children/get-children-data.ts`:
     - `getChildrenDataForUrl(slug: string, marker: string): ChildMetadata[]`
     - Returns array of child page metadata for testing
     - Used by tests to verify children are correct
   - Write unit tests that assert children data matches expectations

6.7. **Integrate into Page Rendering**
   - Update `src/app/en/[version]/[[...slug]]/page.tsx`:
     ```typescript
     let htmlContent = await markdownToHtml(doc.content);
     htmlContent = await replaceChildrenMarkers(htmlContent, doc, allDocs);
     ```

6.8. **Create Comprehensive [CHILDREN] Tests**
   - Create `tests/children-rendering.test.ts`:
     - Test each [CHILDREN] variation
     - Test with mock content tree
     - Assert correct children returned
     - Assert correct HTML generated
   - Create `tests/children-integration.test.ts`:
     - Test pages with [CHILDREN] markers using mock data
     - Parse HTML output
     - Verify links and titles correct

6.9. **Test in Mock Mode**
   - Start `npm run mock`
   - Navigate to pages with [CHILDREN] markers
   - Verify all variations render correctly
   - Verify clicking child links works

6.10. **Validation**
   - [ ] All [CHILDREN] unit tests pass
   - [ ] Integration tests pass
   - [ ] `npm run mock` shows [CHILDREN] rendered correctly
   - [ ] Mock pages contain correct child listings
   - [ ] `getChildrenDataForUrl()` tests pass for all cases
   - [ ] Visual inspection confirms correct rendering

---

## PHASE 7: Navigation & Sidebar

**Goal:** Create the sidebar navigation with proper hierarchy and state management.

### Steps

7.1. **Create Navigation Tree Builder**
   - Create `src/lib/nav/build-nav-tree.ts`:
     - `buildNavTree(version: string): NavNode[]`
     - Filters documents by version
     - Builds hierarchical tree structure
     - Respects `hideChildren`, `hideSelf` frontmatter
   - Port logic from `_gatsby/src/utils/nodes.ts` `getNavChildren()`
   - Write unit tests

7.2. **Create Sidebar Component (Client)**
   - Create `src/components/Sidebar.tsx`:
     - Mark as `'use client'` (needs interactivity)
     - Takes `navTree: NavNode[]` and `currentSlug: string` props
     - Renders nested navigation
     - Shows 3 levels (top → category → page)
     - Expands current path ancestors
   - Port structure from `_gatsby/src/components/Nav.tsx`

7.3. **Add Sidebar State Management**
   - Use `useState` for collapsed/expanded folders
   - Use `localStorage` to persist state (client-side only)
   - Key by version: `sidebar_state_v6`
   - Auto-expand current page's ancestor path

7.4. **Create Layout with Sidebar**
   - Create `src/components/DocsLayout.tsx`:
     - Takes children and sidebar props
     - Responsive layout (mobile toggle)
     - Bootstrap/Tailwind grid
   - Update page to use layout

7.5. **Style Sidebar Navigation**
   - Port CSS from `_gatsby/src/theme/assets/scss/`
   - Use Tailwind utilities where possible
   - Ensure active states work
   - Mobile responsive

7.6. **Test Sidebar Component**
   - Create `tests/sidebar.test.tsx`:
     - Use React Testing Library
     - Test rendering with mock nav tree
     - Test clicking items
     - Test expand/collapse
     - Test active state highlighting
   - Mock `localStorage` for state tests

7.7. **Validation**
   - [ ] Sidebar renders on all pages in `npm run mock`
   - [ ] Current page highlighted
   - [ ] Ancestor path auto-expanded
   - [ ] Click navigation works
   - [ ] State persists across navigation
   - [ ] Mobile toggle works
   - [ ] All sidebar tests pass

---

## PHASE 8: Version Switching

**Goal:** Implement version switcher and multi-version support.

### Steps

8.1. **Create Version Utilities**
   - Create `src/lib/versions/version-utils.ts`:
     - `getAllVersions(): string[]` - returns ['3', '4', '5', '6']
     - `getDefaultVersion(): string` - returns '6'
     - `getVersionStatus(version: string): VersionStatus` - 'current', 'supported', 'eol'
     - `getVersionPath(currentSlug: string, targetVersion: string): string`
   - Port logic from `_gatsby/src/utils/nodes.ts`
   - Write unit tests

8.2. **Create Version Switcher Component**
   - Create `src/components/VersionSwitcher.tsx`:
     - Client component (`'use client'`)
     - Dropdown to select version
     - Shows current version and status badge
     - Navigates to equivalent page in selected version
   - Port from Gatsby version switcher
   - Style with Tailwind/Bootstrap

8.3. **Add Version to Metadata**
   - Ensure all `DocumentNode` objects include `version` field
   - Update content tree builder to set version

8.4. **Create Version Banner**
   - Create `src/components/VersionBanner.tsx`:
     - Shows warning for EOL versions
     - Shows info for previous stable versions
     - Shows success for current version
     - Links to latest version equivalent page
   - Port logic from `_gatsby/src/utils/nodes.ts` `getVersionMessage()`

8.5. **Add Canonical URLs**
   - For non-latest versions, add `<link rel="canonical">` to latest version
   - Implement in page metadata

8.6. **Test Version Switching**
   - Create `tests/version-switching.test.ts`:
     - Test version path generation
     - Test switching between versions
     - Test fallback when page doesn't exist in target version

8.7. **Validation**
   - [ ] Version switcher appears on all pages in `npm run mock`
   - [ ] Can switch between v5 and v6 in mock mode
   - [ ] Version banner shows correct message
   - [ ] Canonical URL set for old versions
   - [ ] All version tests pass

---

## PHASE 9: Optional Features Support

**Goal:** Handle optional feature modules (linkfield, elemental, etc.) as subdirectories.

### Steps

9.1. **Analyze Optional Features Structure**
   - Study `sources-docs.cjs` naming convention: `docs--6--optional_features/linkfield`
   - Understand path structure: `/en/6/optional_features/linkfield/...`
   - Document how optional features integrate into navigation

9.2. **Update Content Tree Builder**
   - Modify `buildContentTree()` to handle `optional_features/` subdirectories
   - Parse `optional_features/{module}/` into navigation
   - Ensure slugs generated correctly

9.3. **Update Navigation Tree**
   - Optional features appear as top-level nav items
   - Or nested under a parent category (verify in Gatsby)

9.4. **Test with Mock Optional Feature**
   - Add `optional_features/linkfield/` to mock content
   - Verify builds correctly
   - Verify appears in navigation
   - Verify URLs correct

9.5. **Validation**
   - [ ] Optional features build correctly
   - [ ] Navigation includes optional features
   - [ ] URLs match Gatsby format
   - [ ] Tests pass with optional features included

---

## PHASE 10: Git Content Cloning

**Goal:** Replace mock data with real content cloned from git repositories.

### Steps

10.1. **Create Git Clone Script**
   - Create `scripts/clone-docs.mjs`:
     - Reads `DOCS_CONTEXT` from environment (defaults to `docs`)
     - Reads `_gatsby/sources-docs.cjs` or `_gatsby/sources-user.cjs`
     - Clones each repository to `.cache/content/`
     - Checks out correct branch
     - Handles optional features paths
     - Uses git command line or simple-git library

10.2. **Verify Content Loader**
   - Ensure `buildContentTree()` checks `NEXT_USE_MOCK_DATA` env var
   - If false (default), loads from `.cache/content/`
   - If true, loads from `tests/fixtures/mock-content/`

10.3. **Test Clone Script**
   - Run `npm run clone` (defaults to docs context)
   - Verify `.cache/content/` directory created
   - Verify markdown files cloned correctly
   - Test `npm run clone:docs` and `npm run clone:user`

10.4. **Test with Real Content**
   - Run `npm run dev` (uses cloned content)
   - Verify pages load correctly
   - Check navigation structure
   - Verify URLs match expectations

10.5. **Validation**
   - [ ] `npm run clone` successfully downloads content
   - [ ] `npm run clone:docs` clones docs context
   - [ ] `npm run clone:user` clones user context
   - [ ] `npm run dev` works with real content
   - [ ] `npm run mock` still works with mock data
   - [ ] All URLs correct with real content
   - [ ] Navigation shows real structure
   - [ ] Tests still pass (using mock data via `NEXT_USE_MOCK_DATA=true`)

---

## PHASE 11: Image Handling

**Goal:** Configure Next.js Image component and ensure markdown images load correctly.

### Steps

11.1. **Configure Next.js for Static Images**
   - Update `next.config.js`:
     ```javascript
     module.exports = {
       output: 'export',
       trailingSlash: true,
       images: { unoptimized: true }
     }
     ```
   - Note: Static export requires unoptimized images

11.2. **Create Image Path Resolver**
   - Create `src/lib/markdown/resolve-image-paths.ts`:
     - `resolveImagePath(imagePath: string, currentFilePath: string): string`
     - Resolves relative image paths in markdown
     - Handles `../` and `./` relative paths
     - Returns absolute path or public URL
   - Write unit tests with various path scenarios

11.3. **Update Markdown Processor for Images**
   - Modify remark/rehype pipeline to process images
   - Convert relative paths to absolute paths
   - Add `src/lib/markdown/remark-images.ts` plugin
   - Ensure images in `_images/` directories resolve correctly

11.4. **Test with Mock Images**
   - Add sample images to `tests/fixtures/mock-content/v6/_images/`
   - Add markdown with image references to mock files
   - Test various image path formats:
     - `![Alt text](../_images/screenshot.png)`
     - `![Alt text](_images/diagram.jpg)`
     - `![Alt text](./images/photo.png)`

11.5. **Validation**
   - [ ] Images in mock content display correctly
   - [ ] Relative paths resolve properly
   - [ ] No broken image links in `npm run mock`
   - [ ] Image path resolution tests pass

---

## PHASE 12: Search Integration (Algolia)

**Goal:** Integrate Algolia DocSearch for site search.

### Steps

11.1. **Install DocSearch**
   ```bash
   npm install @docsearch/react
   ```

11.2. **Create Search Component**
   - Create `src/components/SearchBox.tsx`:
     - Client component
     - Uses `@docsearch/react`
     - Configured with environment variables
   - Port from `_gatsby/src/components/SearchBox.tsx`

11.3. **Add to Header**
   - Create `src/components/Header.tsx`
   - Include SearchBox component
   - Style with Bootstrap/Tailwind

11.4. **Configure DocSearch**
   - Ensure index name correct for docs/user context
   - Verify API keys loaded from environment

11.5. **Validation**
   - [ ] Search box appears in header
   - [ ] Search opens on click
   - [ ] (Optional) Search results work if index exists
   - [ ] Component renders without errors

---

## PHASE 13: Styling & Polish

**Goal:** Apply full styling to match Gatsby site.

### Steps

12.1. **Port SCSS Styles**
   - Copy `_gatsby/src/theme/assets/scss/` files
   - Convert to CSS modules or Tailwind utilities
   - Keep Bootstrap if used, or replace with Tailwind

12.2. **Style Components**
   - Header, Sidebar, VersionSwitcher, VersionBanner, ChildrenList
   - Ensure responsive design works
   - Match Gatsby site appearance

12.3. **Add Icons**
   - Install Font Awesome or similar
   - Apply icons to navigation, children cards, etc.

12.4. **Handle Images**
   - Configure Next.js Image component
   - Ensure markdown images load correctly
   - Add image optimization

12.5. **Validation**
   - [ ] Site visually matches Gatsby site
   - [ ] Responsive design works on mobile
   - [ ] Icons display correctly
   - [ ] Images load

---

## PHASE 14: Metadata & SEO

**Goal:** Add proper metadata, OpenGraph tags, and sitemap.

### Steps

13.1. **Create Metadata Generator**
   - Create `src/lib/seo/metadata.ts`:
     - `generatePageMetadata(doc: DocumentNode): Metadata`
     - Returns Next.js metadata object
     - Includes title, description, OpenGraph, etc.

13.2. **Add to Page Components**
   - Export `generateMetadata()` function in page routes
   - Use document title, summary, etc.

13.3. **Add Sitemap**
   - Create `src/app/sitemap.ts`
   - Generate sitemap from all documents
   - Include changefreq, priority

13.4. **Add Robots.txt**
   - Create `src/app/robots.ts`
   - Configure indexing rules

13.5. **Validation**
   - [ ] All pages have proper titles
   - [ ] Meta descriptions set
   - [ ] OpenGraph tags present
   - [ ] Sitemap generated correctly
   - [ ] Robots.txt accessible

---
