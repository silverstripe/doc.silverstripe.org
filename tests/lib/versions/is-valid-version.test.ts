import { isValidVersion } from '@/lib/versions/version-utils';

describe('isValidVersion', () => {
  it('should return true for valid versions', () => {
    expect(isValidVersion('3')).toBe(true);
    expect(isValidVersion('4')).toBe(true);
    expect(isValidVersion('5')).toBe(true);
    expect(isValidVersion('6')).toBe(true);
  });

  it('should return false for invalid versions', () => {
    expect(isValidVersion('7')).toBe(false);
    expect(isValidVersion('2')).toBe(false);
    expect(isValidVersion('contributing')).toBe(false);
    expect(isValidVersion('getting-started')).toBe(false);
    expect(isValidVersion('lessons')).toBe(false);
    expect(isValidVersion('')).toBe(false);
  });
});
