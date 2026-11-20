import { describe, expect, it } from 'vitest';
import { generateScramble } from '../scramble';
import type { Face } from '../../types/cube';

describe(generateScramble, () => {
  it('generates turn array of required length', () => {
    // Arrange
    const length = 100;

    // Act
    const scramble = generateScramble(length);
    const defaultScramble = generateScramble();

    // Assert
    expect(scramble).toHaveLength(length);
    expect(defaultScramble).toHaveLength(20);
  });
  it('generates empty array on 0 length', () => {
    // Arrange & Act
    const scramble = generateScramble(0);

    // Assert
    expect(scramble).toEqual([]);
  });
  it('accepts only non-negative integers', () => {
    // Arrange
    const negativeCandidates: number[] = [-1, NaN, Infinity, -Infinity, 1.2];

    // Act & Assert
    for (const candidate of negativeCandidates) {
      expect(() => generateScramble(candidate)).toThrow(RangeError);
    }
  });
  it('does not generate reducible turns', () => {
    // Arrange
    // prettier-ignore
    const oppositeFaces: Readonly<Record<Face, Face>> = {
      U: 'D', D: 'U', F: 'B', B: 'F', R: 'L', L: 'R'
    };
    const length = 100;

    // Act
    const scrambles = Array.from({ length }, () => generateScramble());

    // Assert
    for (const scramble of scrambles) {
      const faces = scramble.map((turn) => turn[0] as Face);

      for (let i = 1; i < faces.length; i++) {
        const current = faces[i];
        const prev = faces[i - 1];
        const prevPrev: Face | undefined = faces[i - 2];

        // Equality between current and previous causes reducible turn
        // (i.e. R R' -> R2, R R2 -> R', R' R2 -> R)
        expect(current).not.toBe(prev);

        if (prevPrev !== undefined && oppositeFaces[prev] === current) {
          // Equality between those 2 also allow us to reduce number of turns
          // (though with swapping, i.e. R L R -> L R2)
          expect(current).not.toBe(prevPrev);
        }
      }
    }
  });
});
