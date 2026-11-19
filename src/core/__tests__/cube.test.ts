import { describe, expect, it } from 'vitest';
import { createSolvedCube } from '../cube';
import { FACES, DEFAULT_COLOR_SCHEME } from '../../types/cube';

describe('createSolvedCube', () => {
  it('has 6 faces and 9 tiles for each', () => {
    // Arrange
    // Act
    const cube = createSolvedCube();

    // Assert
    expect(Object.keys(cube)).toEqual(FACES);
    expect(Object.values(cube).every((fv) => fv.length === 9)).toBe(true);
  });
  it('satisfies BOY color scheme', () => {
    // Arrange
    // Act
    const cube = createSolvedCube();

    // Assert
    FACES.forEach((f) => {
      expect(cube[f].every((c) => c === DEFAULT_COLOR_SCHEME[f])).toBe(true);
    });
  });
});
