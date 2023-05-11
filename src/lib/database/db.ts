import { PrismaClient } from '@prisma/client'
import type { User, Sketchbook, EntryKind, SketchbookEntry } from '@prisma/client'
import Constants from '@/constants'

const prisma = new PrismaClient()

/**
 * @deprecated Please, use the lib functions or shoot a Jira ticket (we don't have Jira)
 */
export const rawDb = prisma

export const ValidationError = Error

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U]

function stringLengthCheck(x: string, maxLength: number, name: string) {
  if (x.length > maxLength) {
    throw new ValidationError(`${name} has more than ${maxLength} characters (${x.length}): "${x}"`)
  }
}

function integerCheck(x: number, name: string) {
  if (!Number.isInteger(x)) {
    throw new ValidationError(`${name} was not an integer: ${x}`)
  }
}

function nonZeroNaturalCheck(x: number, name: string) {
  if (x < 1) {
    throw new ValidationError(`${name} was less than 1: ${x}`)
  }
}

function startEndTimeCheck(start: Date, end: Date) {
  if (start.getTime() > end.getTime()) {
    throw new ValidationError(`Start time is after it ends: Start is ${start.toUTCString()} but end is ${end.toUTCString()}`)
  }
}

function getId<T extends { id: number }>(x: T | number): number {
  if (typeof x === 'number') {
    integerCheck(x, 'id')
    return x
  } else {
    return x.id
  }
}

export async function createUser(username: string, discordSnowflake: string) {
  stringLengthCheck(username, Constants.User.USERNAME_LENGTH, 'username')
  stringLengthCheck(discordSnowflake, Constants.User.DISCORD_ID_LENGTH, 'discord id')

  return await prisma.user.create({
    data: {
      username,
      discord_id: discordSnowflake,
    },
  })
}

export async function findUser(user: Partial<User>, withEntries?: true): Promise<User & { entries: SketchbookEntry[] } | null>
export async function findUser(user: Partial<User>, withEntries?: false): Promise<User | null>
export async function findUser(user: Partial<User>, withEntries = false) {
  return await prisma.user.findUnique({
    where: user,
    include: {
      entries: withEntries,
    },
  })
}

interface UserUpdateable {
  username?: string
}

export async function updateUser(user: User | number, { username }: AtLeastOne<UserUpdateable>) {
  if (username !== undefined) stringLengthCheck(username, Constants.User.USERNAME_LENGTH, 'new username')
  const userId = getId(user)

  return await prisma.user.update({
    data: {
      username,
    },
    where: {
      id: userId,
    },
  })
}

export async function deleteUser(user: User | number) {
  const userId = getId(user)

  return await prisma.user.delete({
    where: {
      id: userId,
    },
  })
}

export async function findUsersBySimilarUsername(username: string) {
  return await prisma.$queryRaw<User[]>`SELECT * FROM users WHERE SIMILARITY(username, ${`'${username}'`}) > 0.4`
}

interface OptionalSketchbookParameters {
  theme?: string
}

export async function createSketchbook(name: string, start: Date, end: Date, pages: number, width: number, height: number, { theme }: OptionalSketchbookParameters) {
  integerCheck(pages, 'pages')
  integerCheck(width, 'width')
  integerCheck(height, 'height')

  nonZeroNaturalCheck(pages, 'pages')
  nonZeroNaturalCheck(pages, 'pages')
  nonZeroNaturalCheck(pages, 'pages')

  startEndTimeCheck(start, end)

  stringLengthCheck(name, Constants.Sketchbook.NAME_LENGTH, 'name')

  return await prisma.sketchbook.create({
    data: {
      name, start, end, pages, width, height, theme,
    },
  })
}

export async function findSketchbook(sketchbook: Partial<Sketchbook>, withEntries?: true): Promise<Sketchbook & { entries: SketchbookEntry[] } | null>
export async function findSketchbook(sketchbook: Partial<Sketchbook>, withEntries?: false): Promise<Sketchbook | null>
export async function findSketchbook(sketchbook: Partial<Sketchbook>, withEntries = false) {
  return await prisma.sketchbook.findUnique({
    where: sketchbook,
    include: {
      entries: withEntries,
    },
  })
}

export async function findSketchbookBySimilarName(name: string) {
  return await prisma.$queryRaw<User[]>`SELECT * FROM sketchbooks WHERE SIMILARITY(name, ${`'${name}'`}) > 0.4`
}

interface SketchbookUpdateable {
  name?: string
  theme?: string | null
  start?: Date
  end?: Date
  pages?: number
  width?: number
  height?: number
}

export async function updateSketchbook(sketchbook: Sketchbook | number, { name, theme, start, end, pages, width, height }: AtLeastOne<SketchbookUpdateable>) {
  const sketchbookId = getId(sketchbook)

  if (name !== undefined) stringLengthCheck(name, Constants.Sketchbook.NAME_LENGTH, 'name')
  if (start !== undefined) {
    if (end !== undefined) {
      startEndTimeCheck(start, end)
    } else {
      const current = await findSketchbook({ id: sketchbookId }, false)
      current !== null && startEndTimeCheck(start, current.end)
    }
  } else if (end !== undefined) {
    const current = await findSketchbook({ id: sketchbookId }, false)
    current !== null && startEndTimeCheck(current.start, end)
  }
  if (pages !== undefined) {
    integerCheck(pages, 'pages')
    nonZeroNaturalCheck(pages, 'pages')
  }
  if (width !== undefined) {
    integerCheck(width, 'width')
    nonZeroNaturalCheck(width, 'width')
  }
  if (height !== undefined) {
    integerCheck(height, 'height')
    nonZeroNaturalCheck(height, 'height')
  }

  return await prisma.sketchbook.update({
    data: {
      name, theme, start, end, pages, width, height,
    },
    where: {
      id: sketchbookId,
    },
  })
}

export async function deleteSketchbook(sketchbook: Sketchbook | number) {
  const sketchbookId = getId(sketchbook)

  return await prisma.sketchbook.delete({
    where: {
      id: sketchbookId,
    },
  })
}

interface OptionalSketchbookEntryParameters {
  name?: string
  description?: string
}

export async function createSketchbookEntry(author: User | number, sketchbook: Sketchbook | number, kind: EntryKind, path: string, { name, description }: OptionalSketchbookEntryParameters) {
  const userId = getId(author)
  const sketchbookId = getId(sketchbook)

  if (name !== undefined) stringLengthCheck(name, Constants.SketchbookEntry.NAME_LENGTH, 'name')

  const now = new Date()

  return await prisma.sketchbookEntry.create({
    data: {
      user_id: userId,
      sketchbook_id: sketchbookId,
      kind,
      path,
      name,
      description,
      post_time: now,
      edit_time: now,
    },
  })
}

export async function findEntry(entry: Partial<SketchbookEntry>, withOwners?: true): Promise<SketchbookEntry & { user: User, sketchbook: Sketchbook } | null>
export async function findEntry(entry: Partial<SketchbookEntry>, withOwners?: false): Promise<SketchbookEntry | null>
export async function findEntry(entry: Partial<SketchbookEntry>, withOwners = false) {
  return await prisma.sketchbookEntry.findUnique({
    where: entry,
    include: {
      user: withOwners, sketchbook: withOwners,
    },
  })
}

interface FindManyOptions<T> {
  skip?: number
  take?: number
  orderBy?: Record<keyof T, 'asc' | 'desc'>
}

export async function findEntries(entry: Partial<SketchbookEntry>, options?: FindManyOptions<SketchbookEntry>, withOwners?: true): Promise<Array<SketchbookEntry & { user: User, sketchbook: Sketchbook }> | null>
export async function findEntries(entry: Partial<SketchbookEntry>, options?: FindManyOptions<SketchbookEntry>, withOwners?: false): Promise<SketchbookEntry[] | null>
export async function findEntries(entry: Partial<SketchbookEntry>, options: FindManyOptions<SketchbookEntry> = {}, withOwners = false) {
  return await prisma.sketchbookEntry.findMany({
    where: entry,
    include: {
      user: withOwners, sketchbook: withOwners,
    },
    ...options,
  })
}

export async function findEntriesByAuthor(author: User | number, options?: FindManyOptions<SketchbookEntry>, withOwners?: true): Promise<Array<SketchbookEntry & { user: User, sketchbook: Sketchbook }> | null>
export async function findEntriesByAuthor(author: User | number, options?: FindManyOptions<SketchbookEntry>, withOwners?: false): Promise<SketchbookEntry[] | null>
export async function findEntriesByAuthor(author: User | number, options: FindManyOptions<SketchbookEntry> = {}, withOwners = false) {
  const userId = getId(author)

  return await prisma.sketchbookEntry.findMany({
    where: {
      user_id: userId,
    },
    include: {
      user: withOwners, sketchbook: withOwners,
    },
    ...options,
  })
}

export async function findEntriesBySketchbook(sketchbook: Sketchbook | number, options?: FindManyOptions<SketchbookEntry>, withOwners?: true): Promise<Array<SketchbookEntry & { user: User, sketchbook: Sketchbook }> | null>
export async function findEntriesBySketchbook(sketchbook: Sketchbook | number, options?: FindManyOptions<SketchbookEntry>, withOwners?: false): Promise<SketchbookEntry[] | null>
export async function findEntriesBySketchbook(sketchbook: Sketchbook | number, options: FindManyOptions<SketchbookEntry> = {}, withOwners = false) {
  const sketchbookId = getId(sketchbook)

  return await prisma.sketchbookEntry.findMany({
    where: {
      sketchbook_id: sketchbookId,
    },
    include: {
      user: withOwners, sketchbook: withOwners,
    },
    ...options,
  })
}

export async function findSketchbookEntriesByAuthor(sketchbook: Sketchbook | number, author: User | number, options?: FindManyOptions<SketchbookEntry>, withOwners?: true): Promise<Array<SketchbookEntry & { user: User, sketchbook: Sketchbook }> | null>
export async function findSketchbookEntriesByAuthor(sketchbook: Sketchbook | number, author: User | number, options?: FindManyOptions<SketchbookEntry>, withOwners?: false): Promise<SketchbookEntry[] | null>
export async function findSketchbookEntriesByAuthor(sketchbook: Sketchbook | number, author: User | number, options: FindManyOptions<SketchbookEntry> = {}, withOwners = false) {
  const userId = getId(author)
  const sketchbookId = getId(sketchbook)

  return await prisma.sketchbookEntry.findMany({
    where: {
      user_id: userId,
      sketchbook_id: sketchbookId,
    },
    include: {
      user: withOwners, sketchbook: withOwners,
    },
    ...options,
  })
}

interface SketchbookEntryUpdateable {
  kind?: EntryKind
  name?: string | null
  description?: string | null
}

export async function updateSketchbookEntry(entry: SketchbookEntry | number, { kind, name, description }: AtLeastOne<SketchbookEntryUpdateable>) {
  const entryId = getId(entry)

  if (name !== undefined && name !== null) stringLengthCheck(name, Constants.SketchbookEntry.NAME_LENGTH, 'entry name')

  return await prisma.sketchbookEntry.update({
    data: {
      kind,
      name,
      description,
      edit_time: new Date(),
    },
    where: {
      id: entryId,
    },
  })
}

export async function deleteSketchbookEntry(entry: SketchbookEntry | number) {
  const entryId = getId(entry)

  return await prisma.sketchbookEntry.delete({
    where: {
      id: entryId,
    },
  })
}
