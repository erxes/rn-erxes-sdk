import { createObjectIdLikeString } from '../utils/objectId';

describe('createObjectIdLikeString', () => {
  it('returns a 24-character string', () => {
    expect(createObjectIdLikeString()).toHaveLength(24);
  });

  it('contains only lowercase hexadecimal characters', () => {
    expect(createObjectIdLikeString()).toMatch(/^[0-9a-f]{24}$/);
  });

  it('generates unique values across multiple calls', () => {
    const ids = new Set(
      Array.from({ length: 1000 }, () => createObjectIdLikeString())
    );
    expect(ids.size).toBe(1000);
  });
});
