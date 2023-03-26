/**
 * Returns whether a value is between close interval [min, max].
 * @param value
 * @param min
 * @param max
 */
function inRange(value: number, min: number, max: number) {
  const result = value >= min && value <= max
  return result
}

export default inRange
