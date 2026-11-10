import { WOLF_PATH } from './WolfMark'

/**
 * The page's icons, drawn for Lobo (PRD 8.9: no icon library). One sprite, used by <Icon>/<WolfMark>.
 * Stroke 1.9 on the 24-grid, 2 on the 32-grid, round joins: the same hand as the wolf's facets.
 */
export function Sprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <symbol id="wolf" viewBox="0 0 240 198"><path fill="currentColor" fillRule="evenodd" d={WOLF_PATH} /></symbol>
      <symbol id="i-phone" viewBox="0 0 24 24"><path d="M6.6 3.5h3l1.6 4.2-2 1.4a11 11 0 0 0 5.7 5.7l1.4-2 4.2 1.6v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z" stroke="currentColor" strokeWidth="1.9" fill="none" strokeLinejoin="round" /></symbol>
      <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" stroke="currentColor" strokeWidth="1.9" fill="none" /><circle cx="12" cy="9.5" r="2.4" fill="currentColor" /></symbol>
      <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.9" fill="none" /><path d="m4.5 7 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.9" fill="none" /></symbol>
      <symbol id="i-ig" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.9" fill="none" /><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.9" fill="none" /><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" /></symbol>
      <symbol id="i-fb" viewBox="0 0 24 24"><path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4a21 21 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v2.1H7.7v3h2.6V21" fill="currentColor" /></symbol>
      <symbol id="i-go" viewBox="0 0 24 24"><path d="M5 12h13M13 6.5 18.5 12 13 17.5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></symbol>
      <symbol id="i-prev" viewBox="0 0 24 24"><path d="M19 12H6M11 6.5 5.5 12l5.5 5.5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></symbol>
      <symbol id="i-up" viewBox="0 0 24 24"><path d="M14.5 5.5 8 12l6.5 6.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></symbol>
      <symbol id="i-copy" viewBox="0 0 24 24"><path d="M13.5 4.5H7A2.5 2.5 0 0 0 4.5 7v10A2.5 2.5 0 0 0 7 19.5h10a2.5 2.5 0 0 0 2.5-2.5v-6.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /><circle cx="18.5" cy="5.5" r="2.3" stroke="currentColor" strokeWidth="1.8" fill="none" /></symbol>
      <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h13M13 6.5 18.5 12 13 17.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></symbol>
      <symbol id="i-wave" viewBox="0 0 24 24"><path d="M3.5 15c1.8-3.2 3.6-3.2 5.4 0s3.6 3.2 5.4 0 3.6-3.2 5.4 0" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" /></symbol>
      <symbol id="i-close" viewBox="0 0 16 16"><path d="M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="2" /></symbol>
      <symbol id="i-g" viewBox="0 0 24 24">
        <path d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.7h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" style={{ fill: 'var(--color-g-blue)' }} />
        <path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z" style={{ fill: 'var(--color-g-green)' }} />
        <path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2z" style={{ fill: 'var(--color-g-yellow)' }} />
        <path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.4 3-4.1 5.6-4.1z" style={{ fill: 'var(--color-g-red)' }} />
      </symbol>
    </svg>
  )
}
