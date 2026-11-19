import { DEFAULT_COLOR_SCHEME, type CubeState } from '../types/cube';

export function createSolvedCube(): CubeState {
  return {
    U: Array(9).fill(DEFAULT_COLOR_SCHEME.U),
    D: Array(9).fill(DEFAULT_COLOR_SCHEME.D),
    F: Array(9).fill(DEFAULT_COLOR_SCHEME.F),
    B: Array(9).fill(DEFAULT_COLOR_SCHEME.B),
    R: Array(9).fill(DEFAULT_COLOR_SCHEME.R),
    L: Array(9).fill(DEFAULT_COLOR_SCHEME.L),
  };
}
