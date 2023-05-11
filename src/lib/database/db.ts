import { PrismaClient } from '@prisma/client'
import type { User, Sketchbook, EntryKind, SketchbookEntry } from '@prisma/client'
import { stringLengthCheck, integerCheck, nonZeroNaturalCheck, startEndTimeCheck } from './validation'
import Constants from '@/constants'
import type { AtLeastOne } from '@/types'

const prisma = new PrismaClient()

/**
 * @deprecated Please, use the lib functions or shoot a Jira ticket (we don't have Jira)
 */
export const rawDb = prisma

// Helper section

/**
 * Options for FindMany functions of the prisma variety
 */
interface FindManyOptions<T> {
  skip?: number
  take?: number
  orderBy?: Record<keyof T, 'asc' | 'desc'>
}

/**
 * Verifies an id number, or gets an id from an object
 * @param x Object that could have or be an id
 * @returns The id
 * @throws If {@link x} is a number but not an integer
 */
function getId<T extends { id: number }>(x: T | number): number {
  if (typeof x === 'number') {
    integerCheck(x, 'id')
    return x
  } else {
    return x.id
  }
}

// User

/**
 * Fields in `users` that can be updated
 */
interface UserUpdateable {
  username?: string
}

/**
 * Creates a new user entry in the database, with parameter checking
 * @param username Username for new user
 * @param discordSnowflake Discord ID (snowflake) for new user
 * @returns User object with the newly inserted information
 */
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

/**
 * Finds a single user that matches the search parameters
 * @param user User information to search for
 * @param withEntries If Sketchbook Entries should be included in the returned value
 * @returns User object found
 */
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

/**
 * Finds multiple users by doing triplet search on their username
 * @param username The username to match with. Uses triplets algorithm
 * @returns All users found that match.
 */
export async function findUsersBySimilarUsername(username: string) {
  return await prisma.$queryRaw<User[]>`SELECT * FROM users WHERE SIMILARITY(username, ${`'${username}'`}) > 0.4`
}

/**
 * Updates a user in the database with parameter checking
 * @param user User or id of user to edit
 * @param username New username for user
 * @returns User with updated fields
 */
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

/**
 * Deletes a user off the database
 * @param user User or id of user to delete
 * @returns User that was deleted
 */
export async function deleteUser(user: User | number) {
  const userId = getId(user)

  return await prisma.user.delete({
    where: {
      id: userId,
    },
  })
}

// Sketchbook

/**
 * Sketchbook data that is optional
 */
interface OptionalSketchbookParameters {
  theme?: string
}

/**
 * Sketchbook data that can be updated
 */
interface SketchbookUpdateable {
  name?: string
  theme?: string | null
  start?: Date
  end?: Date
  pages?: number
  width?: number
  height?: number
}

/**
 * Creates a new sketchbook entry in the database, with parameter checking
 * @param name Name of the sketchbook
 * @param start Start date of the sketchbook
 * @param end End date of the sketchbook
 * @param pages Amount of pages the sketchbook has
 * @param width Width of sketchbook in pixels
 * @param height Height of sketchbook in pixels
 * @param theme Theme for the sketchbook
 * @returns The inserted sketchbook entry
 */
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

/**
 * Finds a single sketchbook that matches the search parameters
 * @param sketchbook Sketchbook information to search for
 * @param withEntries If the sketchbook entries should be included in the returned value
 * @returns Sketchbook object found
 */
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

/**
 * Finds multiple sketchbooks by doing triplet search on their name
 * @param name The sketchbook name to match with. Uses triplets algorithm
 * @returns All sketchbooks found that match
 */
export async function findSketchbookBySimilarName(name: string) {
  return await prisma.$queryRaw<User[]>`SELECT * FROM sketchbooks WHERE SIMILARITY(name, ${`'${name}'`}) > 0.4`
}

/**
 * Updates a sketchbook in the database with parameter checking
 * @param sketchbook Sketchbook or id of sketchbook to edit
 * @param name New name for sketchbook
 * @param theme New theme for sketchbook
 * @param start New starting time for sketchbook
 * @param end New ending time for sketchbook
 * @param pages New amount of pages for sketchbook
 * @param width New width in pixels for sketchbook
 * @param height New height in pixels for sketchbook
 * @returns Sketchbook with updated fields
 */
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

/**
 * Deletes a sketchbook off the database
 * @param sketchbook Sketchbook or id of sketchbook to delete
 * @returns Sketchbook that was deleted
 */
export async function deleteSketchbook(sketchbook: Sketchbook | number) {
  const sketchbookId = getId(sketchbook)

  return await prisma.sketchbook.delete({
    where: {
      id: sketchbookId,
    },
  })
}

// Sketchbook entries

/**
 * Sketchbook entry data that is optional
 */
interface OptionalSketchbookEntryParameters {
  name?: string
  description?: string
}

/**
 * Sketchbook entry data that can be updated
 */
interface SketchbookEntryUpdateable {
  kind?: EntryKind
  name?: string | null
  description?: string | null
}

/**
 * Creates a new sketchbook entry entry in the database, with parameter checking
 * @param author Author of the entry
 * @param sketchbook Sketchbook this entry is in
 * @param kind Kind of entry in the sketchbook
 * @param path Path to file or bucket
 * @param name Name of entry
 * @param description Description of entry
 * @returns The inserted sketchbook entry entry
 */
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

/**
 * Finds a single sketchbook entry that matches the search parameters
 * @param entry Sketchbook entry information to search for
 * @param withOwners If the sketchbook and user data this entry belongs to should be included in the returned value
 * @returns Sketchbook entry object found
 */
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

/**
 * Finds multiple sketchbook entries based on the search and options parameters
 * @param entry Sketchbook entry information to search for
 * @param options Amount, Skip and Order options for query
 * @param withOwners If the sketchbook and user data the entries belongs to should be included in the returned values
 * @returns All sketchbook entries found
 */
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

/**
 * Finds multiple sketchbook entries for a specific user
 * @param author User or user id of sketchbook entries to find
 * @param options Amount, Skip and Order options for query
 * @param withOwners If the sketchbook and user data the entries belongs to should be included in the returned values
 * @returns All sketchbook entries found
 */
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

/**
 * Finds multiple sketchbook entries for a specific sketchbook
 * @param sketchbook Sketchbook or sketchbook id of sketchbook entries to find
 * @param options Amount, Skip and Order options for query
 * @param withOwners If the sketchbook and user data the entries belongs to should be included in the returned values
 * @returns All sketchbook entries found
 */
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

/**
 * Finds multiple sketchbook entries for a specific sketchbook and user
 * @param sketchbook Sketchbook or sketchbook id of sketchbook entries to find
 * @param author User or user id of sketchbook entries to find
 * @param options Amount, Skip and Order options for query
 * @param withOwners If the sketchbook and user data the entries belongs to should be included in the returned values
 * @returns All sketchbook entries found
 */
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

/**
 * Updates a sketchbook entry in the database with parameter checking
 * @param entry Entry or id of sketchbook entry to edit
 * @param kind New kind of entry
 * @param name New name of entry
 * @param description New description of entry
 * @returns Sketchbook entry with updated fields
 */
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

/**
 * Deletes a sketchbook entry off the database
 * @param entry Entry or id of sketchbook entry to delete
 * @returns Sketchbook entry that was deleted
 */
export async function deleteSketchbookEntry(entry: SketchbookEntry | number) {
  const entryId = getId(entry)

  return await prisma.sketchbookEntry.delete({
    where: {
      id: entryId,
    },
  })
}
