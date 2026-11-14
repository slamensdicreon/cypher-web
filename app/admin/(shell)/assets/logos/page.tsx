import { AssetsHead, Dl, FILES } from '@/components/admin/assets/parts';
import { requireUser } from '@/lib/auth/request';

const L = `${FILES}/logos`;
const LOGOS = [
  { file: 'cypher-logo-for-light-backgrounds', name: 'Logo', note: 'Mark and wordmark, stacked. On white or light colours.', bg: 'light' },
  { file: 'cypher-logo-for-dark-backgrounds', name: 'Logo, reversed', note: 'For ink and dark colours.', bg: 'dark' },
  { file: 'cypher-logo-horizontal-for-light-backgrounds', name: 'Horizontal logo', note: 'Mark beside the wordmark, for headers and footers.', bg: 'light' },
  { file: 'cypher-logo-horizontal-for-dark-backgrounds', name: 'Horizontal logo, reversed', note: 'For ink and dark colours.', bg: 'dark' },
  { file: 'cypher-mark-eye', name: 'The eye', note: 'The mark on its own, awake. Avatars, favicons, stickers.', bg: 'light' },
  { file: 'cypher-mark-resting-for-light-backgrounds', name: 'Resting mark', note: 'The eye closed in a smile. Quiet places.', bg: 'light' },
  { file: 'cypher-mark-resting-for-dark-backgrounds', name: 'Resting mark, reversed', note: 'For ink and dark colours.', bg: 'dark' },
] as const;

const COLOURS = [
  { name: 'Ink', hex: '#141433', use: 'The ground. Text on light colours.' },
  { name: 'Coral', hex: '#e8553d', use: 'The eye, the one action on a page.' },
  { name: 'Lavender', hex: '#dcd6f6', use: 'Soft panels and bands.' },
  { name: 'Iris', hex: '#6b4ee6', use: 'Launchworks’ colour; the sixth card.' },
  { name: 'Deep violet', hex: '#2c2c5a', use: 'Cards and panels on ink.' },
  { name: 'Bliss', hex: '#f6f5fc', use: 'Light pages.' },
  { name: 'White', hex: '#ffffff', use: 'Text on ink; light cards.' },
] as const;

/** The logo files, colours and type: everything to make something look like Cypher. */
export default async function Logos() {
  await requireUser('assets', 'read', '/admin/assets/logos');
  return (
    <main className="wrap ad">
      <AssetsHead on="/admin/assets/logos" title="Logos & brand" actions={<Dl href={`${L}/cypher-logos.zip`} primary>All logos (ZIP)</Dl>}>
        Transparent SVG and PNG. Use the reversed versions on ink and dark colours. No Icreon on the label: Cypher stands on its own.
      </AssetsHead>

      <section className="as-grid as-logos">
        {LOGOS.map((l) => (
          <figure key={l.file} className="as-item">
            <div className={`as-swatch bg-${l.bg}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${L}/${l.file}.svg`} alt={l.name} loading="lazy" />
            </div>
            <figcaption>
              <b>{l.name}</b>
              <span className="ad-dim">{l.note}</span>
              <span className="as-dls"><Dl href={`${L}/${l.file}.svg`}>SVG</Dl><Dl href={`${L}/${l.file}.png`}>PNG</Dl></span>
            </figcaption>
          </figure>
        ))}
      </section>

      <section className="ad-card ad-wide">
        <h3>Colours</h3>
        <ul className="as-colours">
          {COLOURS.map((c) => (
            <li key={c.hex}>
              <span className="as-chip" style={{ background: c.hex }} />
              <span><b>{c.name}</b> <code>{c.hex}</code><br /><span className="ad-dim">{c.use}</span></span>
            </li>
          ))}
        </ul>
      </section>

      <div className="ad-grid2">
        <section className="ad-card">
          <h3>Type</h3>
          <p className="as-type-voice">Plus Jakarta Sans Light, for Cypher’s voice. <b>Bold for what’s yours.</b></p>
          <p className="as-type-md">ExtraBold for the wordmark only; Medium for small text and labels.</p>
          <p className="ad-fine">Free under the SIL Open Font License.</p>
          <div className="ad-actions"><Dl href={`${FILES}/fonts/cypher-fonts.zip`}>Fonts (ZIP)</Dl></div>
        </section>
        <section className="ad-card">
          <h3>How it talks</h3>
          <ul className="as-voice">
            <li><b>Talk to the marketer.</b> The person growing a brand on Sitecore, Optimizely or Contentful: their roadmap, their campaigns, their team editing on day one.</li>
            <li><b>The line:</b> Your whole marketing roadmap, live in a week. You make three decisions.</li>
            <li><b>Cypher speaks in the first person, in sentences.</b> Light for the voice, bold for the part that’s yours. No eyebrows, no jargon.</li>
            <li><b>Any enterprise platform.</b> Name Sitecore, Optimizely and Contentful; never “a Sitecore product”. Never name a competitor or an agency.</li>
            <li><b>Figures say where they came from.</b> $512 is the cost of the run, not the price of Cypher. Hours are customer-reported; the dollar conversion is ours.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
