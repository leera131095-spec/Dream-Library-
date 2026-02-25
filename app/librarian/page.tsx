'use client'

import { useEffect, useState } from 'react'
import { getBooks, getStudents, getIssuedBooks, getTotalFines } from '@/lib/library-store'
import { BookOpen, Users, BookUp, IndianRupee } from 'lucide-react'

interface Stats {
  totalBooks: number
  totalStudents: number
  issuedBooks: number
  totalFine: number
}

export default function LibrarianDashboard() {
  const [stats, setStats] = useState<Stats>({ totalBooks: 0, totalStudents: 0, issuedBooks: 0, totalFine: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const books = getBooks()
    const students = getStudents()
    const issued = getIssuedBooks().filter((ib) => !ib.returned)
    const fines = getTotalFines()
    setStats({
      totalBooks: books.length,
      totalStudents: students.length,
      issuedBooks: issued.length,
      totalFine: fines,
    })
    setTimeout(() => setVisible(true), 100)
  }, [])

  const cards = [
    { label: 'Total Books', value: stats.totalBooks, icon: BookOpen, color: 'from-[#c9b8db]/40 to-[#c9b8db]/10' },
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'from-[#a7c7e7]/40 to-[#a7c7e7]/10' },
    { label: 'Issued Books', value: stats.issuedBooks, icon: BookUp, color: 'from-[#f2c4c8]/40 to-[#f2c4c8]/10' },
    { label: 'Total Fine', value: `₹${stats.totalFine}`, icon: IndianRupee, color: 'from-[#d4a843]/30 to-[#d4a843]/10' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome back, Keeper of the Archive</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className={`glass-card rounded-2xl bg-gradient-to-br ${card.color} p-6 transition-all duration-500 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
              <card.icon className="h-5 w-5 text-primary" />
            </div>
            <p className="font-serif text-3xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Books */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">Recent Books</h2>
          <div className="flex flex-col gap-3">
            {getBooks().slice(-5).reverse().map((book) => (
              <div
                key={book.id}
                className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{book.title}</p>
                  <p className="text-xs text-muted-foreground">{book.author}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${book.available ? 'bg-enchanted-blue/20 text-foreground' : 'bg-enchanted-rose/30 text-foreground'}`}
                >
                  {book.available ? 'Available' : 'Issued'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Students */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="mb-4 font-serif text-xl font-semibold text-foreground">Students</h2>
          <div className="flex flex-col gap-3">
            {getStudents().map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{student.name}</p>
                  <p className="text-xs text-muted-foreground">{student.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
