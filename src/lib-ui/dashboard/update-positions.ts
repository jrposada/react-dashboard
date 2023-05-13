import { v4 as uuid } from 'uuid'
import getCollision from './get-collision'
import getNextCell from './get-next-cell'
import getPosition from './get-position'

type UpdatePositionsParams = {
  state: DashboardState
  container: HTMLDivElement
  cols: number
  rows: number
  colGap: number
  rowGap: number
  boundMinX: number
  boundMinY: number
  cellWidth: number
  cellHeight: number
  previewId: string
  flow: DashboardFlow
}

function updatePositions({
  state,
  container,
  cols,
  rows,
  colGap,
  rowGap,
  boundMinX,
  boundMinY,
  cellWidth,
  cellHeight,
  previewId,
  flow,
}: UpdatePositionsParams) {
  let colStart = 0
  let rowStart = 0
  for (let index = 0; index < container.children.length; index++) {
    const child = container.children[index] as HTMLElement
    if (child.id === previewId) continue
    if (!child.id) child.id = uuid()

    const rowSpan = Number(child.dataset.rowspan)
    const colSpan = Number(child.dataset.colspan)
    const width = cellWidth * colSpan + colGap * (colSpan - 1)
    const height = cellHeight * rowSpan + rowGap * (rowSpan - 1)

    // Position element in the grid.
    while (
      getCollision({ state, colStart, rowStart, numCols: cols, numRows: rows, colSpan, rowSpan })
    ) {
      const nextCell = getNextCell(flow, colStart, rowStart, cols, rows)
      colStart = nextCell.colStart
      rowStart = nextCell.rowStart
    }

    const { left, top } = getPosition({
      boundMinX,
      boundMinY,
      cellHeight,
      cellWidth,
      col: colStart,
      colGap,
      row: rowStart,
      rowGap,
    })

    child.style.position = 'absolute'
    child.style.top = `${top}px`
    child.style.left = `${left}px`
    child.style.width = `${width}px`
    child.style.height = `${height}px`

    state.items.push({ colSpan, colStart, id: child.id, rowSpan, rowStart })
    colStart = 0
    rowStart = 0
  }
}

export default updatePositions
