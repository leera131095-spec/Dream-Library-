'use client'

import { useEffect, useState } from 'react'
import { getStudentIssuedBooks, getBooks, calculateFine, type IssuedBook, type Book } from '@/lib/library-store'
import { User, BookOpen, IndianRupee, CheckCircle2 } from 'lucide-react'

export default function StudentProfilePage() {
  const [name, setName] = useState('')
  const [id, setId] = useState('')
  const [totalIssued, setTotalIssued] = useState(0)
  const [currentlyReading, setCurrentlyReading] = useState(0)
  const [totalReturned, setTotalReturned] = useState(0)
  const [totalFine, setTotalFine] = useState(0)

  useEffect(() => {
    const user = localStorage.getItem('currentUser')
    if (!user) return
    const parsed = JSON.parse(user)
    setName(parsed.name)
    setId(parsed.id)

    const issued = getStudentIssuedBooks(parsed.id)
    setTotalIssued(issued.length)
    setCurrentlyReading(issued.filter((ib: IssuedBook) => !ib.returned).length)
    setTotalReturned(issued.filter((ib: IssuedBook) => ib.returned).length)
    setTotalFine(
      issued
        .filter((ib: IssuedBook) => !ib.returned)
        .reduce((sum: number, ib: IssuedBook) => sum + calculateFine(ib), 0)
    )
  }, [])

  const statCards = [
    { label: 'Total Issued', value: totalIssued, icon: BookOpen, color: 'bg-enchanted-lavender/20' },
    { label: 'Currently Reading', value: currentlyReading, icon: BookOpen, color: 'bg-enchanted-blue/15' },
    { label: 'Returned', value: totalReturned, icon: CheckCircle2, color: 'bg-enchanted-blush/20' },
    { label: 'Outstanding Fine', value: `₹${totalFine}`, icon: IndianRupee, color: 'bg-enchanted-gold/20' },
  ]

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-foreground">Profile</h1>
        <p className="mt-2 text-muted-foreground">Your enchanted identity</p>
      </div>

      <div className="glass-card mb-8 flex items-center gap-6 rounded-2xl p-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#c9b8db]/40 to-[#f2c4c8]/40">
          <User className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h2 className="font-serif text-3xl font-bold text-foreground">{name}</h2>
          <p className="mt-1 text-muted-foreground">Student ID: {id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className={`glass-card rounded-2xl p-6`}>
            <div className="mb-3 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${card.color}`}>
                <card.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{card.label}</span>
            </div>
            <p className="font-serif text-2xl font-bold text-foreground">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
