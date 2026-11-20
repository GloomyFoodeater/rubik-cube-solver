import { describe, expect, it } from 'vitest';
import { createSolvedCube, isSolved } from '../cube';
import { FACES, DEFAULT_COLOR_SCHEME, type CubeState } from '../../types/cube';

describe(createSolvedCube, () => {
  it('has 6 faces and 9 tiles for each', () => {
    // Arrange & Act
    const cube = createSolvedCube();

    // Assert
    expect(Object.keys(cube)).toEqual(FACES);
    expect(Object.values(cube).every((fv) => fv.length === 9)).toBe(true);
  });
  it('satisfies BOY color scheme', () => {
    // Arrange & Act
    const cube = createSolvedCube();

    // Assert
    FACES.forEach((f) => {
      expect(cube[f].every((c) => c === DEFAULT_COLOR_SCHEME[f])).toBe(true);
    });
  });
});
describe(isSolved, () => {
  it('true on created cube', () => {
    // Arrange
    const cube = createSolvedCube();

    // Act
    const result = isSolved(cube);

    // Assert
    expect(result).toBe(true);
  });
  it('true on solved rotated cube', () => {
    // Arrange
    const cube: CubeState = {
      U: Array(9).fill('G'),
      D: Array(9).fill('B'),
      F: Array(9).fill('Y'),
      B: Array(9).fill('W'),
      R: Array(9).fill('R'),
      L: Array(9).fill('O'),
    };

    // Act
    const result = isSolved(cube);

    // Assert
    expect(result).toBe(true);
  });
  it('false when some faces are solved and others are not', () => {
    // Arrange
    const solved = createSolvedCube();

    // State after a single D turn (U is completely solved, side faces are not)
    const cube: CubeState = {
      ...solved,
      F: [...solved.F.slice(0, 6), 'O', 'O', 'O'],
      R: [...solved.R.slice(0, 6), 'G', 'G', 'G'],
      B: [...solved.B.slice(0, 6), 'R', 'R', 'R'],
      L: [...solved.L.slice(0, 6), 'B', 'B', 'B'],
    };

    // Act
    const result = isSolved(cube);

    // Assert
    expect(result).toBe(false);
  });
});
