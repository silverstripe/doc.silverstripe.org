import { stripChangelogToc } from '@/lib/markdown/strip-changelog-toc';

describe('stripChangelogToc', () => {
  describe('non-changelog pages', () => {
    it('should return unchanged markdown for docs pages', () => {
      const markdown = `---
title: Some Docs
---

# Title

- [Link](#link)

## Section

Content here`;

      const result = stripChangelogToc(markdown, '/en/6/guides/some-page/');
      expect(result).toBe(markdown);
    });

    it('should return unchanged markdown for changelog index', () => {
      const markdown = `---
title: Changelogs
---

# Changelogs

- [6.1.0](/en/6/changelogs/6-1-0/)
- [6.0.0](/en/6/changelogs/6-0-0/)`;

      const result = stripChangelogToc(markdown, '/en/6/changelogs/');
      expect(result).toBe(markdown);
    });

    it('should return unchanged markdown for empty slug', () => {
      const markdown = '# Content\n\n- [Link](#link)';
      const result = stripChangelogToc(markdown, '');
      expect(result).toBe(markdown);
    });
  });

  describe('changelog pages', () => {
    it('should strip TOC links from changelog page', () => {
      const markdown = `---
title: Version 6.1.0
---

# Release Notes

- [Breaking Changes](#breaking-changes)
- [New Features](#new-features)
- [Bug Fixes](#bug-fixes)

## Breaking Changes

Major breaking changes listed here.

## New Features

New features in this release.

## Bug Fixes

Bug fixes included.`;

      const result = stripChangelogToc(markdown, '/en/6/changelogs/6-1-0/');

      expect(result).not.toContain('- [Breaking Changes](#breaking-changes)');
      expect(result).not.toContain('- [New Features](#new-features)');
      expect(result).not.toContain('- [Bug Fixes](#bug-fixes)');
      expect(result).toContain('## Breaking Changes');
      expect(result).toContain('## New Features');
      expect(result).toContain('## Bug Fixes');
      expect(result).toContain('Major breaking changes listed here.');
    });

    it('should strip Overview section with nested TOC and details tag', () => {
      const markdown = `---
title: 6.1.0
---

# 6.1.0

## Overview

- [Features](#features)
  - [Feature 1](#feature-1)
  - [Feature 2](#feature-2)
- [Bug fixes](#bug-fixes)

<details>

<summary>Included modules</summary>

| Module | Version |
| --- | --- |
| module1 | 1.0 |

</details>

## Features

Feature content here.

## Bug fixes

Bug fix content here.`;

      const result = stripChangelogToc(markdown, '/en/6/changelogs/6-1-0/');

      expect(result).not.toContain('## Overview');
      expect(result).not.toContain('- [Features](#features)');
      expect(result).not.toContain('<details>');
      expect(result).not.toContain('</details>');
      expect(result).not.toContain('Included modules');
      expect(result).toContain('## Features');
      expect(result).toContain('Feature content here.');
      expect(result).toContain('## Bug fixes');
    });

    it('should preserve frontmatter when stripping TOC', () => {
      const markdown = `---
title: Version 6.1.0
author: Me
---

# Release Notes

- [Section](#section)

## Section

Content here`;

      const result = stripChangelogToc(markdown, '/en/6/changelogs/6-1-0/');

      expect(result).toContain('---');
      expect(result).toContain('title: Version 6.1.0');
      expect(result).toContain('author: Me');
      expect(result).not.toContain('- [Section](#section)');
    });

    it('should handle TOC with bullet points (*)', () => {
      const markdown = `---
title: Version 6.1.0
---

# Release Notes

* [Breaking Changes](#breaking-changes)
* [New Features](#new-features)

## Breaking Changes

Changes here.`;

      const result = stripChangelogToc(markdown, '/en/6/changelogs/6-1-0/');

      expect(result).not.toContain('* [Breaking Changes](#breaking-changes)');
      expect(result).toContain('## Breaking Changes');
    });

    it('should return unchanged markdown if no H2 found', () => {
      const markdown = `---
title: Version 6.1.0
---

# Release Notes

- [Section](#section)

No H2 sections in this changelog.`;

      const result = stripChangelogToc(markdown, '/en/6/changelogs/6-1-0/');
      expect(result).toBe(markdown);
    });

    it('should preserve non-TOC content before H2', () => {
      const markdown = `---
title: Version 6.1.0
---

# Release Notes

This is introduction text that is not a TOC.

## First Section

Content here.`;

      const result = stripChangelogToc(markdown, '/en/6/changelogs/6-1-0/');

      expect(result).toContain('This is introduction text');
      expect(result).toContain('## First Section');
    });

    it('should handle mixed TOC and content - stop at non-TOC content', () => {
      const markdown = `---
title: Version 6.1.0
---

# Release Notes

- [Breaking Changes](#breaking-changes)
- [New Features](#new-features)

This is some intro text.

- [Bug Fixes](#bug-fixes)

## First Section

Content.`;

      const result = stripChangelogToc(markdown, '/en/6/changelogs/6-1-0/');

      // Should preserve all content since it detected non-TOC content
      expect(result).toContain('- [Bug Fixes](#bug-fixes)');
      expect(result).toContain('This is some intro text.');
    });

    it('should handle empty content', () => {
      const result = stripChangelogToc('', '/en/6/changelogs/6-1-0/');
      expect(result).toBe('');
    });

    it('should handle changelog page with no TOC', () => {
      const markdown = `---
title: Version 6.1.0
---

# Release Notes

## Breaking Changes

Changes here.`;

      const result = stripChangelogToc(markdown, '/en/6/changelogs/6-1-0/');
      expect(result).toBe(markdown);
    });

    it('should handle whitespace and empty lines correctly', () => {
      const markdown = `---
title: Version 6.1.0
---

# Release Notes

  - [Breaking Changes](#breaking-changes)
  - [New Features](#new-features)


## Breaking Changes

Content here.`;

      const result = stripChangelogToc(markdown, '/en/6/changelogs/6-1-0/');

      expect(result).not.toContain('- [Breaking Changes](#breaking-changes)');
      expect(result).toContain('## Breaking Changes');
    });
  });
});
