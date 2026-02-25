'use client'

import { useEffect, useState } from 'react'
import { getStudentIssuedBooks, getBooks, calculateFine, type IssuedBook, type Book } from '@/lib/library-store'
import { IndianRupee } from 'lucide-react'

interface FineEntry {
  bookTitle: string
  issueDate: string
  daysIssued: number
  fine: number
  returned: boolean
}

export default function StudentFinesPage() {
  const [fines, setFines] = useState<FineEntry[]>([])
  const [totalFine, setTotalFine] = useState(0)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) return
    const parsed = JSON.parse(user)
    const issued = getStudentIssuedBooks(parsed.id)
    const allBooks = getBooks()

    const entries: FineEntry[] = issued
      .filter((ib: IssuedBook) => !ib.returned)
      .map((ib: IssuedBook) => {
        const book = allBooks.find((b: Book) => b.id === ib.bookId)
        const diffTime = new Date().getTime() - new Date(ib.issueDate).getTime()
        const daysIssued = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return {
          bookTitle: book?.title || 'Unknown',
          issueDate: ib.issueDate,
          daysIssued,
          fine: calculateFine(ib),
          returned: ib.returned,
        }
      })

    setFines(entries)
    setTotalFine(entries.reduce((sum, e) => sum + e.fine, 0))
  }, [])

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-foreground">My Fines</h1>
        <p className="mt-2 text-muted-foreground">
          Late fee: ₹10 per day after 7 days
        </p>
      </div>

      <div className="glass-card mb-8 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[#d4a843]/20 to-[#d4a843]/5 p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-enchanted-gold/20">
          <IndianRupee className="h-7 w-7 text-foreground" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Outstanding Fine</p>
          <p className="font-serif text-3xl font-bold text-foreground">₹{totalFine}</p>
        </div>
      </div>

      {fines.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-12">
          <p className="font-serif text-lg text-muted-foreground">
            No outstanding fines. You are in good standing!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {fines.map((entry, i) => (
            <div
              key={i}
              className="glass-card flex items-center justify-between rounded-2xl p-5"
            >
              <div>
                <h3 className="font-serif font-semibold text-foreground">{entry.bookTitle}</h3>
                <p className="text-sm text-muted-foreground">
                  Issued: {new Date(entry.issueDate).toLocaleDateString()} &middot; {entry.daysIssued} days
                </p>
              </div>
              <span
                className={`rounded-full px-4 py-1 text-sm font-semibold ${entry.fine > 0 ? 'bg-enchanted-gold/20 text-foreground' : 'bg-enchanted-blue/15 text-foreground'}`}
              >
                {entry.fine > 0 ? `₹${entry.fine}` : 'No fine'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
