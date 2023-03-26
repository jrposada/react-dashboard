import { v4 as uuid } from 'uuid'
import getCollision from './get-collision'
import getNextCell from './get-next-cell'

function updatePositions(
  state: DashboardState,
  container: HTMLDivElement,
  cols: number,
  rows: number,
  boundMinX: number,
  boundMinY: number,
  cellWidth: number,
  cellHeight: number,
  previewId: string,
  flow: DashboardFlow
) {
  let colStart = 0
  let rowStart = 0
  for (let index = 0; index < container.children.length; index++) {
    const child = container.children[index] as HTMLElement
    if (child.id === previewId) continue
    if (!child.id) child.id = uuid()

    const rowSpan = Number(child.dataset.rowspan)
    const colSpan = Number(child.dataset.colspan)
    const width = cellWidth * colSpan
    const height = cellHeight * rowSpan

    // Position element in the grid.
    child.style.position = 'absolute'
    while (
      getCollision({ state, colStart, rowStart, numCols: cols, numRows: rows, colSpan, rowSpan })
    ) {
      const nextCell = getNextCell(flow, colStart, rowStart, cols, rows)
      colStart = nextCell.colStart
      rowStart = nextCell.rowStart
    }

    child.style.top = `${boundMinY + cellHeight * rowStart}px`
    child.style.left = `${boundMinX + cellWidth * colStart}px`
    child.style.width = `${width}px`
    child.style.height = `${height}px`

    state.items.push({ colSpan, colStart, id: child.id, rowSpan, rowStart })
    colStart = 0
    rowStart = 0
  }
}

export default updatePositions
