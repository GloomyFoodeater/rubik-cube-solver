import { describe, expect, it } from 'vitest';
import { type CubeState } from '../../types/cube';
import { createSolvedCube } from '../cube';
import { isValidCubeState } from '../validator';

describe(isValidCubeState, () => {
  it('true on a newly created solved cube', () => {
    // Arrange
    const cube = createSolvedCube();

    // Act
    const result = isValidCubeState(cube);

    // Assert
    expect(result).toBe(true);
  });
  it('true on a scrambled cube', () => {
    // Arrange
    // Valid state after R U
    const scrambled: CubeState = {
      U: ['W', 'W', 'W', 'W', 'W', 'W', 'G', 'G', 'G'],
      D: ['Y', 'Y', 'B', 'Y', 'Y', 'B', 'Y', 'Y', 'B'],
      F: ['R', 'R', 'R', 'G', 'G', 'Y', 'G', 'G', 'Y'],
      B: ['O', 'O', 'O', 'W', 'B', 'B', 'W', 'B', 'B'],
      R: ['W', 'B', 'B', 'R', 'R', 'R', 'R', 'R', 'R'],
      L: ['G', 'G', 'Y', 'O', 'O', 'O', 'O', 'O', 'O'],
    };

    // Act
    const result = isValidCubeState(scrambled);

    // Assert
    expect(result).toBe(true);
  });
  it('true on a solved cube after whole-cube rotations', () => {
    // Arrange
    // State after x rotation
    const rotated: CubeState = {
      U: Array(9).fill('G'),
      D: Array(9).fill('B'),
      F: Array(9).fill('Y'),
      B: Array(9).fill('W'),
      R: Array(9).fill('R'),
      L: Array(9).fill('O'),
    };

    // Act
    const result = isValidCubeState(rotated);

    // Assert
    expect(result).toBe(true);
  });
  it('false when sticker color counts are not 9 per color', () => {
    // Arrange
    const solved = createSolvedCube();
    const cube: CubeState = {
      ...solved,
      U: solved.U.with(0, 'G'),
    };

    // Act
    const result = isValidCubeState(cube);

    // Assert
    expect(result).toBe(false);
  });
  it('false when center stickers are not unique', () => {
    // Arrange
    // Swap U center ('W') with F corner ('G') so color counts stay 9 each
    const solved = createSolvedCube();
    const cube: CubeState = {
      ...solved,
      U: solved.U.with(4, 'G'),
      F: solved.F.with(0, 'W'),
    };

    // Act
    const result = isValidCubeState(cube);

    // Assert
    expect(result).toBe(false);
  });
  it('false when a cubie has an impossible color combination', () => {
    // Arrange
    // Swap UF['F', 1] ('G') with DB['D', 7] ('Y'), creating impossible [W, Y] and [G, B] edges
    const solved = createSolvedCube();
    const cube: CubeState = {
      ...solved,
      F: solved.F.with(1, 'Y'),
      D: solved.D.with(7, 'G'),
    };

    // Act
    const result = isValidCubeState(cube);

    // Assert
    expect(result).toBe(false);
  });
  it('false when a cubie is duplicated', () => {
    // Arrange
    // Turn UB edge [W, B] into a second UF edge [W, G], and DF edge [Y, G] into DB edge [Y, B]
    const solved = createSolvedCube();
    const cube: CubeState = {
      ...solved,
      B: solved.B.with(1, 'G'),
      F: solved.F.with(7, 'B'),
    };

    // Act
    const result = isValidCubeState(cube);

    // Assert
    expect(result).toBe(false);
  });
  it('false when a single corner is twisted', () => {
    // Arrange
    // Twist UFR corner CW: ['W', 'R', 'G'] -> ['G', 'W', 'R']
    const solved = createSolvedCube();
    const cube: CubeState = {
      ...solved,
      U: solved.U.with(8, 'G'),
      R: solved.R.with(0, 'W'),
      F: solved.F.with(2, 'R'),
    };

    // Act
    const result = isValidCubeState(cube);

    // Assert
    expect(result).toBe(false);
  });
  it('false when a single edge is flipped', () => {
    // Arrange
    // Flip UF edge: ['W', 'G'] -> ['G', 'W']
    const solved = createSolvedCube();
    const cube: CubeState = {
      ...solved,
      U: solved.U.with(7, 'G'),
      F: solved.F.with(1, 'W'),
    };

    // Act
    const result = isValidCubeState(cube);

    // Assert
    expect(result).toBe(false);
  });
  it('false when two corners are swapped without swapping edges', () => {
    // Arrange
    // Swap UFR and UFL corners without twisting (U stickers stay 'W')
    const solved = createSolvedCube();
    const cube: CubeState = {
      ...solved,
      R: solved.R.with(0, 'G'),
      F: solved.F.with(2, 'O').with(0, 'R'),
      L: solved.L.with(2, 'G'),
    };

    // Act
    const result = isValidCubeState(cube);

    // Assert
    expect(result).toBe(false);
  });
});
