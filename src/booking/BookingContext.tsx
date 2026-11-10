import { createContext, lazy, Suspense, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { BookingIntent } from '../types'
import { track } from '../lib/track'

type Ctx = { isOpen: boolean; intent: BookingIntent | null; open: (i: BookingIntent) => void; close: () => void }
const BookingCtx = createContext<Ctx>({ isOpen: false, intent: null, open: () => {}, close: () => {} })

// The sheet is its own chunk: the first paint never pays for Base UI or the form.
const BookingDialog = lazy(() => import('./BookingDialog'))

export function BookingProvider({ children }: { children: ReactNode }) {
  const [intent, setIntent] = useState<BookingIntent | null>(null)
  const [isOpen, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const open = useCallback((i: BookingIntent) => {
    setIntent(i); setMounted(true); setOpen(true)
    track.bookingOpen(i.source)
  }, [])
  const close = useCallback(() => setOpen(false), [])
  const value = useMemo(() => ({ isOpen, intent, open, close }), [isOpen, intent, open, close])
  return (
    <BookingCtx.Provider value={value}>
      {children}
      {mounted && <Suspense fallback={null}><BookingDialog /></Suspense>}
    </BookingCtx.Provider>
  )
}

export const useBooking = () => useContext(BookingCtx)
