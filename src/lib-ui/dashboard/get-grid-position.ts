function getGridPosition(
  x: number,
  y: number,
  gridStartX: number,
  gridStartY: number,
  cellWidth: number,
  cellHeight: number
) {
  const col = Math.floor((x - gridStartX + cellWidth / 2) / cellWidth)
  const row = Math.floor((y - gridStartY + cellHeight / 2) / cellHeight)

  return { col, row }
}

export default getGridPosition
