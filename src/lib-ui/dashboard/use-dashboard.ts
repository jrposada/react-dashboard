import { useCallback, useRef } from 'react'
import clamp from '../math/clamp'
import getGridPosition from './get-grid-position'
import updatePositions from './update-positions'

interface DashboardRefreshParams {
  container: HTMLDivElement | null
  rows: number
  cols: number
  flow?: DashboardFlow
}

interface DashboardSetPreviewParams {
  preview: HTMLDivElement | null
}

interface DashboardParams {
  previewId: string
}

function useDashboard({ previewId }: DashboardParams) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const previewRef = useRef<HTMLDivElement | null>(null)

  const refresh = useCallback(({ container, rows, cols, flow = 'row' }: DashboardRefreshParams) => {
    // Validate arguments.
    if (container === null) return
    if (rows === 0 || cols === 0) throw new Error(`Rows and columns can't be 0`)
    containerRef.current = container

    // Calculate initial position and size of each element.
    const {
      x: boundMinX,
      y: boundMinY,
      width: boundWidth,
      height: boundHeight,
    } = container.getBoundingClientRect()
    const boundMaxX = boundMinX + boundWidth
    const boundMaxY = boundMinY + boundHeight
    const cellWidth = boundWidth / cols
    const cellHeight = boundHeight / rows

    updatePositions(
      { items: [] },
      container,
      cols,
      rows,
      boundMinX,
      boundMinY,
      cellWidth,
      cellHeight,
      previewId,
      flow
    )

    // Hook move events.
    for (let index = 0; index < container.children.length; index++) {
      const child = container.children[index] as HTMLElement
      if (child.id === previewId) continue

      const rowSpan = Number(child.dataset.rowspan)
      const colSpan = Number(child.dataset.colspan)
      const previewLastGridPosition = { col: 0, row: 0 }
      const touchMovement = { x: 0, y: 0, initialized: false }

      const stopEvent = (event: Event) => {
        event.stopPropagation()
        event.preventDefault()
      }

      const onMove = (movement: { y: number; x: number }) => {
        const { x, y, width, height } = child.getBoundingClientRect()
        const { col, row } = getGridPosition(x, y, boundMinX, boundMinY, cellWidth, cellHeight)

        // Only update positions and preview if it has moved.
        if (previewLastGridPosition.col !== col || previewLastGridPosition.row !== row) {
          previewLastGridPosition.col = col
          previewLastGridPosition.row = row

          // Move preview to final position
          if (previewRef.current) {
            previewRef.current.style.top = `${boundMinY + cellHeight * row}px`
            previewRef.current.style.left = `${boundMinX + cellWidth * col}px`
            // Add top and left transitions while moving
            previewRef.current.style.transition =
              'opacity 300ms ease-out, top 300ms ease-out, left 300ms ease-out'
          }

          // Move rest of elements to make space according to preview position.
          updatePositions(
            { items: [{ id: previewId, colSpan, colStart: col, rowSpan, rowStart: row }] },
            container,
            cols,
            rows,
            boundMinX,
            boundMinY,
            cellWidth,
            cellHeight,
            previewId,
            flow
          )
        }

        // Move child by mouse movement.
        child.style.top = `${clamp(y + movement.y, boundMinY, boundMaxY - height)}px`
        child.style.left = `${clamp(x + movement.x, boundMinX, boundMaxX - width)}px`
      }

      const onStop = () => {
        // Hide preview
        if (previewRef.current) {
          previewRef.current.style.opacity = '0'
        }

        // Stick to grid.
        const { x, y } = child.getBoundingClientRect()
        // Offset calculations by cell / 2 so that it sticks to the closer cell.
        const { col, row } = getGridPosition(x, y, boundMinX, boundMinY, cellWidth, cellHeight)

        child.style.top = `${boundMinY + cellHeight * row}px`
        child.style.left = `${boundMinX + cellWidth * col}px`
      }

      const onStart = () => {
        const { x, y, width, height } = child.getBoundingClientRect()

        // Show preview
        if (previewRef.current) {
          const { col, row } = getGridPosition(x, y, boundMinX, boundMinY, cellWidth, cellHeight)
          previewLastGridPosition.col = col
          previewLastGridPosition.row = row

          previewRef.current.style.opacity = '1'
          previewRef.current.style.width = `${width}px`
          previewRef.current.style.height = `${height}px`
          previewRef.current.style.top = `${boundMinY + cellHeight * row}px`
          previewRef.current.style.left = `${boundMinX + cellWidth * col}px`
          // Set opacity transition.
          previewRef.current.style.transition = 'opacity 300ms ease-out'
        }
      }

      const onMouseMove = (event: MouseEvent) => {
        stopEvent(event)
        onMove({ x: event.movementX, y: event.movementY })
      }

      const onTouchMove = (event: TouchEvent) => {
        if (event.touches.length !== 1) return

        stopEvent(event)
        const touch = event.touches.item(0)!

        if (touchMovement.initialized) {
          onMove({ x: touch.screenX - touchMovement.x, y: touch.screenY - touchMovement.y })
        }

        touchMovement.initialized = true
        touchMovement.x = touch.screenX
        touchMovement.y = touch.screenY
      }

      const onMouseUp = (_event: MouseEvent) => {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)

        onStop()
      }

      const onTouchEnd = (_event: TouchEvent) => {
        document.removeEventListener('touchmove', onTouchMove)
        document.removeEventListener('touchend', onTouchEnd)

        onStop()
      }

      const onMouseDown = (event: MouseEvent) => {
        stopEvent(event)
        onStart()

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
      }

      const onTouchStart = (event: Event) => {
        stopEvent(event)
        touchMovement.initialized = false
        onStart()

        document.addEventListener('touchmove', onTouchMove)
        document.addEventListener('touchend', onTouchEnd)
      }

      child.addEventListener('mousedown', onMouseDown)
      child.addEventListener('ontouchstart', onTouchStart)
    }
  }, [])

  const setPreview = useCallback(({ preview }: DashboardSetPreviewParams) => {
    previewRef.current = preview
    if (preview === null) return

    preview.style.position = 'absolute'
  }, [])

  return { refresh, setPreview }
}

export default useDashboard
export type { DashboardRefreshParams }
