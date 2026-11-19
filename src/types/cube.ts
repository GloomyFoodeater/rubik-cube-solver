export type Color = 'W' | 'Y' | 'G' | 'B' | 'R' | 'O';
export type Face = 'U' | 'D' | 'F' | 'B' | 'R' | 'L';
export type MoveModifier = '' | "'" | '2';
export type Move = `${Face}${MoveModifier}`;
export type RotationAxis = 'x' | 'y' | 'z';
export type Rotation = `${RotationAxis}${MoveModifier}`;
export type CubeAction = Move | Rotation;
