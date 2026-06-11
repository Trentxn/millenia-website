/*
  The footer grounds the page in geography: this site knows where it lives.
  Top level so it lands as a contentinfo landmark. The one sanctioned use of
  the full organization name lives here.
*/
const SOCIALS = ['INSTAGRAM', 'TIKTOK', 'YOUTUBE']

export function Footer() {
  return (
    <footer className="border-t border-bone-ghost">
      <div className="flex flex-wrap items-start justify-between gap-x-12 gap-y-10 py-12 pr-[clamp(1.25rem,6vw,6rem)] pl-[calc(var(--rail-x)+clamp(1rem,4vw,4rem))] max-md:pl-[var(--rail-x)]">
        <div>
          <p className="display-tight text-2xl font-extrabold text-bone">
            THE MILLENIA MOVEMENT
          </p>
          <p className="mt-2 max-w-xs text-sm text-pretty text-bone-dim">
            A youth enrichment and community facility, in development.
          </p>
        </div>
        <address className="mono-label space-y-2 text-bone-dim not-italic">
          <p>NASSAU · NEW PROVIDENCE</p>
          <p>THE BAHAMAS</p>
          <p>25.0443 N · 77.3504 W</p>
        </address>
        <div>
          <ul className="mono-label space-y-2 text-bone-dim">
            {SOCIALS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="mono-label mt-4 !text-[0.6rem] text-bone-dim/70">
            HANDLES DROP AT LAUNCH
          </p>
        </div>
      </div>
      <p className="mono-label pb-8 pl-[calc(var(--rail-x)+clamp(1rem,4vw,4rem))] !text-[0.6rem] text-bone-dim/70 max-md:pl-[var(--rail-x)]">
        © 2026 MILLENIA · BUILT WITH BAHAMIAN PRIDE
      </p>
    </footer>
  )
}
