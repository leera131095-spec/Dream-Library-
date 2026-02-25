'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { StudentSidebar } from '@/components/student-sidebar'
import { FloatingParticles } from '@/components/floating-particles'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) {
      router.push('/')
      return
    }
    const parsed = JSON.parse(user)
    if (parsed.role !== 'student') {
      router.push('/')
      return
    }
    setAuthorized(true)
  }, [router])

  if (!authorized) return null

  return (
    <div className="enchanted-bg flex min-h-screen">
      <FloatingParticles />
      <StudentSidebar />
      <main className="relative z-10 flex-1 overflow-auto p-8">
        {children}
      </main>
    </div>
  )
}
