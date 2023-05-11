/**
 * Default exception type for validation errors
 */
export const ValidationError = Error

/**
 * Verifies a string is shorter than the maximum allowed
 * @param x String to check
 * @param maxLength Maximum valid length of string
 * @param name Name of string
 * @throws If the string is longer than allowed
 */
export function stringLengthCheck(x: string, maxLength: number, name: string) {
  if (x.length > maxLength) {
    throw new ValidationError(`${name} has more than ${maxLength} characters (${x.length}): "${x}"`)
  }
}

/**
 * Verifies a number is an integer
 * @param x Number to check
 * @param name Name of number
 * @throws If the number is not an integer
 */
export function integerCheck(x: number, name: string) {
  if (!Number.isInteger(x)) {
    throw new ValidationError(`${name} was not an integer: ${x}`)
  }
}

/**
 * Verifies an integer is a non-zero Natural number
 * @param x Integer to check
 * @param name Name of number
 * @throws If the number is not a non-zero Natural
 * @note Only works on integers :)
 */
export function nonZeroNaturalCheck(x: number, name: string) {
  if (x < 1) {
    throw new ValidationError(`${name} was less than 1: ${x}`)
  }
}

/**
 * Verifies two times are ordered properly
 * @param start Start time
 * @param end End time
 * @throws if end comes before start
 */
export function startEndTimeCheck(start: Date, end: Date) {
  if (start.getTime() > end.getTime()) {
    throw new ValidationError(`Start time is after it ends: Start is ${start.toUTCString()} but end is ${end.toUTCString()}`)
  }
}
