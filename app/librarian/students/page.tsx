'use client'

import { useState, useEffect } from 'react'
import { getStudents, addStudent, getStudentIssuedBooks, getBooks, type Student, type Book } from '@/lib/library-store'
import { Users, UserPlus } from 'lucide-react'
import { toast } from 'sonner'

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    setStudents(getStudents())
  }, [])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    addStudent({ id: studentId, name, password })
    toast.success(`${name} has joined the enchanted archive`)
    setStudents(getStudents())
    setName('')
    setStudentId('')
    setPassword('')
    setShowForm(false)
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-4xl font-bold text-foreground">Students</h1>
          <p className="mt-2 text-muted-foreground">Manage the seekers of enchanted knowledge</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="enchanted-button flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
        >
          <UserPlus className="h-4 w-4" />
          Add Student
        </button>
      </div>

      {showForm && (
        <div className="glass-card mb-8 rounded-2xl p-6">
          <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">New Student</h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="stu-id" className="text-sm font-medium text-foreground">
                Student ID
              </label>
              <input
                id="stu-id"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. STU006"
                className="glass-card rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="stu-name" className="text-sm font-medium text-foreground">
                Name
              </label>
              <input
                id="stu-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Student name"
                className="glass-card rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <label htmlFor="stu-pw" className="text-sm font-medium text-foreground">
                Password
              </label>
              <input
                id="stu-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="glass-card rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="enchanted-button rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:brightness-110"
            >
              Add
            </button>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {students.map((student) => {
          const issued = getStudentIssuedBooks(student.id)
          const activeIssued = issued.filter((ib) => !ib.returned)
          const books = getBooks()
          return (
            <div
              key={student.id}
              className="glass-card flex flex-col gap-3 rounded-2xl p-6 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-enchanted-lavender/30">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">{student.name}</h3>
                  <p className="text-sm text-muted-foreground">{student.id}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeIssued.length > 0 ? (
                  activeIssued.map((ib) => {
                    const book = books.find((b: Book) => b.id === ib.bookId)
                    return (
                      <span
                        key={ib.id}
                        className="rounded-full bg-enchanted-rose/20 px-3 py-1 text-xs text-foreground"
                      >
                        {book?.title}
                      </span>
                    )
                  })
                ) : (
                  <span className="text-sm text-muted-foreground">No books issued</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
