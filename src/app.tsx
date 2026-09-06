import { Analytics } from '@vercel/analytics/react'
import { HomePage } from '@/pages/home'

export function App() {
  return (
    <>
      <HomePage />
      <Analytics />
    </>
  )
}
