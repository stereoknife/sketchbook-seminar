import React from 'react'

interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean
  /**
   * What color to use
   */
  color?: string
  /**
   * What color intensity to use
   */
  colorIntensity?: number
  text?: 'white' | 'black'
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Button contents
   */
  label: string
  /**
   * Optional click handler
   */
  onClick?: () => void
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary = false,
  size = 'medium',
  color = 'red',
  colorIntensity = 500,
  text = 'black',
  label,
  ...props
}: ButtonProps) => {
  const getColor = (...args: string[]) => args.map((arg) => `${arg}-${color}-${colorIntensity}`).join(' ')

  const sizeClass =
    size === 'small'
      ? 'px-4 py-1'
      : size === 'medium'
        ? 'px-6 py-2'
        : size === 'large'
          ? 'px-8 py-2 text-lg'
          : ''

  const colorClass = primary
    ? `${getColor('bg')} text-${text}`
    : `border ${getColor('border', 'text')}`

  const common = `rounded-md ${sizeClass} ${colorClass}`

  return (
    <button
      type="button"
      className={common}
      {...props}
    >
      {label}
    </button>
  )
}
