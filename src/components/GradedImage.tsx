/*
  Brand image treatment: ink/bone monochrome grade applied as a static CSS
  filter (painted once, never animated). The one ungraded image on the page
  is the true color Bahamian light break in the facility section; it gets a
  gentle warm pull so even the surprise belongs to the page's temperature.
*/
interface GradedImageProps {
  src: string
  alt: string
  srcSet?: string
  sizes?: string
  graded?: boolean
  className?: string
  imgClassName?: string
  eager?: boolean
}

export function GradedImage({
  src,
  alt,
  srcSet,
  sizes,
  graded = true,
  className = '',
  imgClassName = '',
  eager = false,
}: GradedImageProps) {
  return (
    <div className={`overflow-hidden bg-ink-2 ${className}`}>
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`h-full w-full object-cover ${
          graded
            ? '[filter:grayscale(1)_sepia(0.16)_brightness(0.82)_contrast(1.12)]'
            : '[filter:saturate(0.82)_sepia(0.06)_brightness(0.96)]'
        } ${imgClassName}`}
      />
    </div>
  )
}
