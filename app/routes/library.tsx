import { json, redirect } from "@remix-run/cloudflare"
import { useLoaderData } from "@remix-run/react"
import { getSession } from "~/sessions"

export const loader = async () => {
	const session = await getSession()
	
	if (!session.has('userId')) return redirect('/login')
	
	return json({
		userId: session.get('userId'),
		sketches: [] // here be sketches or something
	})
}

export default function Library () {
	const { userId, ...data } = useLoaderData<typeof loader>()
		
	return (
		<>
			<p>nothing yet</p>
		</>)
}