import { describe, it, expect } from 'vitest'
import getCollision from './get-collision'

describe('Given getCollision()', () => {
  it('when grid is empty then returns false', () => {
    const result = getCollision({
      colSpan: 1,
      colStart: 0,
      numCols: 4,
      numRows: 4,
      rowSpan: 1,
      rowStart: 0,
      state: { items: [] },
    })

    expect(result).toBeFalsy()
  })

  it('when grid is empty and component barely fits returns false', () => {
    const result = getCollision({
      colSpan: 2,
      colStart: 2,
      numCols: 4,
      numRows: 4,
      rowSpan: 1,
      rowStart: 0,
      state: { items: [] },
    })
    expect(result).toBeFalsy()
  })

  it('when grid is empty and component does not fit returns true', () => {
    const result = getCollision({
      colSpan: 2,
      colStart: 3,
      numCols: 4,
      numRows: 4,
      rowSpan: 1,
      rowStart: 0,
      state: { items: [] },
    })
    expect(result).toBeTruthy()
  })

  /**
   * |----
   * |x*  |
   * | o  |
   * |    |
   * |    |
   * |----|
   */
  it('when case 1 returns true', () => {
    const result = getCollision({
      colSpan: 1,
      colStart: 1,
      numCols: 4,
      numRows: 4,
      rowSpan: 2,
      rowStart: 0,
      state: {
        items: [
          {
            colSpan: 2,
            colStart: 0,
            id: 'test',
            rowSpan: 1,
            rowStart: 0,
          },
        ],
      },
    })
    expect(result).toBeTruthy()
  })

  /**
   * |----
   * |  x |
   * |  * |
   * |    |
   * |    |
   * |----|
   */
  it('when case 2 returns true', () => {
    const result = getCollision({
      colStart: 2,
      rowStart: 1,
      numCols: 4,
      numRows: 4,
      rowSpan: 1,
      colSpan: 1,
      state: {
        items: [
          {
            colStart: 2,
            rowStart: 0,
            id: 'test',
            colSpan: 1,
            rowSpan: 2,
          },
        ],
      },
    })
    expect(result).toBeTruthy()
  })

  /**
   * |----
   * |xxo |
   * |    |
   * |    |
   * |    |
   * |----|
   */
  it('when case 3 returns false', () => {
    const result = getCollision({
      colStart: 2,
      rowStart: 0,
      numCols: 4,
      numRows: 4,
      colSpan: 1,
      rowSpan: 1,
      state: {
        items: [
          {
            colSpan: 2,
            colStart: 0,
            id: 'test',
            rowSpan: 1,
            rowStart: 0,
          },
        ],
      },
    })
    expect(result).toBeFalsy()
  })

  /**
   * |----
   * |o xx|
   * |    |
   * |    |
   * |    |
   * |----|
   */
  it('when case 4 returns false', () => {
    const result = getCollision({
      colStart: 0,
      rowStart: 0,
      numCols: 4,
      numRows: 4,
      colSpan: 1,
      rowSpan: 1,
      state: {
        items: [
          {
            colSpan: 2,
            colStart: 2,
            id: 'test',
            rowSpan: 1,
            rowStart: 0,
          },
        ],
      },
    })
    expect(result).toBeFalsy()
  })
})
