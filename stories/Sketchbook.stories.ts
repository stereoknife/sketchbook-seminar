import { Meta, StoryObj } from '@storybook/react'

import { Sketchbook } from "./Sketchbook"

const meta: Meta<typeof Sketchbook> = {
	title: 'sketchbook/sketchbook',
	component: Sketchbook,
}

export default meta

type Story = StoryObj<typeof Sketchbook>

export const Default: Story = {
	args: {
		name: 'Default Sketchbook'
	}
}