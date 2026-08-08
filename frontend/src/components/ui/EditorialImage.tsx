interface EditorialImageProps {
  src: string
  alt: string
  className?: string
  rounded?: boolean
  eager?: boolean
}

/**
 * A real photo styled to match the landing page's placeholder boxes
 * (rounded corners, subtle border). Used where the Figma template only had
 * an "upload a photo" slot.
 */
export function EditorialImage({
  src,
  alt,
  className = '',
  rounded = false,
  eager = false,
}: EditorialImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      className={`border border-border/70 object-cover ${
        rounded ? 'rounded-full' : 'rounded-2xl'
      } ${className}`}
    />
  )
}
