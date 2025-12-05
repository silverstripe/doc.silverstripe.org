import {
  getOptionalFeatureFromDocument,
  getDocumentGithubInfo,
} from '@/lib/utils/github-utils';
import { DocumentNode } from '@/types/types';

describe('github-utils', () => {
  describe('getOptionalFeatureFromDocument', () => {
    it('returns the optional feature from document', () => {
      const doc: DocumentNode = {
        slug: '/en/6/optional_features/linkfield/',
        version: '6',
        filePath: 'index.md',
        fileTitle: 'LinkField',
        fileAbsolutePath: '/path/to/index.md',
        isIndex: true,
        parentSlug: '/en/6/',
        title: 'LinkField',
        content: 'content',
        category: 'docs',
        optionalFeature: 'linkfield',
      };

      const result = getOptionalFeatureFromDocument(doc);
      expect(result).toBe('linkfield');
    });

    it('returns null when document has no optional feature', () => {
      const doc: DocumentNode = {
        slug: '/en/6/getting-started/',
        version: '6',
        filePath: 'index.md',
        fileTitle: 'Getting Started',
        fileAbsolutePath: '/path/to/index.md',
        isIndex: true,
        parentSlug: '/en/6/',
        title: 'Getting Started',
        content: 'content',
        category: 'docs',
      };

      const result = getOptionalFeatureFromDocument(doc);
      expect(result).toBeNull();
    });

    it('returns null when document is null', () => {
      const result = getOptionalFeatureFromDocument(null);
      expect(result).toBeNull();
    });
  });

  describe('getDocumentGithubInfo', () => {
    it('returns correct info for core v6 docs', () => {
      const info = getDocumentGithubInfo('6', null);
      expect(info).toEqual({
        owner: 'silverstripe',
        repo: 'developer-docs',
        branch: '6.1',
        docsPath: 'en',
      });
    });

    it('returns correct info for v5 docs', () => {
      const info = getDocumentGithubInfo('5', null);
      expect(info).toEqual({
        owner: 'silverstripe',
        repo: 'developer-docs',
        branch: '5.4',
        docsPath: 'en',
      });
    });

    it('returns correct info for optional feature linkfield v6', () => {
      const info = getDocumentGithubInfo('6', 'linkfield');
      expect(info).toEqual({
        owner: 'silverstripe',
        repo: 'silverstripe-linkfield',
        branch: '5.1',
        docsPath: 'docs/en',
      });
    });

    it('returns correct info for optional feature fluent v6', () => {
      const info = getDocumentGithubInfo('6', 'fluent');
      expect(info).toEqual({
        owner: 'tractorcow',
        repo: 'silverstripe-fluent',
        branch: '8.1',
        docsPath: 'docs/en',
      });
    });

    it('returns correct info for optional feature with different owners', () => {
      const info = getDocumentGithubInfo('5', 'fluent');
      expect(info).toEqual({
        owner: 'tractorcow-farm',
        repo: 'silverstripe-fluent',
        branch: '7.3',
        docsPath: 'docs/en',
      });
    });

    it('returns null for unknown version', () => {
      const info = getDocumentGithubInfo('99', null);
      expect(info).toBeNull();
    });

    it('returns null for unknown optional feature', () => {
      const info = getDocumentGithubInfo('6', 'unknown-feature');
      expect(info).toBeNull();
    });
  });
});
