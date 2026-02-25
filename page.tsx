'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FloatingParticles } from '@/components/floating-particles'
import { SparkleCursor } from '@/components/sparkle-cursor'
import { initializeStore, authenticateLibrarian, authenticateStudent } from '@/lib/library-store'
import { BookOpen, Lock, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

type LoginMode = 'select' | 'librarian' | 'student'

export default function LoginPage() {
  const [mode, setMode] = useState<LoginMode>('select')
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    initializeStore()
  }, [])

  const handleLibrarianLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (authenticateLibrarian(id, password)) {
      setIsAnimating(true)
      localStorage.setItem('currentUser', JSON.stringify({ role: 'librarian', id: 'admin' }))
      setTimeout(() => router.push('/librarian'), 600)
    } else {
      toast.error('Invalid credentials. Try admin / admin')
    }
  }

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const student = authenticateStudent(id, password)
    if (student) {
      setIsAnimating(true)
      localStorage.setItem('currentUser', JSON.stringify({ role: 'student', id: student.id, name: student.name }))
      setTimeout(() => router.push('/student'), 600)
    } else {
      toast.error('Invalid credentials. Student must exist in the system.')
    }
  }

  return (
    <main
      className={`enchanted-bg flex min-h-screen items-center justify-center p-4 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
    >
      <FloatingParticles />
      <SparkleCursor />

      <div className="relative z-10 w-full max-w-md">
        {/* Title */}
        <div className="animate-fade-in-up mb-8 text-center">
          <h1 className="font-serif text-5xl font-bold tracking-tight text-foreground md:text-6xl">
            Dream Library
          </h1>
          <p className="shimmer-text mt-3 font-serif text-lg italic">
            &ldquo;Every story finds its soul here...&rdquo;
          </p>
        </div>

        {/* Glass Card */}
        <div
          className="glass-card animate-glow-pulse rounded-3xl p-8"
          style={{ animationDelay: '0.2s' }}
        >
          {mode === 'select' && (
            <div className="animate-fade-in-up flex flex-col gap-4">
              <p className="mb-2 text-center font-serif text-sm text-muted-foreground">
                Choose your entrance to the enchanted archive
              </p>
              <button
                onClick={() => setMode('librarian')}
                className="enchanted-button glass-card flex items-center justify-center gap-3 rounded-2xl px-6 py-5 font-serif text-lg font-semibold text-foreground transition-all hover:text-primary"
              >
                <Lock className="h-5 w-5" />
                Librarian Entrance
              </button>
              <button
                onClick={() => setMode('student')}
                className="enchanted-button glass-card flex items-center justify-center gap-3 rounded-2xl px-6 py-5 font-serif text-lg font-semibold text-foreground transition-all hover:text-primary"
              >
                <BookOpen className="h-5 w-5" />
                Student Entrance
              </button>
            </div>
          )}

          {mode === 'librarian' && (
            <form onSubmit={handleLibrarianLogin} className="animate-fade-in-up flex flex-col gap-5">
              <button
                type="button"
                onClick={() => { setMode('select'); setId(''); setPassword('') }}
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="text-center">
                <Lock className="mx-auto mb-2 h-8 w-8 text-primary" />
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Librarian Portal
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter the keeper&apos;s credentials
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="lib-id" className="text-sm font-medium text-foreground">
                  Librarian ID
                </label>
                <input
                  id="lib-id"
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Enter your ID"
                  className="glass-card rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="lib-pass" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  id="lib-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="glass-card rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="enchanted-button rounded-2xl bg-primary px-6 py-3 font-serif text-lg font-semibold text-primary-foreground transition-all hover:brightness-110"
              >
                Enter the Archive
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Default: admin / admin
              </p>
            </form>
          )}

          {mode === 'student' && (
            <form onSubmit={handleStudentLogin} className="animate-fade-in-up flex flex-col gap-5">
              <button
                type="button"
                onClick={() => { setMode('select'); setId(''); setPassword('') }}
                className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="text-center">
                <BookOpen className="mx-auto mb-2 h-8 w-8 text-primary" />
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Student Portal
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Enter your enchanted credentials
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="stu-id" className="text-sm font-medium text-foreground">
                  Student ID
                </label>
                <input
                  id="stu-id"
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="e.g. STU001"
                  className="glass-card rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="stu-pass" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  id="stu-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="glass-card rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="enchanted-button rounded-2xl bg-primary px-6 py-3 font-serif text-lg font-semibold text-primary-foreground transition-all hover:brightness-110"
              >
                Open Your Story
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Try: STU001 / student1
              </p>
            </form>
          )}
        </div>

        <p className="mt-6 text-center font-serif text-xs text-muted-foreground">
          The Enchanted Archive
        </p>
      </div>
    </main>
  )
}
