/*
  Facility imagery. Every URL verified to resolve (HTTP 200) and visually
  inspected before inclusion. Hotlinked from the Unsplash CDN per their
  guidelines, with responsive srcsets; self host before a production launch.
*/
const unsplash = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

const srcSetFor = (id: string) =>
  [640, 960, 1280, 1600].map((w) => `${unsplash(id, w)} ${w}w`).join(', ')

export interface FacilityImage {
  src: string
  srcSet: string
  sizes: string
  alt: string
  /** false = the page's one true color break (Bahamian light) */
  graded: boolean
  caption: string
  detail: string
}

const image = (
  id: string,
  sizes: string,
  alt: string,
  graded: boolean,
  caption: string,
  detail: string,
): FacilityImage => ({
  src: unsplash(id, 1280),
  srcSet: srcSetFor(id),
  sizes,
  alt,
  graded,
  caption,
  detail,
})

export const FACILITY_IMAGES: FacilityImage[] = [
  image(
    'photo-1546519638-68e109498ffc',
    '(min-width: 768px) 70vw, 100vw',
    'A basketball drops through the net under arena lights',
    true,
    'INDOOR COURTS',
    'COMPETITION READY · BUILT TO HOST THE ISLAND',
  ),
  image(
    'photo-1517836357463-d25dfeac3438',
    '(min-width: 768px) 40vw, 100vw',
    'An athlete sets a loaded barbell on a dark training floor',
    true,
    'PERFORMANCE GYM',
    'STRENGTH · SPEED · DURABILITY',
  ),
  image(
    'photo-1591343395082-e120087004b4',
    '(min-width: 768px) 46vw, 100vw',
    'A therapist works on an athlete during an open air recovery session',
    true,
    'SPA AND RECOVERY SUITE',
    'REST TAKEN AS SERIOUSLY AS WORK',
  ),
  image(
    'photo-1519766304817-4f37bda74a26',
    '(min-width: 768px) 55vw, 100vw',
    'Young players square up at center court in front of a full crowd',
    true,
    'GATHERING SPACES',
    'GAME NIGHTS · STUDY HALLS · FAMILY ROOMS',
  ),
  image(
    'photo-1494199505258-5f95387f933c',
    '(min-width: 768px) 40vw, 100vw',
    'An outdoor hoop against a clear blue island sky',
    false,
    'OUTDOOR COURTS',
    'NASSAU LIGHT · NO FILTER',
  ),
]
