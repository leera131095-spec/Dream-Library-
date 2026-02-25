export interface Book {
  id: string
  title: string
  author: string
  category: string
  available: boolean
}

export interface Student {
  id: string
  name: string
  password: string
}

export interface IssuedBook {
  id: string
  bookId: string
  studentId: string
  issueDate: string
  returnDate: string | null
  returned: boolean
}

const DEFAULT_STUDENTS: Student[] = [
  { id: 'STU001', name: 'Aria Moonwhisper', password: 'student1' },
  { id: 'STU002', name: 'Elara Stardust', password: 'student2' },
  { id: 'STU003', name: 'Luna Fairweather', password: 'student3' },
  { id: 'STU004', name: 'Celeste Dewdrop', password: 'student4' },
  { id: 'STU005', name: 'Ivy Thornberry', password: 'student5' },
]

const DEFAULT_BOOKS: Book[] = [
  { id: 'BK001', title: 'Once Upon a Broken Heart', author: 'Stephanie Garber', category: 'Fantasy', available: true },
  { id: 'BK002', title: 'The Starless Sea', author: 'Erin Morgenstern', category: 'Fantasy', available: true },
  { id: 'BK003', title: 'The Night Circus', author: 'Erin Morgenstern', category: 'Fantasy', available: true },
  { id: 'BK004', title: 'Caraval', author: 'Stephanie Garber', category: 'Fantasy', available: true },
  { id: 'BK005', title: 'A Court of Thorns and Roses', author: 'Sarah J. Maas', category: 'Romance', available: true },
  { id: 'BK006', title: 'The Invisible Life of Addie LaRue', author: 'V.E. Schwab', category: 'Fantasy', available: true },
  { id: 'BK007', title: 'House of Salt and Sorrows', author: 'Erin A. Craig', category: 'Mystery', available: true },
  { id: 'BK008', title: 'Legendborn', author: 'Tracy Deonn', category: 'Fantasy', available: true },
]

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

// Initialize defaults if storage is empty
export function initializeStore(): void {
  if (typeof window === 'undefined') return
  if (!localStorage.getItem('books')) {
    setToStorage('books', DEFAULT_BOOKS)
  }
  if (!localStorage.getItem('students')) {
    setToStorage('students', DEFAULT_STUDENTS)
  }
  if (!localStorage.getItem('issuedBooks')) {
    setToStorage('issuedBooks', [])
  }
}

// Books
export function getBooks(): Book[] {
  return getFromStorage<Book[]>('books', DEFAULT_BOOKS)
}

export function addBook(book: Book): void {
  const books = getBooks()
  books.push(book)
  setToStorage('books', books)
}

export function updateBook(bookId: string, updates: Partial<Book>): void {
  const books = getBooks()
  const index = books.findIndex((b) => b.id === bookId)
  if (index !== -1) {
    books[index] = { ...books[index], ...updates }
    setToStorage('books', books)
  }
}

// Students
export function getStudents(): Student[] {
  return getFromStorage<Student[]>('students', DEFAULT_STUDENTS)
}

export function addStudent(student: Student): void {
  const students = getStudents()
  students.push(student)
  setToStorage('students', students)
}

export function getStudentById(id: string): Student | undefined {
  return getStudents().find((s) => s.id === id)
}

// Issued Books
export function getIssuedBooks(): IssuedBook[] {
  return getFromStorage<IssuedBook[]>('issuedBooks', [])
}

export function issueBook(bookId: string, studentId: string): void {
  const issued = getIssuedBooks()
  issued.push({
    id: `ISS${Date.now()}`,
    bookId,
    studentId,
    issueDate: new Date().toISOString(),
    returnDate: null,
    returned: false,
  })
  setToStorage('issuedBooks', issued)
  updateBook(bookId, { available: false })
}

export function returnBook(issuedBookId: string): number {
  const issued = getIssuedBooks()
  const index = issued.findIndex((ib) => ib.id === issuedBookId)
  if (index === -1) return 0

  const issuedBook = issued[index]
  const returnDate = new Date()
  const issueDate = new Date(issuedBook.issueDate)
  const diffTime = returnDate.getTime() - issueDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  // Fine: 10 INR per day after 7 days
  const fine = diffDays > 7 ? (diffDays - 7) * 10 : 0

  issued[index] = {
    ...issued[index],
    returnDate: returnDate.toISOString(),
    returned: true,
  }
  setToStorage('issuedBooks', issued)
  updateBook(issuedBook.bookId, { available: true })

  return fine
}

export function getStudentIssuedBooks(studentId: string): IssuedBook[] {
  return getIssuedBooks().filter((ib) => ib.studentId === studentId)
}

export function calculateFine(issuedBook: IssuedBook): number {
  if (issuedBook.returned) return 0
  const now = new Date()
  const issueDate = new Date(issuedBook.issueDate)
  const diffTime = now.getTime() - issueDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 7 ? (diffDays - 7) * 10 : 0
}

export function getTotalFines(): number {
  const issued = getIssuedBooks()
  return issued
    .filter((ib) => !ib.returned)
    .reduce((total, ib) => total + calculateFine(ib), 0)
}

// Auth
export function authenticateLibrarian(id: string, password: string): boolean {
  return id === 'admin' && password === 'admin'
}

export function authenticateStudent(id: string, password: string): Student | null {
  const students = getStudents()
  const student = students.find((s) => s.id === id && s.password === password)
  return student || null
}
