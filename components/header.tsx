import { Zap } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-border/50 bg-card">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="size-5" />
          </div>
          <span className="text-xl font-semibold tracking-tight">CutMyAI</span>
        </Link>
        <nav className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Free AI Spend Audit</span>
        </nav>
      </div>
    </header>
  )
}
