import { DEFAULT_VERSION, SITE_URL } from '../../global-config';

describe('global-config', () => {
  it('should export DEFAULT_VERSION as "6"', () => {
    expect(DEFAULT_VERSION).toBe('6');
  });

  it('should export DEFAULT_VERSION as a string', () => {
    expect(typeof DEFAULT_VERSION).toBe('string');
  });

  it('should export SITE_URL correctly', () => {
    expect(SITE_URL).toBe('https://doc.silverstripe.org');
  });

  it('should export SITE_URL as a string', () => {
    expect(typeof SITE_URL).toBe('string');
  });
});
