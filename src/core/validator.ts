import {
  COLORS,
  FACES,
  type Color,
  type CubeState,
  type Face,
} from '../types/cube';

type FaceletCoord = readonly [Face, number];
type CornerCoords = readonly [FaceletCoord, FaceletCoord, FaceletCoord];
type EdgeCoords = readonly [FaceletCoord, FaceletCoord];

const FACE_STICKERS_COUNT = 9;
const FACE_CENTER_INDEX = 4;
const VALID_COLORS: ReadonlySet<Color> = new Set(COLORS);
// prettier-ignore
// 0 -> U/D sticker, 1 -> CW, 2 -> CW
const CORNER_SLOTS: readonly CornerCoords[] = [
  [['U', 8], ['R', 0], ['F', 2]], // UFR
  [['U', 6], ['F', 0], ['L', 2]], // UFL
  [['U', 0], ['L', 0], ['B', 2]], // UBL
  [['U', 2], ['B', 0], ['R', 2]], // UBR
  [['D', 2], ['F', 8], ['R', 6]], // DFR
  [['D', 0], ['L', 8], ['F', 6]], // DFL
  [['D', 6], ['B', 8], ['L', 6]], // DBL
  [['D', 8], ['R', 8], ['B', 6]], // DBR
];

// prettier-ignore
// 0 -> primary axis (U/D for top/bottom layers, F/B for equator),
// 1 -> secondary
const EDGE_SLOTS: readonly EdgeCoords[] = [
  [['U', 7], ['F', 1]], // UF
  [['U', 5], ['R', 1]], // UR
  [['U', 1], ['B', 1]], // UB
  [['U', 3], ['L', 1]], // UL
  [['D', 1], ['F', 7]], // DF
  [['D', 5], ['R', 7]], // DR
  [['D', 7], ['B', 7]], // DB
  [['D', 3], ['L', 7]], // DL
  [['F', 5], ['R', 3]], // FR
  [['F', 3], ['L', 5]], // FL
  [['B', 5], ['L', 3]], // BL
  [['B', 3], ['R', 5]], // BR
];

function hasValidStickerCounts(cube: CubeState): boolean {
  // prettier-ignore
  const counts: Record<Color, number> = { W: 0, Y: 0, G: 0, B: 0, R: 0, O: 0 };

  for (const face of FACES) {
    const stickers = cube[face];
    if (stickers.length !== FACE_STICKERS_COUNT) {
      return false;
    }

    for (const sticker of stickers) {
      if (!VALID_COLORS.has(sticker)) {
        return false;
      }
      counts[sticker] += 1;
    }
  }

  return Object.values(counts).every((count) => count === FACE_STICKERS_COUNT);
}

function hasUniqueCenters(cube: CubeState): boolean {
  const centers = new Set(FACES.map((face) => cube[face][FACE_CENTER_INDEX]));

  return centers.size === FACES.length;
}

function getCubieId(colors: readonly Color[]): string {
  return [...colors].sort().join('');
}

function hasValidCubies<T extends readonly FaceletCoord[]>(
  cube: CubeState,
  slots: readonly T[],
): boolean {
  const expectedIds = new Set(
    slots.map((slot) =>
      getCubieId(slot.map(([face]) => cube[face][FACE_CENTER_INDEX])),
    ),
  );

  const actualIds = new Set(
    slots.map((slot) =>
      getCubieId(slot.map(([face, index]) => cube[face][index])),
    ),
  );

  return (
    actualIds.size === slots.length &&
    Array.from(actualIds).every((id) => expectedIds.has(id))
  );
}

function hasValidCornerOrientation(cube: CubeState): boolean {
  const uColor = cube.U[FACE_CENTER_INDEX];
  const dColor = cube.D[FACE_CENTER_INDEX];

  let orientationSum = 0;

  for (const slot of CORNER_SLOTS) {
    const orientation = slot.findIndex(([face, index]) => {
      const color = cube[face][index];
      return color === uColor || color === dColor;
    });

    if (orientation === -1) {
      return false;
    }

    orientationSum += orientation;
  }

  return orientationSum % 3 === 0;
}

function hasValidEdgeOrientation(cube: CubeState): boolean {
  const uColor = cube.U[FACE_CENTER_INDEX];
  const dColor = cube.D[FACE_CENTER_INDEX];
  const fColor = cube.F[FACE_CENTER_INDEX];
  const bColor = cube.B[FACE_CENTER_INDEX];

  let orientationSum = 0;

  for (const [primary, secondary] of EDGE_SLOTS) {
    const primarySticker = cube[primary[0]][primary[1]];
    const secondarySticker = cube[secondary[0]][secondary[1]];

    const hasUD =
      primarySticker === uColor ||
      primarySticker === dColor ||
      secondarySticker === uColor ||
      secondarySticker === dColor;

    const isFlipped = hasUD
      ? secondarySticker === uColor || secondarySticker === dColor
      : secondarySticker === fColor || secondarySticker === bColor;

    if (isFlipped) {
      orientationSum += 1;
    }
  }

  return orientationSum % 2 === 0;
}

function countInversions(permutation: readonly number[]): number {
  let inversions = 0;

  for (let i = 0; i < permutation.length; i++) {
    for (let j = i + 1; j < permutation.length; j++) {
      if (permutation[i] > permutation[j]) {
        inversions += 1;
      }
    }
  }

  return inversions;
}

function getSlotPermutation<T extends readonly FaceletCoord[]>(
  cube: CubeState,
  slots: readonly T[],
): number[] {
  const homeIndexById = new Map<string, number>(
    slots.map((slot, index) => [
      getCubieId(slot.map(([face]) => cube[face][FACE_CENTER_INDEX])),
      index,
    ]),
  );

  return slots.map((slot) => {
    const id = getCubieId(slot.map(([face, index]) => cube[face][index]));
    return homeIndexById.get(id) ?? -1;
  });
}

function hasValidPermutationParity(cube: CubeState): boolean {
  const cornerPermutation = getSlotPermutation(cube, CORNER_SLOTS);
  const edgePermutation = getSlotPermutation(cube, EDGE_SLOTS);

  if (cornerPermutation.includes(-1) || edgePermutation.includes(-1)) {
    return false;
  }

  const cornerParity = countInversions(cornerPermutation) % 2;
  const edgeParity = countInversions(edgePermutation) % 2;

  return cornerParity === edgeParity;
}

export function isValidCubeState(cube: CubeState): boolean {
  return (
    hasValidStickerCounts(cube) &&
    hasUniqueCenters(cube) &&
    hasValidCubies(cube, CORNER_SLOTS) &&
    hasValidCubies(cube, EDGE_SLOTS) &&
    hasValidCornerOrientation(cube) &&
    hasValidEdgeOrientation(cube) &&
    hasValidPermutationParity(cube)
  );
}
