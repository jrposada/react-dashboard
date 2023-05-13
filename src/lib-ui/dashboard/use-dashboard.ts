import { useCallback, useRef } from 'react'
import clamp from '../math/clamp'
import getGridPosition from './get-grid-position'
import updatePositions from './update-positions'

type Movement = {
  x: number
  y: number
}

interface DashboardRefreshParams {
  container: HTMLDivElement | null
  rows: number
  cols: number
  rowGap?: number
  colGap?: number
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

  const refresh = useCallback(
    ({ container, rows, cols, flow = 'row', colGap = 0, rowGap = 0 }: DashboardRefreshParams) => {
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
      const absoluteCellWidth = boundWidth / cols
      const absoluteCellHeight = boundHeight / rows
      const cellWidth = (boundWidth - colGap * (cols - 1)) / cols
      const cellHeight = (boundHeight - rowGap * (rows - 1)) / rows

      updatePositions({
        state: { items: [] },
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
      })

      // Hook move events.
      for (let index = 0; index < container.children.length; index++) {
        const child = container.children[index] as HTMLElement
        if (child.id === previewId) continue

        const rowSpan = Number(child.dataset.rowspan)
        const colSpan = Number(child.dataset.colspan)
        const previewLastGridPosition = { top: 0, left: 0 }
        const initialZIndex = child.style.zIndex

        const stopEvent = (event: Event) => {
          event.stopPropagation()
          event.preventDefault()
        }

        const onStart = () => {
          const { x, y, width, height } = child.getBoundingClientRect()
          child.style.zIndex = '1001'

          // Show preview
          if (previewRef.current) {
            const { top, left } = getGridPosition({
              x,
              y,
              boundMinX,
              boundMinY,
              colGap,
              rowGap,
              cellWidth,
              cellHeight,
              absoluteCellWidth,
              absoluteCellHeight,
            })
            previewLastGridPosition.top = top
            previewLastGridPosition.left = left

            previewRef.current.style.opacity = '1'
            previewRef.current.style.width = `${width}px`
            previewRef.current.style.height = `${height}px`
            previewRef.current.style.top = `${top}px`
            previewRef.current.style.left = `${left}px`
            // Set opacity transition.
            previewRef.current.style.transition = 'opacity 300ms ease-out'
          }
        }

        const onMove = (movement: Movement) => {
          const { x, y, width, height } = child.getBoundingClientRect()
          const { top, left, col, row } = getGridPosition({
            x,
            y,
            boundMinX,
            boundMinY,
            colGap,
            rowGap,
            cellWidth,
            cellHeight,
            absoluteCellWidth,
            absoluteCellHeight,
          })

          // Only update positions and preview if it has moved.
          if (previewLastGridPosition.top !== top || previewLastGridPosition.left !== left) {
            previewLastGridPosition.top = top
            previewLastGridPosition.left = left

            // Move preview to final position
            if (previewRef.current) {
              previewRef.current.style.top = `${top}px`
              previewRef.current.style.left = `${left}px`
              // Add top and left transitions while moving
              previewRef.current.style.transition =
                'opacity 300ms ease-out, top 300ms ease-out, left 300ms ease-out'
            }

            // Move rest of elements to make space according to preview position.
            updatePositions({
              state: { items: [{ id: previewId, colSpan, colStart: col, rowSpan, rowStart: row }] },
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
            })
          }

          // Move child by mouse movement.
          child.style.top = `${clamp(y + movement.y, boundMinY, boundMaxY - height)}px`
          child.style.left = `${clamp(x + movement.x, boundMinX, boundMaxX - width)}px`
        }

        const onEnd = () => {
          child.style.zIndex = initialZIndex

          // Hide preview
          if (previewRef.current) {
            previewRef.current.style.opacity = '0'
          }

          // Stick to grid.
          const { x, y } = child.getBoundingClientRect()
          // Offset calculations by cell / 2 so that it sticks to the closer cell.
          const { top, left } = getGridPosition({
            x,
            y,
            boundMinX,
            boundMinY,
            colGap,
            rowGap,
            cellWidth,
            cellHeight,
            absoluteCellWidth,
            absoluteCellHeight,
          })

          child.style.top = `${top}px`
          child.style.left = `${left}px`
        }

        // Mouse support
        const onMouseMove = (event: MouseEvent) => {
          stopEvent(event)

          onMove({ x: event.movementX, y: event.movementY })
        }

        const onMouseUp = (event: MouseEvent) => {
          stopEvent(event)

          document.removeEventListener('mousemove', onMouseMove)
          document.removeEventListener('mouseup', onMouseUp)

          onEnd()
        }

        child.addEventListener('mousedown', (event) => {
          stopEvent(event)

          onStart()

          document.addEventListener('mousemove', onMouseMove)
          document.addEventListener('mouseup', onMouseUp)
        })

        // Touch support
        const touchPosition: Movement = { x: 0, y: 0 }
        const onTouchMove = (event: TouchEvent) => {
          stopEvent(event)

          const touch = event.touches.item(0)
          if (!touch) return

          onMove({ x: touch.clientX - touchPosition.x, y: touch.clientY - touchPosition.y })

          touchPosition.x = touch.clientX
          touchPosition.y = touch.clientY
        }

        const onTouchEnd = (event: TouchEvent) => {
          stopEvent(event)

          document.removeEventListener('touchmove', onTouchMove)
          document.removeEventListener('touchcancel', onTouchEnd)
          document.removeEventListener('touchend', onTouchEnd)

          onEnd()
        }

        child.addEventListener(
          'touchstart',
          (event) => {
            stopEvent(event)

            const touch = event.touches.item(0)
            if (!touch) return

            touchPosition.x = touch.clientX
            touchPosition.y = touch.clientY
            onStart()

            document.addEventListener('touchmove', onTouchMove, { passive: false })
            document.addEventListener('touchcancel', onTouchEnd, { passive: false })
            document.addEventListener('touchend', onTouchEnd, { passive: false })
          },
          { passive: false }
        )
      }
    },
    []
  )

  const setPreview = useCallback(({ preview }: DashboardSetPreviewParams) => {
    previewRef.current = preview
    if (preview === null) return

    preview.style.position = 'absolute'
  }, [])

  return { refresh, setPreview }
}

export default useDashboard
export type { DashboardRefreshParams }
