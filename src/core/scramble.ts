import { FACES, MOVE_MODIFIERS, type Face, type Turn } from '../types/cube';

// prettier-ignore
const OPPOSITE_FACES: Readonly<Record<Face, Face>> = {
  U: 'D', D: 'U', F: 'B', B: 'F', R: 'L', L: 'R'
};

function sample<T>(items: readonly T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

function pickNextFace(prev?: Face, prevPrev?: Face): Face {
  // Filter candidates so no reducible turn can be generated
  const candidates = FACES.filter(
    (face) =>
      face !== prev &&
      !(
        prev !== undefined &&
        face === prevPrev &&
        face === OPPOSITE_FACES[prev]
      ),
  );

  return sample(candidates);
}

export function generateScramble(length = 20): Turn[] {
  if (!Number.isInteger(length) || length < 0) {
    throw new RangeError(
      `Scramble length must be a non-negative integer, got: "${length}"`,
    );
  }

  const turns = Array<Turn>(length);
  let prev: Face | undefined;
  let prevPrev: Face | undefined;

  for (let i = 0; i < length; i++) {
    const face = pickNextFace(prev, prevPrev);
    turns[i] = `${face}${sample(MOVE_MODIFIERS)}`;
    prevPrev = prev;
    prev = face;
  }

  return turns;
}
