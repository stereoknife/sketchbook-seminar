import type { V2_MetaFunction } from '@remix-run/cloudflare'

export const meta: V2_MetaFunction = () => {
  return [{ title: 'New Remix App' }]
}

export default function Index() {
  return (
    <div className='container bg-red-300'>
    
    </div>
  )
}
