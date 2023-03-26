import inRange from '../math/in-range'

interface CollisionParams {
  state: DashboardState
  colStart: number
  rowStart: number
  numCols: number
  numRows: number
  colSpan: number
  rowSpan: number
}

/**
 * Given a grid state, returns whether a new element would collide with current
 * elements or not.
 * @param params
 * @returns Whether the new element collides or not.
 */
function getCollision({
  state,
  colStart,
  rowStart,
  numCols,
  numRows,
  colSpan,
  rowSpan,
}: CollisionParams) {
  // If it does not fit return collision immediately.
  if (colStart + colSpan > numCols || rowStart + rowSpan > numRows) return true

  return state.items.some(
    (item) =>
      // There is a collision if start or start + span is between item start and item start + item span,
      // for both column and row at the same time(
      (inRange(colStart, item.colStart, item.colStart + item.colSpan - 1) &&
        inRange(rowStart, item.rowStart, item.rowStart + item.rowSpan - 1)) ||
      (inRange(colStart + colSpan - 1, item.colStart, item.colStart + item.colSpan - 1) &&
        inRange(rowStart + rowSpan - 1, item.rowStart, item.rowStart + item.rowSpan - 1))
  )
}

export default getCollision
