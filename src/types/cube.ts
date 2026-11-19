export type Color = 'W' | 'Y' | 'G' | 'B' | 'R' | 'O';
export const FACES = ['U', 'D', 'F', 'B', 'R', 'L'] as const;
export type Face = (typeof FACES)[number];
export type MoveModifier = '' | "'" | '2';
export type Turn = `${Face}${MoveModifier}`;
export type RotationAxis = 'x' | 'y' | 'z';
export type Rotation = `${RotationAxis}${MoveModifier}`;
export type Move = Turn | Rotation;

export type FaceStickers = readonly Color[];

/**
 * Facelet model.
 *
 * Fixed-size array of facelets.
 *
 * Indexing:
 *
 * 0 | 1 | 2
 *
 * 3 | 4 | 5  (4 — unmoving fixed center of the face)
 *
 * 6 | 7 | 8
 */
export type CubeState = Readonly<Record<Face, FaceStickers>>;

/**
 * Default Western (BOY) color scheme.
 * @see https://www.speedsolving.com/wiki/index.php/Western_Color_Scheme
 */
export const DEFAULT_COLOR_SCHEME = {
  U: 'W',
  D: 'Y',
  F: 'G',
  B: 'B',
  R: 'R',
  L: 'O',
} satisfies Record<Face, Color>;
