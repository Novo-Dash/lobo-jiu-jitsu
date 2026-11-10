import { Icon } from './Icon'

/** Yellow square 48px, radius 12, the arrow tilted 45°; on the card's hover it shifts and the arrow advances. */
export function SquareArrow() {
  return <span className="sq" aria-hidden="true"><Icon name="go" /></span>
}
