'use client'

import { useEffect, useState } from 'react'
import { getStudentIssuedBooks, getBooks, calculateFine, type IssuedBook, type Book } from '@/lib/library-store'
import { BookOpen, Calendar, CheckCircle2, Clock } from 'lucide-react'

interface EnrichedBook extends IssuedBook {
  bookTitle: string
  bookAuthor: string
  bookCategory: string
  fine: number
}

export default function StudentBooksPage() {
  const [books, setBooks] = useState<EnrichedBook[]>([])

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) return
    const parsed = JSON.parse(user)
    const issued = getStudentIssuedBooks(parsed.id)
    const allBooks = getBooks()

    const enriched: EnrichedBook[] = issued.map((ib) => {
      const book = allBooks.find((b: Book) => b.id === ib.bookId)
      return {
        ...ib,
        bookTitle: book?.title || 'Unknown',
        bookAuthor: book?.author || 'Unknown',
        bookCategory: book?.category || 'Unknown',
        fine: calculateFine(ib),
      }
    })
    setBooks(enriched.reverse())
  }, [])

  const activeBooks = books.filter((b) => !b.returned)
  const returnedBooks = books.filter((b) => b.returned)

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-foreground">My Books</h1>
        <p className="mt-2 text-muted-foreground">Your enchanted collection</p>
      </div>

      {books.length === 0 ? (
        <div className="glass-card flex flex-col items-center justify-center rounded-2xl p-12">
          <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="font-serif text-lg text-muted-foreground">
            No books have been issued to you yet
          </p>
        </div>
      ) : (
        <>
          {activeBooks.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
                Currently Reading
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {activeBooks.map((book) => (
                  <div
                    key={book.id}
                    className="glass-card animate-glow-pulse rounded-2xl p-6"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-foreground">
                          {book.bookTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground">by {book.bookAuthor}</p>
                      </div>
                      <Clock className="h-5 w-5 text-enchanted-gold" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-enchanted-lavender/20 px-3 py-1 text-xs text-foreground">
                        {book.bookCategory}
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-enchanted-blue/15 px-3 py-1 text-xs text-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(book.issueDate).toLocaleDateString()}
                      </span>
                      {book.fine > 0 && (
                        <span className="rounded-full bg-enchanted-gold/20 px-3 py-1 text-xs font-medium text-foreground">
                          Fine: ₹{book.fine}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {returnedBooks.length > 0 && (
            <div>
              <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">
                Returned Books
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {returnedBooks.map((book) => (
                  <div
                    key={book.id}
                    className="glass-card rounded-2xl p-6 opacity-75"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-foreground">
                          {book.bookTitle}
                        </h3>
                        <p className="text-sm text-muted-foreground">by {book.bookAuthor}</p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-enchanted-blue" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-secondary/50 px-3 py-1 text-xs text-foreground">
                        Returned: {book.returnDate ? new Date(book.returnDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
