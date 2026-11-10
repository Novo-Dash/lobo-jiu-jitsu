import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import { BookingProvider, BookPage } from './nd'
import './index.css'
import { grainDataUrl } from './components/footer/tear'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
// /v2: the white sections take the footer's paper grain
if (document.documentElement.classList.contains('v2')) document.documentElement.style.setProperty('--grain', `url(${grainDataUrl()})`)

// The prerendered HTML is hydrated, not replaced: the hero photo (the LCP) and the CSS entrance stay
// the same nodes. Anything that reads the clock waits for an effect (schedule, footer).
// /book is the kit's booking page alone (dist/book/index.html is an empty shell): rendered from scratch.
const root = document.getElementById('root')!
const isBook = location.pathname.replace(/\/$/, '') === '/book'
const app = isBook
  ? <StrictMode><BookPage /></StrictMode>
  : (
    <StrictMode>
      <BookingProvider>
        <App />
      </BookingProvider>
    </StrictMode>
  )
if (root.firstElementChild && !isBook) hydrateRoot(root, app)
else { root.textContent = ''; createRoot(root).render(app) }
