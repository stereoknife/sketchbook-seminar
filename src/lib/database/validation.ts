export const ValidationError = Error

export function stringLengthCheck(x: string, maxLength: number, name: string) {
  if (x.length > maxLength) {
    throw new ValidationError(`${name} has more than ${maxLength} characters (${x.length}): "${x}"`)
  }
}

export function integerCheck(x: number, name: string) {
  if (!Number.isInteger(x)) {
    throw new ValidationError(`${name} was not an integer: ${x}`)
  }
}

export function nonZeroNaturalCheck(x: number, name: string) {
  if (x < 1) {
    throw new ValidationError(`${name} was less than 1: ${x}`)
  }
}

export function startEndTimeCheck(start: Date, end: Date) {
  if (start.getTime() > end.getTime()) {
    throw new ValidationError(`Start time is after it ends: Start is ${start.toUTCString()} but end is ${end.toUTCString()}`)
  }
}
