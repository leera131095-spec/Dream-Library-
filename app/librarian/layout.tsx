'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LibrarianSidebar } from '@/components/librarian-sidebar'
import { FloatingParticles } from '@/components/floating-particles'

export default function LibrarianLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) {
      router.push('/')
      return
    }
    const parsed = JSON.parse(user)
    if (parsed.role !== 'librarian') {
      router.push('/')
      return
    }
    setAuthorized(true)
  }, [router])

  if (!authorized) return null

  return (
    <div className="enchanted-bg flex min-h-screen">
      <FloatingParticles />
      <LibrarianSidebar />
      <main className="relative z-10 flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
