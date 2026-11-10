import type { CSSProperties } from 'react'
import type { Img } from '../../types'

type Props = {
  photo: Img
  className?: string
  sizes?: string
  eager?: boolean
  alt?: string // override: '' when the photo sits next to a caption that already says it
  style?: CSSProperties
}

/** <img> with its real width/height (PRD 15), lazy below the fold, srcset when a -sm variant exists. */
export function Photo({ photo, className, sizes, eager, alt, style }: Props) {
  const srcSet = photo.sm ? `${photo.src.replace(/\.webp$/, '-sm.webp')} ${photo.sm}w, ${photo.src} ${photo.w}w` : undefined
  return (
    <img
      className={className}
      src={photo.src}
      srcSet={srcSet}
      sizes={srcSet ? sizes ?? '100vw' : undefined}
      width={photo.w}
      height={photo.h}
      alt={alt ?? photo.alt}
      loading={eager ? undefined : 'lazy'}
      decoding={eager ? undefined : 'async'}
      fetchPriority={eager ? 'high' : undefined}
      style={style}
    />
  )
}
