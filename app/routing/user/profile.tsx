import type { LoaderArgs } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useRouteError, isRouteErrorResponse, useLoaderData } from '@remix-run/react'

import { users } from '../../database/schema'
import { eq } from 'drizzle-orm'

export const loader = async ({
  context,
  params
}: LoaderArgs) => {
  if (!params.id) throw json({msg: 'Invalid route taken'}, { status: 500, statusText: 'Invalid route taken' })

  const user = await context.TEST_DB.select().from(users).where(eq(users.id, +params.id)).get()
  
  if (user) return json(user)

  throw json({msg: 'User does not exist'}, { status: 404, statusText: 'User does not exist' })
}

export default function Index() {
  const user = useLoaderData<typeof loader>()

  return (
    <div className='xl:container mx-auto text-center'>
      <h1 className='text-6xl font-black my-16'>{user.name}</h1>
      <p className='text-2xl font-normal'>{user.email}</p>
    </div>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Haha yes</h1>
        <p>Status: {error.status}</p>
        <p>Message: {error.data.msg}</p>
      </div>
    )
  }

  return (
    <div>
      <h1>I'm sure something can be done about this</h1>
      <p>I just don't know what.</p>
    </div>
  )
}