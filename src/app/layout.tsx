import type { Metadata } from 'next'
import RootLayoutClient from './layout.client'

export const metadata: Metadata = {
  title: 'Board Game Rental',
  description: 'Aplikacja do wypożyczania gier planszowych',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RootLayoutClient>{children}</RootLayoutClient>
}
