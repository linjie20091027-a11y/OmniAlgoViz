import Sidebar from './sidebar'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  dark: boolean
  onToggleDark: () => void
}

export default function AppLayout({ children, dark, onToggleDark }: Props) {
  return (
    <div className="flex h-screen overflow-hidden transition-colors">
      <Sidebar dark={dark} onToggleDark={onToggleDark} />
      <main className="flex-1 overflow-auto transition-colors">
        {children}
      </main>
    </div>
  )
}
