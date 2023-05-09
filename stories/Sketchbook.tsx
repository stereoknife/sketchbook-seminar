interface SketchbookProps {
	name: string
}

export function Sketchbook({
		name,
	  ...props
	}: SketchbookProps) {
		
	return (
		<div
			className='bg-red-200 w-52 h-72 p-6 text-3xl text-white font-bold break-words justify'
		>
			{name}
		</div>
	)
}