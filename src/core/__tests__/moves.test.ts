import { describe, expect, it } from 'vitest';
import { FACES, type CubeState, type Move } from '../../types/cube';
import { applyMove, applyMoves } from '../moves';

/**
 * Creates a synthetic cube where every sticker has a unique identifier ('U0'..'L8')
 * to verify exact sticker-by-sticker permutations and orientation without color collisions.
 */
function createIndexedCube(): CubeState {
  const entries = FACES.map((face) => [
    face,
    Array.from({ length: 9 }, (_, index) => `${face}${index}`),
  ]);

  return Object.fromEntries(entries) as CubeState;
}

describe(applyMove, () => {
  // prettier-ignore
  it('shifts exact facelets and rotates U matrix clockwise on U turn', () => {
    // Arrange
    const cube = createIndexedCube();

    // Act
    const result = applyMove(cube, 'U');

    // Assert
    expect(result.U)
        .toEqual(['U6', 'U3', 'U0', 'U7', 'U4', 'U1', 'U8', 'U5', 'U2']);
    expect(result.F)
        .toEqual(['R0', 'R1', 'R2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8']);
    expect(result.L)
        .toEqual(['F0', 'F1', 'F2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8']);
    expect(result.B)
        .toEqual(['L0', 'L1', 'L2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8']);
    expect(result.R)
        .toEqual(['B0', 'B1', 'B2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']);
    expect(result.D).toEqual(cube.D);
  });
  // prettier-ignore
  it('shifts exact facelets and rotates D matrix clockwise on D turn', () => {
    // Arrange
    const cube = createIndexedCube();

    // Act
    const result = applyMove(cube, 'D');

    // Assert
    expect(result.D)
        .toEqual(['D6', 'D3', 'D0', 'D7', 'D4', 'D1', 'D8', 'D5', 'D2']);
    expect(result.R)
        .toEqual(['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'F6', 'F7', 'F8']);
    expect(result.B)
        .toEqual(['B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'R6', 'R7', 'R8']);
    expect(result.L)
        .toEqual(['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'B6', 'B7', 'B8']);
    expect(result.F)
        .toEqual(['F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'L6', 'L7', 'L8']);
    expect(result.U).toEqual(cube.U);
  });
  // prettier-ignore
  it('shifts exact facelets and rotates F matrix clockwise on F turn', () => {
    // Arrange
    const cube = createIndexedCube();

    // Act
    const result = applyMove(cube, 'F');

    // Assert
    expect(result.F)
        .toEqual(['F6', 'F3', 'F0', 'F7', 'F4', 'F1', 'F8', 'F5', 'F2']);
    expect(result.R)
        .toEqual(['U6', 'R1', 'R2', 'U7', 'R4', 'R5', 'U8', 'R7', 'R8']);
    expect(result.D)
        .toEqual(['R6', 'R3', 'R0', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8']);
    expect(result.L)
        .toEqual(['L0', 'L1', 'D0', 'L3', 'L4', 'D1', 'L6', 'L7', 'D2']);
    expect(result.U)
        .toEqual(['U0', 'U1', 'U2', 'U3', 'U4', 'U5', 'L8', 'L5', 'L2']);
    expect(result.B).toEqual(cube.B);
  });
  // prettier-ignore
  it('shifts exact facelets and rotates B matrix clockwise on B turn', () => {
    // Arrange
    const cube = createIndexedCube();

    // Act
    const result = applyMove(cube, 'B');

    // Assert
    expect(result.B)
        .toEqual(['B6', 'B3', 'B0', 'B7', 'B4', 'B1', 'B8', 'B5', 'B2']);
    expect(result.L)
        .toEqual(['U2', 'L1', 'L2', 'U1', 'L4', 'L5', 'U0', 'L7', 'L8']);
    expect(result.D)
        .toEqual(['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'L0', 'L3', 'L6']);
    expect(result.R)
        .toEqual(['R0', 'R1', 'D8', 'R3', 'R4', 'D7', 'R6', 'R7', 'D6']);
    expect(result.U)
        .toEqual(['R2', 'R5', 'R8', 'U3', 'U4', 'U5', 'U6', 'U7', 'U8']);
    expect(result.F).toEqual(cube.F);
  });
  // prettier-ignore
  it('shifts exact facelets and rotates R matrix clockwise on R turn', () => {
    // Arrange
    const cube = createIndexedCube();

    // Act
    const result = applyMove(cube, 'R');

    // Assert
    expect(result.R)
        .toEqual(['R6', 'R3', 'R0', 'R7', 'R4', 'R1', 'R8', 'R5', 'R2']);
    expect(result.U)
        .toEqual(['U0', 'U1', 'F2', 'U3', 'U4', 'F5', 'U6', 'U7', 'F8']);
    expect(result.B)
        .toEqual(['U8', 'B1', 'B2', 'U5', 'B4', 'B5', 'U2', 'B7', 'B8']);
    expect(result.D)
        .toEqual(['D0', 'D1', 'B6', 'D3', 'D4', 'B3', 'D6', 'D7', 'B0']);
    expect(result.F)
        .toEqual(['F0', 'F1', 'D2', 'F3', 'F4', 'D5', 'F6', 'F7', 'D8']);
    expect(result.L).toEqual(cube.L);
  });
  // prettier-ignore
  it('shifts exact facelets and rotates L matrix clockwise on L turn', () => {
    // Arrange
    const cube = createIndexedCube();

    // Act
    const result = applyMove(cube, 'L');

    // Assert
    expect(result.L)
        .toEqual(['L6', 'L3', 'L0', 'L7', 'L4', 'L1', 'L8', 'L5', 'L2']);
    expect(result.F)
        .toEqual(['U0', 'F1', 'F2', 'U3', 'F4', 'F5', 'U6', 'F7', 'F8']);
    expect(result.D)
        .toEqual(['F0', 'D1', 'D2', 'F3', 'D4', 'D5', 'F6', 'D7', 'D8']);
    expect(result.B)
        .toEqual(['B0', 'B1', 'D6', 'B3', 'B4', 'D3', 'B6', 'B7', 'D0']);
    expect(result.U)
        .toEqual(['B8', 'U1', 'U2', 'B5', 'U4', 'U5', 'B2', 'U7', 'U8']);
    expect(result.R).toEqual(cube.R);
  });
  it('returns cube to initial state after 4 identical basic turns', () => {
    // Arrange
    const cube = createIndexedCube();
    const turns = ['U', 'D', 'F', 'B', 'R', 'L'];

    // Act
    const results = turns.map((turn) =>
      Array(4).fill(turn).reduce(applyMove, cube),
    );

    // Assert
    for (const result of results) {
      expect(result).toEqual(cube);
    }
  });
  it('returns cube to initial state after 2 double turns (U2, R2)', () => {
    // Arrange
    const cube = createIndexedCube();

    // Act
    const afterU2 = Array(2).fill('U2').reduce(applyMove, cube);
    const afterR2 = Array(2).fill('R2').reduce(applyMove, cube);

    // Assert
    expect(afterU2).toEqual(cube);
    expect(afterR2).toEqual(cube);
  });
  it("returns cube to initial state after move and its inverse (R R')", () => {
    // Arrange
    const cube = createIndexedCube();

    // Act
    const result = Array.of<Move>('R', "R'").reduce(applyMove, cube);

    // Assert
    expect(result).toEqual(cube);
  });
  it("returns cube to initial state after 6 repetitions of sexy move (R U R' U')", () => {
    // Arrange
    const cube = createIndexedCube();
    const sexyMove: Move[] = ['R', 'U', "R'", "U'"];
    const sixRepetitions = Array<Move[]>(6).fill(sexyMove).flat();

    // Act
    const result = sixRepetitions.reduce(applyMove, cube);

    // Assert
    expect(result).toEqual(cube);
  });
  it('returns cube to initial state after 2 repetitions of a complex 6-face algorithm', () => {
    // Arrange
    const cube = createIndexedCube();
    const setup: Move[] = ['L', 'D', 'B'];
    // prettier-ignore
    const tPerm: Move[] = [
        'R', 'U', "R'","U'", "R'", 'F', 'R2',
        "U'", "R'", "U'", 'R', 'U', "R'", "F'",
    ];
    const undoSetup: Move[] = ["B'", "D'", "L'"];
    const conjugatedTPerm = [...setup, ...tPerm, ...undoSetup];
    const twoRepetitions = Array<Move[]>(2).fill(conjugatedTPerm).flat();

    // Act
    const result = twoRepetitions.reduce(applyMove, cube);

    // Assert
    expect(result).toEqual(cube);
  });
  it('returns cube to initial state after 4 identical whole-cube rotations', () => {
    // Arrange
    const cube = createIndexedCube();
    const rotations: Move[] = Array.of('x', 'y', 'z');

    // Act
    const results = rotations.map((rotation) =>
      Array<Move>(4).fill(rotation).reduce(applyMove, cube),
    );

    // Assert
    expect(results).toEqual(Array(rotations.length).fill(cube));
  });
  it('maintains consistency identities between rotations and face turns', () => {
    // Arrange
    const cube = createIndexedCube();
    const xU: Move[] = ['x', 'U'];
    const fX: Move[] = ['F', 'x'];
    const yF: Move[] = ['y', 'F'];
    const rY: Move[] = ['R', 'y'];
    const zU: Move[] = ['z', 'U'];
    const lZ: Move[] = ['L', 'z'];

    // Act
    const afterXU = xU.reduce(applyMove, cube);
    const afterFX = fX.reduce(applyMove, cube);

    const afterYF = yF.reduce(applyMove, cube);
    const afterRY = rY.reduce(applyMove, cube);

    const afterZU = zU.reduce(applyMove, cube);
    const afterLZ = lZ.reduce(applyMove, cube);

    // Assert
    expect(afterXU).toEqual(afterFX);
    expect(afterYF).toEqual(afterRY);
    expect(afterZU).toEqual(afterLZ);
  });
});
describe(applyMoves, () => {
  it('returns cube unchanged when move list is empty', () => {
    // Arrange
    const cube = createIndexedCube();

    // Act
    const result = applyMoves(cube, []);

    // Assert
    expect(result).toEqual(cube);
  });
  it('sequentially applies multiple moves to the cube state', () => {
    // Arrange
    const cube = createIndexedCube();
    const moves: Move[] = ['R', 'U', "R'", "U'"];
    const expected = moves.reduce(applyMove, cube);

    // Act
    const result = applyMoves(cube, moves);

    // Assert
    expect(result).toEqual(expected);
  });
});
