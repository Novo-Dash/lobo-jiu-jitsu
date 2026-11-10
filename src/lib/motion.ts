/**
 * Motion is on unless the visitor asked for less (html.still, set before paint by index.html).
 * Read inside effects only: on the server and in the first render the page is the motion layout.
 */
export const motionOK = () => typeof document !== 'undefined' && !document.documentElement.classList.contains('still')
