import { DEFAULT_VERSION, SITE_URL } from '../../global-config';

describe('global-config', () => {
  it('should export DEFAULT_VERSION as expected value', () => {
    expect(DEFAULT_VERSION).toBe(DEFAULT_VERSION);
  });

  it('should export DEFAULT_VERSION as a string', () => {
    expect(typeof DEFAULT_VERSION).toBe('string');
  });

  it('should export SITE_URL correctly', () => {
    expect(SITE_URL).toBe('https://docs.silverstripe.org');
  });

  it('should export SITE_URL as a string', () => {
    expect(typeof SITE_URL).toBe('string');
  });
});
