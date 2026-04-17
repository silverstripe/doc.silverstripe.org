import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { DocsContext } from '@/types/types';

jest.mock('next/og', () => ({
  ImageResponse: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@/lib/config/config', () => ({
  getConfig: jest.fn(),
}));

// eslint-disable-next-line import/first
import { ImageResponse } from 'next/og';
// eslint-disable-next-line import/first
import { getConfig } from '@/lib/config/config';
// eslint-disable-next-line import/first
import Icon, { size, dynamic } from '@/app/icon';

const MockImageResponse = ImageResponse as jest.MockedClass<typeof ImageResponse>;
const mockGetConfig = getConfig as jest.MockedFunction<typeof getConfig>;

const makeConfig = (docsContext: DocsContext) => ({
  docsContext,
  docsearchAppId: '',
  docsearchApiKey: '',
  docsearchIndexName: '',
  useMockData: false,
});

describe('icon', () => {
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  describe('named exports', () => {
    it('exports size as 32x32', () => {
      expect(size).toEqual({ width: 32, height: 32 });
    });

    it('exports dynamic as force-static', () => {
      expect(dynamic).toBe('force-static');
    });
  });

  describe('Icon()', () => {
    it('renders CMSIcon for docs context', () => {
      mockGetConfig.mockReturnValue(makeConfig('docs'));

      Icon();

      expect(MockImageResponse).toHaveBeenCalledTimes(1);
      const [element, options] = MockImageResponse.mock.calls[0] as [React.ReactElement, Record<string, unknown>];
      const html = renderToStaticMarkup(element);
      expect(html).toContain('#0049a3');
      expect(html).not.toContain('#005ae1');
      expect(options).toEqual({ width: 32, height: 32 });
    });

    it('renders CMSIcon for user context', () => {
      mockGetConfig.mockReturnValue(makeConfig('user'));

      Icon();

      expect(MockImageResponse).toHaveBeenCalledTimes(1);
      const [element, options] = MockImageResponse.mock.calls[0] as [React.ReactElement, Record<string, unknown>];
      const html = renderToStaticMarkup(element);
      expect(html).toContain('#0049a3');
      expect(html).not.toContain('#005ae1');
      expect(options).toEqual({ width: 32, height: 32 });
    });

    it('renders SearchIcon for search context', () => {
      mockGetConfig.mockReturnValue(makeConfig('search'));

      Icon();

      expect(MockImageResponse).toHaveBeenCalledTimes(1);
      const [element, options] = MockImageResponse.mock.calls[0] as [React.ReactElement, Record<string, unknown>];
      const html = renderToStaticMarkup(element);
      expect(html).toContain('#005ae1');
      expect(html).not.toContain('#0049a3');
      expect(options).toEqual({ width: 32, height: 32 });
    });

    it('spreads the size object into ImageResponse options', () => {
      mockGetConfig.mockReturnValue(makeConfig('docs'));

      Icon();

      const [, options] = MockImageResponse.mock.calls[0] as [React.ReactElement, Record<string, unknown>];
      expect(options).toHaveProperty('width', size.width);
      expect(options).toHaveProperty('height', size.height);
    });
  });
});

