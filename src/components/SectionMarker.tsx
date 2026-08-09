/*
  Court wayfinding: each section is named for the piece of court geometry the
  Gold Line quotes there. Sits in the rail, rotated, with an ink plate so the
  trunk line reads as passing behind it.
*/
export function SectionMarker({
  label,
  className = '',
}: {
  label: string
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={`mono-label absolute left-(--rail-x) z-10 -translate-x-1/2 bg-ink py-3 text-bone-dim [writing-mode:vertical-rl] ${className}`}
    >
      {label}
    </span>
  )
}
