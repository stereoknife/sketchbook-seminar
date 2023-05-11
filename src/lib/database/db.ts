import { PrismaClient } from '@prisma/client'
import type { User, Sketchbook, EntryKind } from '@prisma/client'

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

export async function createSketchbook(name: string, start: Date, end: Date, pages: number, width: number, height: number, theme?: string) {
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

export async function createSketchbookEntry(author: User | number, sketchbook: Sketchbook | number, kind: EntryKind, path: string, name?: string, description?: string) {
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
