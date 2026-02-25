'use client'

import { useState, useEffect } from 'react'
import { getIssuedBooks, getBooks, getStudents, returnBook, type IssuedBook, type Book, type Student } from '@/lib/library-store'
import { BookDown, IndianRupee } from 'lucide-react'
import { toast } from 'sonner'

interface EnrichedIssued extends IssuedBook {
  bookTitle: string
  bookAuthor: string
  studentName: string
  daysIssued: number
}

export default function ReturnBookPage() {
  const [issuedBooks, setIssuedBooks] = useState<EnrichedIssued[]>([])

  const loadData = () => {
    const issued = getIssuedBooks().filter((ib) => !ib.returned)
    const books = getBooks()
    const students = getStudents()

    const enriched: EnrichedIssued[] = issued.map((ib) => {
      const book = books.find((b: Book) => b.id === ib.bookId)
      const student = students.find((s: Student) => s.id === ib.studentId)
      const diffTime = new Date().getTime() - new Date(ib.issueDate).getTime()
      const daysIssued = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return {
        ...ib,
        bookTitle: book?.title || 'Unknown',
        bookAuthor: book?.author || 'Unknown',
        studentName: student?.name || 'Unknown',
        daysIssued,
      }
    })
    setIssuedBooks(enriched)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleReturn = (issuedBookId: string, bookTitle: string) => {
    const fine = returnBook(issuedBookId)
    if (fine > 0) {
      toast.info(`"${bookTitle}" returned with a fine of ₹${fine}`)
    } else {
      toast.success(`"${bookTitle}" has been returned to the archive`)
    }
    loadData()
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-foreground">Return Book</h1>
        <p className="mt-2 text-muted-foreground">
          Return enchanted tomes back to the archive. Fine: ₹10 per day after 7 days.
        </p>
      </div>

      {issuedBooks.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-12">
          <BookDown className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="font-serif text-lg text-muted-foreground">No books are currently issued</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {issuedBooks.map((ib) => {
            const isLate = ib.daysIssued > 7
            const fine = isLate ? (ib.daysIssued - 7) * 10 : 0
            return (
              <div
                key={ib.id}
                className="glass-card flex flex-col gap-4 rounded-2xl p-6 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex-1">
                  <h3 className="font-serif text-lg font-semibold text-foreground">{ib.bookTitle}</h3>
                  <p className="text-sm text-muted-foreground">by {ib.bookAuthor}</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    <span className="rounded-full bg-secondary/70 px-3 py-1 text-xs text-foreground">
                      Student: {ib.studentName}
                    </span>
                    <span className="rounded-full bg-secondary/70 px-3 py-1 text-xs text-foreground">
                      Issued: {new Date(ib.issueDate).toLocaleDateString()}
                    </span>
                    <span className="rounded-full bg-secondary/70 px-3 py-1 text-xs text-foreground">
                      {ib.daysIssued} days
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {isLate && (
                    <div className="flex items-center gap-1 rounded-full bg-enchanted-gold/20 px-3 py-1 text-sm font-medium text-foreground">
                      <IndianRupee className="h-3 w-3" />
                      {fine} fine
                    </div>
                  )}
                  <button
                    onClick={() => handleReturn(ib.id, ib.bookTitle)}
                    className="enchanted-button rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                  >
                    Return
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
