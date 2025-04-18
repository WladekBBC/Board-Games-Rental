import type { Metadata } from 'next'
import RootLayoutClient from './layout.client'

export const metadata: Metadata = {
  title: 'Board Game Rental',
  description: 'Aplikacja do wypożyczania gier planszowych',
}

/**
 * Root layout component that wraps the entire application
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to be rendered
 * @returns {JSX.Element} The root layout with language provider
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>
}
