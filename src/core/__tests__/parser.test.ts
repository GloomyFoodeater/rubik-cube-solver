import { describe, expect, it } from 'vitest';
import { parseMoves } from '../parser';

describe(parseMoves, () => {
  it('parses valid string with all types of moves', () => {
    // Arrange
    const sequence = "x R' U B' D2 R U' F' L2 R2 z' y2";
    const expected = [
      'x',
      "R'",
      'U',
      "B'",
      'D2',
      'R',
      "U'",
      "F'",
      'L2',
      'R2',
      "z'",
      'y2',
    ];

    // Act
    const result = parseMoves(sequence);

    // Assert
    expect(result).toEqual(expected);
  });
  it('normalizes extra spaces, tabs and line breaks', () => {
    // Arrange
    const messySequence = "     x R' U\tB' D2 R U'\t \tF' L2\nR2 z'\n\r\n\t";
    const expected = [
      'x',
      "R'",
      'U',
      "B'",
      'D2',
      'R',
      "U'",
      "F'",
      'L2',
      'R2',
      "z'",
    ];

    // Act
    const result = parseMoves(messySequence);

    // Assert
    expect(result).toEqual(expected);
  });
  it('returns empty arrays for whitespace-only and empty strings', () => {
    // Arrange
    const whitespaceSequence = '     \n\r\n\t';
    const emptySequence = '';

    // Act
    const whiteSpaceResult = parseMoves(whitespaceSequence);
    const emptyResult = parseMoves(emptySequence);

    // Assert
    expect(whiteSpaceResult).toEqual([]);
    expect(emptyResult).toEqual([]);
  });
  it('throws a SyntaxError when sequence contains invalid tokens', () => {
    // Arrange
    const invalidSequences = [
      'R U K F', // unknown face/axis
      "R U2' F", // invalid modifier combination (length > 2)
      'R u F', // lowercase wide move not supported
      'R U3 F', // invalid modifier number
      'RU', // missing space between moves
    ];

    // Act & Assert
    for (const sequence of invalidSequences) {
      expect(() => parseMoves(sequence)).toThrow(SyntaxError);
    }
  });
});
