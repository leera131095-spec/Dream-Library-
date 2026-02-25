'use client'

import { useState, useEffect } from 'react'
import { getBooks, getStudents, issueBook, type Book, type Student } from '@/lib/library-store'
import { BookUp } from 'lucide-react'
import { toast } from 'sonner'

export default function IssueBookPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [selectedBook, setSelectedBook] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')

  useEffect(() => {
    setBooks(getBooks().filter((b) => b.available))
    setStudents(getStudents())
  }, [])

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBook || !selectedStudent) {
      toast.error('Please select both a student and a book')
      return
    }
    issueBook(selectedBook, selectedStudent)
    const book = books.find((b) => b.id === selectedBook)
    const student = students.find((s) => s.id === selectedStudent)
    toast.success(`"${book?.title}" has been issued to ${student?.name}`)
    setBooks(getBooks().filter((b) => b.available))
    setSelectedBook('')
    setSelectedStudent('')
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-foreground">Issue Book</h1>
        <p className="mt-2 text-muted-foreground">Bestow an enchanted tome upon a student</p>
      </div>

      <div className="glass-card mx-auto max-w-lg rounded-2xl p-8">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-enchanted-blue/20">
            <BookUp className="h-7 w-7 text-primary" />
          </div>
        </div>

        <form onSubmit={handleIssue} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="student" className="text-sm font-medium text-foreground">
              Select Student
            </label>
            <select
              id="student"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="glass-card rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              required
            >
              <option value="">Choose a student...</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.id})
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="book" className="text-sm font-medium text-foreground">
              Select Book
            </label>
            <select
              id="book"
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="glass-card rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              required
            >
              <option value="">Choose an available book...</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} by {b.author}
                </option>
              ))}
            </select>
          </div>

          {books.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              No books are currently available for issuing.
            </p>
          )}

          <button
            type="submit"
            disabled={books.length === 0}
            className="enchanted-button mt-2 rounded-2xl bg-primary px-6 py-3 font-serif text-lg font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Issue Book
          </button>
        </form>
      </div>
    </div>
  )
}
