import {
  DEFAULT_COLOR_SCHEME,
  FACES,
  type Color,
  type CubeState,
} from '../types/cube';

export function createSolvedCube(): CubeState {
  return {
    U: Array<Color>(9).fill(DEFAULT_COLOR_SCHEME.U),
    D: Array<Color>(9).fill(DEFAULT_COLOR_SCHEME.D),
    F: Array<Color>(9).fill(DEFAULT_COLOR_SCHEME.F),
    B: Array<Color>(9).fill(DEFAULT_COLOR_SCHEME.B),
    R: Array<Color>(9).fill(DEFAULT_COLOR_SCHEME.R),
    L: Array<Color>(9).fill(DEFAULT_COLOR_SCHEME.L),
  };
}

const FACE_CENTER_INDEX = 4;
export function isSolved(cube: CubeState): boolean {
  for (const face of FACES) {
    const faceStickers = cube[face];
    const color = faceStickers[FACE_CENTER_INDEX];

    for (const facelet of faceStickers) {
      if (facelet !== color) {
        return false;
      }
    }
  }
  return true;
}
