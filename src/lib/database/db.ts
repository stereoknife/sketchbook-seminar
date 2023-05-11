import { PrismaClient } from '@prisma/client'
import type { User, Sketchbook, EntryKind, SketchbookEntry } from '@prisma/client'

const prisma = new PrismaClient()

export const rawDb = prisma

export const ValidationError = Error

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

export async function createUser(username: string, discordSnowflake: string) {
  stringLengthCheck(username, 255, 'username')

  return await prisma.user.create({
    data: {
      username,
      discord_id: discordSnowflake,
    },
  })
}

export async function findUser(user: Partial<User>, withEntries: true): Promise<User & { entries: SketchbookEntry[] } | null>
export async function findUser(user: Partial<User>, withEntries: false): Promise<User | null>
export async function findUser(user: Partial<User>, withEntries = false) {
  return await prisma.user.findUnique({
    where: user,
    include: {
      entries: withEntries,
    },
  })
}

export async function findUsersBySimilarUsername(username: string) {
  return await prisma.$queryRaw<User[]>`SELECT * FROM users WHERE SIMILARITY(username, ${`'${username}'`}) > 0.4`
}

interface optionalSketchbookParameters {
  theme?: string
}

export async function createSketchbook(name: string, start: Date, end: Date, pages: number, width: number, height: number, { theme }: optionalSketchbookParameters) {
  integerCheck(pages, 'pages')
  integerCheck(width, 'width')
  integerCheck(height, 'height')

  nonZeroNaturalCheck(pages, 'pages')
  nonZeroNaturalCheck(pages, 'pages')
  nonZeroNaturalCheck(pages, 'pages')

  if (start.getTime() > end.getTime()) {
    throw new ValidationError(`Sketchbook starts after it ends: Starts at ${start.toUTCString()} but ends at ${end.toUTCString()}`)
  }

  return await prisma.sketchbook.create({
    data: {
      name, start, end, pages, width, height, theme,
    },
  })
}

export async function findSketchbook(sketchbook: Partial<Sketchbook>, withEntries: true): Promise<Sketchbook & { entries: SketchbookEntry[] } | null>
export async function findSketchbook(sketchbook: Partial<Sketchbook>, withEntries: false): Promise<Sketchbook | null>
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

interface optionalSketchbookEntryParameters {
  name?: string
  description?: string
}

export async function createSketchbookEntry(author: User | number, sketchbook: Sketchbook | number, kind: EntryKind, path: string, { name, description }: optionalSketchbookEntryParameters) {
  const userId = typeof author === 'number' ? author : author.id
  const sketchbookId = typeof sketchbook === 'number' ? sketchbook : sketchbook.id

  integerCheck(userId, 'author id')
  integerCheck(sketchbookId, 'sketchbook id')

  if (name !== undefined) stringLengthCheck(name, 255, 'name')

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

export async function findEntry(entry: Partial<SketchbookEntry>, withOwners: true): Promise<SketchbookEntry & { user: User, sketchbook: Sketchbook } | null>
export async function findEntry(entry: Partial<SketchbookEntry>, withOwners: false): Promise<SketchbookEntry | null>
export async function findEntry(entry: Partial<SketchbookEntry>, withOwners = false) {
  return await prisma.sketchbookEntry.findUnique({
    where: entry,
    include: {
      user: withOwners, sketchbook: withOwners,
    },
  })
}

interface findManyOptions<T> {
  skip?: number
  take?: number
  orderBy?: Record<keyof T, 'asc' | 'desc'>
}

export async function findEntries(entry: Partial<SketchbookEntry>, options: findManyOptions<SketchbookEntry>, withOwners: true): Promise<Array<SketchbookEntry & { user: User, sketchbook: Sketchbook }> | null>
export async function findEntries(entry: Partial<SketchbookEntry>, options: findManyOptions<SketchbookEntry>, withOwners: false): Promise<SketchbookEntry[] | null>
export async function findEntries(entry: Partial<SketchbookEntry>, options: findManyOptions<SketchbookEntry> = {}, withOwners = false) {
  return await prisma.sketchbookEntry.findMany({
    where: entry,
    include: {
      user: withOwners, sketchbook: withOwners,
    },
    ...options,
  })
}

export async function findEntriesByAuthor(author: User | number, options: findManyOptions<SketchbookEntry>, withOwners: true): Promise<Array<SketchbookEntry & { user: User, sketchbook: Sketchbook }> | null>
export async function findEntriesByAuthor(author: User | number, options: findManyOptions<SketchbookEntry>, withOwners: false): Promise<SketchbookEntry[] | null>
export async function findEntriesByAuthor(author: User | number, options: findManyOptions<SketchbookEntry> = {}, withOwners = false) {
  const userId = typeof author === 'number' ? author : author.id
  integerCheck(userId, 'author id')

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

export async function findEntriesBySketchbook(sketchbook: Sketchbook | number, options: findManyOptions<SketchbookEntry>, withOwners: true): Promise<Array<SketchbookEntry & { user: User, sketchbook: Sketchbook }> | null>
export async function findEntriesBySketchbook(sketchbook: Sketchbook | number, options: findManyOptions<SketchbookEntry>, withOwners: false): Promise<SketchbookEntry[] | null>
export async function findEntriesBySketchbook(sketchbook: Sketchbook | number, options: findManyOptions<SketchbookEntry> = {}, withOwners = false) {
  const sketchbookId = typeof sketchbook === 'number' ? sketchbook : sketchbook.id
  integerCheck(sketchbookId, 'sketchbook id')

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

export async function findSketchbookEntriesByAuthor(sketchbook: Sketchbook | number, author: User | number, options: findManyOptions<SketchbookEntry>, withOwners: true): Promise<Array<SketchbookEntry & { user: User, sketchbook: Sketchbook }> | null>
export async function findSketchbookEntriesByAuthor(sketchbook: Sketchbook | number, author: User | number, options: findManyOptions<SketchbookEntry>, withOwners: false): Promise<SketchbookEntry[] | null>
export async function findSketchbookEntriesByAuthor(sketchbook: Sketchbook | number, author: User | number, options: findManyOptions<SketchbookEntry> = {}, withOwners = false) {
  const userId = typeof author === 'number' ? author : author.id
  const sketchbookId = typeof sketchbook === 'number' ? sketchbook : sketchbook.id
  integerCheck(userId, 'author id')
  integerCheck(sketchbookId, 'sketchbook id')

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
