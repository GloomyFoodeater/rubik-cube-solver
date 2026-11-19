import {
  FACES,
  type CubeState,
  type Face,
  type FaceStickers,
  type Move,
  type Rotation,
  type RotationAxis,
  type Turn,
} from '../types/cube';

type AdjacentStrip = readonly [Face, readonly [number, number, number]];
type AdjacentCycle = readonly [
  AdjacentStrip,
  AdjacentStrip,
  AdjacentStrip,
  AdjacentStrip,
];

/**
 * Indices of facelets on a face before CW rotation.
 *
 * Was:          --->    After CW:
 *
 * 0 | 1 | 2     --->   6 | 3 | 0
 *
 * 3 | 4 | 5     --->   7 | 4 | 1
 *
 * 6 | 7 | 8     --->   8 | 5 | 2
 */
const CW_FACE_INDICES = [6, 3, 0, 7, 4, 1, 8, 5, 2];

/**
 * Lookup table mapping each face (same-name CW move) to the 12 adjacent
 * facelets (4 strips of 3) that shift when turning that face 90 deg CW.
 *
 * Strips are listed in clockwise order.
 *
 * It is an array for ordering, so 'R', 'F', 'L', 'B' should not be keys
 * in map/record/dictionary/object.
 *
 * E.g., for U: R->F->L->B->R
 *
 * Tuple contains source indices.
 * E.g., for F: D_210 -> L_852.
 */
const CW_ADJACENT_CYCLES: Readonly<Record<Face, AdjacentCycle>> = {
  U: [
    ['R', [0, 1, 2]],
    ['F', [0, 1, 2]],
    ['L', [0, 1, 2]],
    ['B', [0, 1, 2]],
  ],
  D: [
    ['F', [6, 7, 8]],
    ['R', [6, 7, 8]],
    ['B', [6, 7, 8]],
    ['L', [6, 7, 8]],
  ],
  F: [
    ['U', [6, 7, 8]],
    ['R', [0, 3, 6]],
    ['D', [2, 1, 0]],
    ['L', [8, 5, 2]],
  ],
  B: [
    ['U', [2, 1, 0]],
    ['L', [0, 3, 6]],
    ['D', [6, 7, 8]],
    ['R', [8, 5, 2]],
  ],
  R: [
    ['F', [2, 5, 8]],
    ['U', [2, 5, 8]],
    ['B', [6, 3, 0]],
    ['D', [2, 5, 8]],
  ],
  L: [
    ['U', [0, 3, 6]],
    ['F', [0, 3, 6]],
    ['D', [0, 3, 6]],
    ['B', [8, 5, 2]],
  ],
};

/**
 * Provides the number of CW moves needed to perform a move
 * (CCW and double moves are achieved by repeating CW moves).
 *
 * This approach slightly slows down the operation, which is acceptable since
 * applyMove is only used for simulation (bottlenecked by frame rate),
 * not the solver.
 */
const CW_MOVES_BY_MODIFIER: Readonly<Record<string, number>> = {
  '': 1,
  '2': 2,
  "'": 3,
};

const FACE_SET: ReadonlySet<string> = new Set(FACES);

function rotateMatrixCW(face: FaceStickers): FaceStickers {
  return CW_FACE_INDICES.map((index) => face[index]);
}

function rotateMatrix180(face: FaceStickers): FaceStickers {
  return rotateMatrixCW(rotateMatrixCW(face));
}

function rotateMatrixCCW(face: FaceStickers): FaceStickers {
  return rotateMatrixCW(rotateMatrix180(face));
}

function turnFaceCW(cube: CubeState, face: Face): CubeState {
  const rotatedFace = rotateMatrixCW(cube[face]);

  const cycle = CW_ADJACENT_CYCLES[face];

  const updatedFaces = Object.fromEntries(
    cycle.map(([currFace, currIndices], currFaceIdx) => {
      // Get source face to get colors from (previous in cycle array)
      const prevFaceIdx = (currFaceIdx + cycle.length - 1) % cycle.length;
      const [prevFace, prevIndices] = cycle[prevFaceIdx];

      // Update 3 facelets of a current face
      const updatedFacelets = [...cube[currFace]];
      currIndices.forEach((currFaceletIdx, prevFaceletIdx) => {
        updatedFacelets[currFaceletIdx] =
          cube[prevFace][prevIndices[prevFaceletIdx]];
      });

      return [currFace, updatedFacelets];
    }),
  );

  return {
    ...cube,
    ...updatedFaces,
    [face]: rotatedFace,
  };
}

/**
 * Applies given turn to the current cube state.
 *
 * CCW and double turns are treated as repetition of CW turn.
 */
function applyTurn(cube: CubeState, turn: Turn): CubeState {
  const [rawFace = '', rawModifier = ''] = turn;
  const face = rawFace as Face;
  const turnCount = CW_MOVES_BY_MODIFIER[rawModifier];

  return Array.from({ length: turnCount }).reduce<CubeState>(
    (curr) => turnFaceCW(curr, face),
    cube,
  );
}

/**
 * Rotates the entire cube 90 degrees clockwise around the given axis.
 */
function rotateCubeCW(cube: CubeState, axis: RotationAxis): CubeState {
  switch (axis) {
    case 'x':
      return {
        U: cube.F,
        D: rotateMatrix180(cube.B),
        F: cube.D,
        B: rotateMatrix180(cube.U),
        R: rotateMatrixCW(cube.R),
        L: rotateMatrixCCW(cube.L),
      };
    case 'y':
      return {
        U: rotateMatrixCW(cube.U),
        D: rotateMatrixCCW(cube.D),
        F: cube.R,
        B: cube.L,
        R: cube.B,
        L: cube.F,
      };
    case 'z':
      return {
        U: rotateMatrixCW(cube.L),
        D: rotateMatrixCW(cube.R),
        F: rotateMatrixCW(cube.F),
        B: rotateMatrixCCW(cube.B),
        R: rotateMatrixCW(cube.U),
        L: rotateMatrixCW(cube.D),
      };
  }
}

/**
 * Applies a single whole-cube rotation to the cube state.
 *
 * CCW and double rotations are treated as repetiotion of CW rotation.
 */
function applyRotation(cube: CubeState, rotation: Rotation): CubeState {
  const [rawAxis = '', rawModifier = ''] = rotation;
  const axis = rawAxis as RotationAxis;
  const rotationCount = CW_MOVES_BY_MODIFIER[rawModifier];

  return Array.from({ length: rotationCount }).reduce<CubeState>(
    (curr) => rotateCubeCW(curr, axis),
    cube,
  );
}

function isTurn(move: Move): move is Turn {
  return FACE_SET.has(move.charAt(0));
}

export function applyMove(cube: CubeState, move: Move): CubeState {
  return isTurn(move) ? applyTurn(cube, move) : applyRotation(cube, move);
}
