import getPosition from './get-position'

type GetGridPositionParams = {
  x: number
  y: number
  boundMinX: number
  boundMinY: number
  colGap: number
  rowGap: number
  cellWidth: number
  cellHeight: number
  absoluteCellWidth: number
  absoluteCellHeight: number
}

/**
 * Converts from client [x, y] coordinates to grid position
 * @param params
 * @returns
 */
function getGridPosition({
  x,
  y,
  boundMinX,
  boundMinY,
  colGap,
  rowGap,
  cellWidth,
  cellHeight,
  absoluteCellHeight,
  absoluteCellWidth,
}: GetGridPositionParams) {
  // Use a grid cell without gap to find position in grid.
  const col = Math.floor((x - boundMinX + absoluteCellWidth / 2) / cellWidth)
  const row = Math.floor((y - boundMinY + absoluteCellHeight / 2) / cellHeight)

  const { top, left } = getPosition({
    boundMinX,
    boundMinY,
    cellHeight,
    cellWidth,
    col,
    colGap,
    row,
    rowGap,
  })

  return { col, row, top, left }
}

export default getGridPosition
