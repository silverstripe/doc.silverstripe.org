import { DEFAULT_VERSION } from '@/global-config';

describe('global-config', () => {
  it('should export DEFAULT_VERSION as "6"', () => {
    expect(DEFAULT_VERSION).toBe('6');
  });

  it('should export DEFAULT_VERSION as a string', () => {
    expect(typeof DEFAULT_VERSION).toBe('string');
  });
});
