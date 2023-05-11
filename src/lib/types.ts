// From https://stackoverflow.com/a/48244432
/**
 * Like `Partial<T>`, but disallows empty objects
 */
export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U]
