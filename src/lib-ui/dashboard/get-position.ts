type GetPositionParams = {
  col: number
  row: number
  boundMinX: number
  boundMinY: number
  colGap: number
  rowGap: number
  cellWidth: number
  cellHeight: number
}

/**
 * Converts from grid position to px.
 * @param params
 * @returns
 */
function getPosition({
  col,
  row,
  boundMinX,
  boundMinY,
  colGap,
  rowGap,
  cellWidth,
  cellHeight,
}: GetPositionParams) {
  const top = boundMinY + cellHeight * row + rowGap * row
  const left = boundMinX + cellWidth * col + colGap * col

  return { top, left }
}

export default getPosition
