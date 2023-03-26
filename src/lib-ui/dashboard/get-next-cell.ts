function getNextCell(
  flow: DashboardFlow,
  colStart: number,
  rowStart: number,
  numCols: number,
  numRows: number
) {
  let nextRowStart = rowStart
  let nextColStart = colStart
  if (flow === 'row') {
    if (colStart < numCols - 1) {
      nextColStart++
    } else {
      nextColStart = 0
      nextRowStart++
    }
  } else {
    if (rowStart < numRows - 1) {
      nextRowStart++
    } else {
      nextRowStart = 0
      nextColStart++
    }
  }

  if (
    (flow === 'column' && nextColStart >= numCols) ||
    (flow === 'row' && nextRowStart >= numRows)
  ) {
    throw new Error('Grid is out of space.')
  }

  return { rowStart: nextRowStart, colStart: nextColStart }
}

export default getNextCell
