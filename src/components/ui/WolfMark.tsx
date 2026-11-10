/** The wolf of the logo, vectorised from the PNG (PRD 8.8) until the client sends the SVG. [CONFIRMAR logo SVG] */
export const WOLF_PATH = 'M232.8 5.5 L171.1 28.1 L149.1 24.0 L96.6 46.9 L59.6 60.2 L60.1 65.0 L19.0 71.9 L45.5 101.4 L9.9 117.2 L9.5 118.6 L93.0 179.6 L155.4 177.9 L155.8 177.0 L143.4 146.2 L99.6 166.0 L37.6 123.0 L100.5 148.2 L151.1 126.8 L167.9 181.0 L199.5 190.0 L199.9 112.6 L229.9 87.4 L232.2 73.8 L181.9 76.9 L183.6 73.9 L200.4 58.5 L133.8 75.0 L131.2 74.4 L151.9 31.1 L167.5 32.1 L154.2 44.2 L154.9 44.8 L218.1 21.2 L229.0 40.0 L189.0 73.8 L214.2 70.2 L216.4 62.2 L221.8 69.9 L228.2 69.6 L234.9 38.4Z M141.5 112.2 L78.5 119.6 L116.1 87.5 L117.1 88.8 L114.6 102.9 L115.4 104.4Z M68.6 82.4 L36.6 74.9 L62.4 68.8Z'

export function WolfMark({ className, id }: { className?: string; id?: string }) {
  return <svg className={className} id={id} viewBox="0 0 240 198" aria-hidden="true" focusable="false"><use href="#wolf" /></svg>
}
