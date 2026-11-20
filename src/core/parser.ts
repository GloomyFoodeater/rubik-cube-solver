import {
  FACES,
  MOVE_MODIFIERS,
  ROTATION_AXES,
  type Move,
  type MoveModifier,
} from '../types/cube';

const VALID_TARGETS: ReadonlySet<string> = new Set([
  ...FACES,
  ...ROTATION_AXES,
]);
const VALID_MODIFIERS: ReadonlySet<string> = new Set<MoveModifier>(
  MOVE_MODIFIERS,
);

function isValidMove(token: string): token is Move {
  if (token.length === 0 || token.length > 2) {
    return false;
  }

  const [target = '', modifier = ''] = token;
  return VALID_TARGETS.has(target) && VALID_MODIFIERS.has(modifier);
}

export function parseMoves(sequence: string): Move[] {
  const trimmed = sequence.trim();
  if (!trimmed) {
    return [];
  }
  return trimmed.split(/\s+/).map((token) => {
    if (!isValidMove(token)) {
      throw new SyntaxError(`Invalid token "${token}" during move parsing.`);
    }
    return token;
  });
}
