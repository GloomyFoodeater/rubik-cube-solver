import {
  DEFAULT_COLOR_SCHEME,
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
