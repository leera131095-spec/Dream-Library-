'use client'

import { useState } from 'react'
import { addBook } from '@/lib/library-store'
import { BookPlus } from 'lucide-react'
import { toast } from 'sonner'

export default function AddBookPage() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [bookId, setBookId] = useState('')
  const [category, setCategory] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addBook({
      id: bookId,
      title,
      author,
      category,
      available: true,
    })
    toast.success(`"${title}" has been added to the archive`)
    setTitle('')
    setAuthor('')
    setBookId('')
    setCategory('')
  }

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-foreground">Add Book</h1>
        <p className="mt-2 text-muted-foreground">Add a new enchanted tome to the archive</p>
      </div>

      <div className="glass-card mx-auto max-w-lg rounded-2xl p-8">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
            <BookPlus className="h-7 w-7 text-primary" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Book Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The name of the enchanted tome"
              className="glass-card rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="author" className="text-sm font-medium text-foreground">
              Author
            </label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="The wordsmith behind the magic"
              className="glass-card rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="bookId" className="text-sm font-medium text-foreground">
              Book ID
            </label>
            <input
              id="bookId"
              type="text"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              placeholder="e.g. BK009"
              className="glass-card rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="text-sm font-medium text-foreground">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="glass-card rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
              required
            >
              <option value="">Select a realm...</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Romance">Romance</option>
              <option value="Mystery">Mystery</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Historical">Historical</option>
              <option value="Non-Fiction">Non-Fiction</option>
            </select>
          </div>

          <button
            type="submit"
            className="enchanted-button mt-2 rounded-2xl bg-primary px-6 py-3 font-serif text-lg font-semibold text-primary-foreground transition-all hover:brightness-110"
          >
            Add Book
          </button>
        </form>
      </div>
    </div>
  )
}
