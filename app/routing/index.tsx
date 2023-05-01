import type { V2_MetaFunction } from '@remix-run/cloudflare'

export const meta: V2_MetaFunction = () => {
  return [{ title: 'New Remix App' }]
}

export default function Index() {

  return (
    <div className='xl:container mx-auto text-center'>
      <h1 className='text-6xl font-black my-16'>Sketchbook Seminar</h1>
      <p className='text-2xl font-normal'>Coming soon,,,</p>
    </div>
  )
}