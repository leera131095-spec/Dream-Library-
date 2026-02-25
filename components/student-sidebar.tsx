'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BookOpen, IndianRupee, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

const navItems = [
  { label: 'My Books', href: '/student', icon: BookOpen },
  { label: 'My Fines', href: '/student/fines', icon: IndianRupee },
  { label: 'Profile', href: '/student/profile', icon: User },
]

export function StudentSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [studentName, setStudentName] = useState('')

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (user) {
      const parsed = JSON.parse(user)
      setStudentName(parsed.name || 'Student')
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    router.push('/')
  }

  return (
    <aside className="glass-sidebar flex h-screen w-64 flex-col p-6">
      <div className="mb-8">
        <h2 className="font-serif text-2xl font-bold text-foreground">Dream Library</h2>
        <p className="mt-1 text-xs text-muted-foreground">Welcome, {studentName}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-2" aria-label="Student navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary/15 text-primary shadow-sm'
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="h-5 w-5" />
        Logout
      </button>
    </aside>
  )
}
