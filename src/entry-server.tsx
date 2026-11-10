/**
 * Server entry for the prerender (scripts/prerender.mjs), built with `vite build --ssr`.
 * Renders the page to static HTML for crawlers, AI bots and link previews; the browser hydrates it.
 */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { BookingProvider } from './booking/BookingContext'

export { jsonLd, llms, SEO } from './data/seo'

export const render = () => renderToString(
  <StrictMode>
    <BookingProvider>
      <App />
    </BookingProvider>
  </StrictMode>,
)
