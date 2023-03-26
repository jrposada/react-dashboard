import { describe, expect, it } from 'vitest'
import getNextCell from './get-next-cell'

describe('Given getNextCell()', () => {
  describe('when flow is "row"', () => {
    it('and there is space on current row then returns same row and next column', () => {
      const { colStart, rowStart } = getNextCell('row', 0, 0, 4, 4)
      expect(colStart).toBe(1)
      expect(rowStart).toBe(0)
    })

    it('and there is one last space on current row then returns same row and last column', () => {
      const { colStart, rowStart } = getNextCell('row', 2, 0, 4, 4)
      expect(colStart).toBe(3)
      expect(rowStart).toBe(0)
    })

    it('and there is no space on current row then returns next row and first column', () => {
      const { colStart, rowStart } = getNextCell('row', 3, 0, 4, 4)
      expect(colStart).toBe(0)
      expect(rowStart).toBe(1)
    })

    it('and is second to last column of last row returns last column and last row', () => {
      const { colStart, rowStart } = getNextCell('row', 2, 3, 4, 4)
      expect(colStart).toBe(3)
      expect(rowStart).toBe(3)
    })

    it('and is last column of last throws not enough space error', () => {
      expect(() => getNextCell('row', 3, 3, 4, 4)).toThrowError('Grid is out of space.')
    })
  })
  describe('when flow is "column"', () => {
    it('and there is space on current column then returns same column and next row', () => {
      const { colStart, rowStart } = getNextCell('column', 0, 0, 4, 4)
      expect(colStart).toBe(0)
      expect(rowStart).toBe(1)
    })

    it('and there is one last space on current column then returns same column and last row', () => {
      const { colStart, rowStart } = getNextCell('column', 0, 2, 4, 4)
      expect(colStart).toBe(0)
      expect(rowStart).toBe(3)
    })

    it('and there is no space on current column then returns next column and first row', () => {
      const { colStart, rowStart } = getNextCell('column', 0, 3, 4, 4)
      expect(colStart).toBe(1)
      expect(rowStart).toBe(0)
    })

    it('and is second to last row of last column returns last column and last row', () => {
      const { colStart, rowStart } = getNextCell('column', 3, 2, 4, 4)
      expect(colStart).toBe(3)
      expect(rowStart).toBe(3)
    })

    it('and is last row of last throws not enough space error', () => {
      expect(() => getNextCell('column', 3, 3, 4, 4)).toThrowError('Grid is out of space.')
    })
  })
})
