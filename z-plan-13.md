# Phase 1: Remove Hardcoded Directory List and Make Root-Relative Link Detection Dynamic

**Objective:** Remove the hardcoded `KNOWN_DIR_SEGMENTS` array and implement dynamic detection of internal documentation links. All root-relative paths (starting with `/`) that are not external resources should be treated as internal docs links.

**Tasks:**
1. Update `src/lib/markdown/resolve-link-paths.ts`
   - Remove the `KNOWN_DIR_SEGMENTS` constant entirely
   - Remove the `containsKnownSegment` function entirely
   - Update root-relative path handling: treat ALL paths starting with `/` as internal docs links IF they:
     - Do NOT start with `/en/` (already resolved)
     - Do NOT contain `://` (protocol indicator)
     - Do NOT start with `http`
     - Do NOT appear to be static asset paths (e.g., `/_images/`, `/_resources/`, `/assets/`)
   - Apply `resolveRootRelativePath` to all qualifying root-relative links
2. Create UNIT TESTS in `tests/lib/markdown/resolve-link-paths.test.ts`
   - Test `/project_governance/request_for_comment` → `/en/6/project_governance/request_for_comment/`
   - Test `/upgrading/deprecations` → `/en/6/upgrading/deprecations/`
   - Test `/any_new_section/any_page` → `/en/6/any_new_section/any_page/` (proves no hardcoding)
   - Test `/_images/screenshot.png` remains unchanged (static asset)
   - Test `/en/6/already/resolved/` remains unchanged
   - Update any existing tests that relied on `containsKnownSegment` behavior
3. Run tests: `npm test -- tests/lib/markdown/resolve-link-paths.test.ts`
4. Run linting: `npm run lint`

---

# Phase 2: Support Relative Links Without .md Extension

**Objective:** Resolve relative links like `./code`, `../getting_started`, `../fixtures` that don't have `.md` extension but refer to documentation pages.

**Tasks:**
1. Update `src/lib/markdown/resolve-link-paths.ts`
   - In `resolveMarkdownLink`, add logic to handle relative links without `.md` extension
   - Check if the link starts with `./` or `../` and does NOT start with `http` or contain `://`
   - Skip links that are anchors only (start with `#`)
   - Skip links that appear to be static assets (image extensions like `.png`, `.jpg`, `.gif`, `.svg`, `.webp`, or paths containing `/_images/`)
   - For qualifying relative links, resolve them relative to the current file path and produce correct `/en/{version}/...` URL
   - Preserve anchor fragments when present (e.g., `./code#section` → `/en/6/.../code/#section`)
2. Create UNIT TESTS in `tests/lib/markdown/resolve-link-paths.test.ts`
   - Test `./code` from `/home/project/.cache/docs/v6/10_Contributing/02_Documentation.md` → `/en/6/contributing/code/`
   - Test `../getting_started` from `/home/project/.cache/docs/v6/10_Contributing/02_Documentation.md` → `/en/6/getting_started/`
   - Test `../fixtures` from `/home/project/.cache/docs/v6/02_Developer_Guides/06_Testing/How_Tos/02_FixtureFactories.md` → `/en/6/developer_guides/testing/fixtures/`
   - Test `./code#section` preserves anchor
   - Test that external links like `https://example.com` are not modified
   - Test that image links like `../_images/screenshot.png` are not modified
3. Run tests: `npm test`
4. Run linting: `npm run lint`

---

# Phase 3: Fix Parent Directory Resolution for Cross-Section Links

**Objective:** Ensure links like `../developer_guides/testing/unit_testing` from within `contributing/` directory resolve correctly to `/en/6/developer_guides/testing/unit_testing/` instead of incorrectly including the parent directory.

**Tasks:**
1. Update `src/lib/markdown/resolve-link-paths.ts`
   - Review the relative path resolution logic in `resolveMarkdownLink`
   - Ensure that when resolving relative paths that go to parent directories, the path is resolved correctly from the content root (not including erroneous parent segments)
   - The resolved path should strip numeric prefixes from ALL path segments
   - The output URL should only include the actual documentation path from the content root
2. Create UNIT TESTS in `tests/lib/markdown/resolve-link-paths.test.ts`
   - Test `../developer_guides/testing/unit_testing` from `contributing/01_Code.md` → `/en/6/developer_guides/testing/unit_testing/`
   - Test `../getting_started/composer#contributing` from `contributing/01_Code.md` → `/en/6/getting_started/composer/#contributing`
   - Test `../../getting_started/environment_management` from deep nested path → `/en/6/getting_started/environment_management/`
3. Run tests: `npm test`
4. Run linting: `npm run lint`

---

# Phase 4: Handle Mixed Case Directory Names

**Objective:** Ensure links with mixed case directory names like `../Project_Governance/Minor_release_policy` resolve correctly with case normalization.

**Tasks:**
1. Update `src/lib/markdown/resolve-link-paths.ts`
   - Verify that the path normalization converts all path segments to lowercase
   - Ensure mixed case like `Project_Governance` becomes `project_governance` in the output URL
   - Verify anchor fragments preserve their original case (anchors are case-sensitive in browsers)
2. Create UNIT TESTS in `tests/lib/markdown/resolve-link-paths.test.ts`
   - Test `../Project_Governance/Minor_release_policy#security-patch-windows` → `/en/6/project_governance/minor_release_policy/#security-patch-windows`
   - Test that path segments are lowercased but anchors keep original case
3. Run tests: `npm test`
4. Run linting: `npm run lint`

---

# Phase 5: Integration Testing with Markdown Processor

**Objective:** Verify the full markdown processing pipeline correctly resolves all link types.

**Tasks:**
1. Update `tests/lib/markdown/links.test.ts`
   - Add integration test for root-relative links without `.md` extension: `/project_governance/request_for_comment`
   - Add integration test for relative links without `.md` extension: `./code`, `../fixtures`
   - Add integration test for parent directory links crossing sections: `../developer_guides/testing/unit_testing`
   - Add integration test for mixed case paths: `../Project_Governance/Minor_release_policy#section`
2. Verify that existing tests still pass
3. Run all markdown tests: `npm test`
4. Run linting: `npm run lint`

---

# Phase 6: Verify Against Real Content and Edge Cases

**Objective:** Run full test suite and verify the changes work with mock content structure.

**Tasks:**
1. Update mock content if needed in `tests/fixtures/mock-content/`
   - Ensure mock content structure reflects real docs structure with directories like `contributing/`, `project_governance/`, etc. if not already present
2. Run full test suite: `npm test`
3. Run linting: `npm run lint`
4. Test build to ensure no regressions: `npm run build` (if content is available)
   - Alternatively run `npm run mock` and manually verify a few pages have correct links
5. Document any remaining edge cases for future work

---
