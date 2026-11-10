export type IconName = 'phone' | 'pin' | 'mail' | 'ig' | 'fb' | 'go' | 'prev' | 'up' | 'copy' | 'arrow' | 'wave' | 'close' | 'g'

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return <svg className={className} aria-hidden="true" focusable="false"><use href={`#i-${name}`} /></svg>
}
