import { resolveImagePath, normalizeImagePath, isRelativePath } from '@/lib/markdown/resolve-image-paths';

describe('resolveImagePath', () => {
  it('returns absolute paths unchanged', () => {
    const result = resolveImagePath('/images/screenshot.png', '/current/file.md');
    expect(result).toBe('/images/screenshot.png');
  });

  it('returns HTTP URLs unchanged', () => {
    const result = resolveImagePath('https://example.com/image.png', '/current/file.md');
    expect(result).toBe('https://example.com/image.png');
  });

  it('returns HTTP URLs unchanged (no https)', () => {
    const result = resolveImagePath('http://example.com/image.png', '/current/file.md');
    expect(result).toBe('http://example.com/image.png');
  });

  it('resolves relative paths with ../', () => {
    const imagePath = '../_images/screenshot.png';
    const filePath = '/content/v6/01_getting_started/index.md';
    const result = resolveImagePath(imagePath, filePath);
    // Should resolve to /_images/screenshot.png
    expect(result).toContain('_images/screenshot.png');
  });

  it('resolves relative paths with ./', () => {
    const imagePath = './_images/diagram.jpg';
    const filePath = '/content/v6/01_getting_started/index.md';
    const result = resolveImagePath(imagePath, filePath);
    // Should resolve to same directory
    expect(result).toContain('_images/diagram.jpg');
  });

  it('resolves nested relative paths', () => {
    const imagePath = '../../_images/photo.png';
    const filePath = '/content/v6/02_developer_guides/01_model/index.md';
    const result = resolveImagePath(imagePath, filePath);
    expect(result).toContain('_images/photo.png');
  });

  it('handles mock-content paths', () => {
    const imagePath = '../_images/mock.png';
    const filePath = '/home/project/tests/fixtures/mock-content/v6/01_getting_started/index.md';
    const result = resolveImagePath(imagePath, filePath);
    expect(result).toContain('_images/mock.png');
  });

  it('handles .cache/docs paths', () => {
    const imagePath = '_images/locale-filter.png';
    const filePath = '/home/project/.cache/docs/v6/optional_features/fluent/03_configuration.md';
    const result = resolveImagePath(imagePath, filePath);
    expect(result).toBe('/v6/optional_features/fluent/_images/locale-filter.png');
  });

  it('handles .cache/user paths', () => {
    const imagePath = '../_images/screenshot.png';
    const filePath = '/home/project/.cache/user/v6/01_Managing_your_website/index.md';
    const result = resolveImagePath(imagePath, filePath);
    expect(result).toBe('/v6/_images/screenshot.png');
  });

  it('handles legacy .cache/content paths', () => {
    const imagePath = '../_images/legacy.png';
    const filePath = '/home/project/.cache/content/v6/01_getting_started/index.md';
    const result = resolveImagePath(imagePath, filePath);
    expect(result).toBe('/v6/_images/legacy.png');
  });

  it('handles Windows-style paths', () => {
    const imagePath = '../_images/screenshot.png';
    const filePath = 'C:\\content\\v6\\01_getting_started\\index.md';
    const result = resolveImagePath(imagePath, filePath);
    // Should normalize to forward slashes
    expect(result).not.toContain('\\');
  });
});

describe('normalizeImagePath', () => {
  it('removes trailing slashes', () => {
    const result = normalizeImagePath('/images/');
    expect(result).toBe('/images');
  });

  it('preserves paths without trailing slashes', () => {
    const result = normalizeImagePath('/images/screenshot.png');
    expect(result).toBe('/images/screenshot.png');
  });

  it('handles root path', () => {
    const result = normalizeImagePath('/');
    expect(result).toBe('/');
  });

  it('handles empty string', () => {
    const result = normalizeImagePath('');
    expect(result).toBe('/');
  });
});

describe('isRelativePath', () => {
  it('returns true for relative paths', () => {
    expect(isRelativePath('../images/test.png')).toBe(true);
    expect(isRelativePath('./images/test.png')).toBe(true);
    expect(isRelativePath('images/test.png')).toBe(true);
  });

  it('returns false for absolute paths', () => {
    expect(isRelativePath('/images/test.png')).toBe(false);
  });

  it('returns false for HTTP URLs', () => {
    expect(isRelativePath('https://example.com/image.png')).toBe(false);
    expect(isRelativePath('http://example.com/image.png')).toBe(false);
  });
});
