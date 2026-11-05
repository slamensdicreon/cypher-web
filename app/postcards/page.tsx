import type { Metadata } from 'next';
import QRCode from 'qrcode';
import PrintButton from '@/components/PrintButton';
import SiteHeader from '@/components/SiteHeader';
import StaticEye from '@/components/StaticEye';
import type { RGB } from '@/lib/eyeEngine';
import { EYE, SCAN_BASE, USE_CASES, type Postcard, type Theme } from '@/lib/postcards';

const INK: RGB = [20, 20, 51];
const CORAL: RGB = [232, 85, 61];
/** The eye's ball and pupil on each card colour: coral everywhere except on coral, where it goes ink. */
const EYE_COLORS: Record<Theme, { ball: RGB; pupil: RGB }> = {
  ink: { ball: CORAL, pupil: INK },
  coral: { ball: INK, pupil: INK },
  lavender: { ball: CORAL, pupil: INK },
  white: { ball: CORAL, pupil: INK },
  violet: { ball: CORAL, pupil: INK },
};
const THEME_NAME: Record<Theme, string> = { ink: 'ink', coral: 'coral', lavender: 'lavender', white: 'white', violet: 'deep violet' };

export const metadata: Metadata = {
  title: 'Postcards | Cypher',
  description: 'The postcard campaign for Symposium. Internal.',
  robots: { index: false, follow: false },
};

/** Long lines get a smaller size so every card keeps the same rhythm. */
const size = (line: string) => (line.length <= 52 ? 's' : line.length <= 60 ? 'm' : line.length <= 66 ? 'l' : 'xl');

const qr = (id: string) =>
  QRCode.toString(`${SCAN_BASE}${id}`, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: '#141433', light: '#ffffff' },
  });

/** One card, as it prints. */
function Card({ c, code }: { c: Postcard; code: string }) {
  return (
    <div className={`pc t-${c.theme}`}>
      <div className="pc-eye">
        <span className="pc-halo" aria-hidden="true" />
        <span className="pc-well" aria-hidden="true" />
        <StaticEye id={c.id} state={EYE[c.eye]} {...EYE_COLORS[c.theme]} />
      </div>
      <h3 className={`pc-line ${size(c.line)}`}>{c.line}</h3>
      <p className="pc-pay">{c.payoff}</p>
      <div className="pc-foot">
        <div className="pc-sig">
          <b>cypher</b>
          <span className="pc-url">ignoranceisbliss.ai</span>
          <span className="pc-kick">{c.kicker}</span>
        </div>
        <div className="pc-qr" role="img" aria-label={`QR code for ${SCAN_BASE}${c.id}`} dangerouslySetInnerHTML={{ __html: code }} />
      </div>
    </div>
  );
}

/** The campaign, place by place, two versions each, as printed: 4×6 in, one per page. Not linked. */
export default async function Postcards() {
  const codes = Object.fromEntries(
    await Promise.all(USE_CASES.flatMap((u) => u.cards).map(async (c) => [c.id, await qr(c.id)] as const)),
  );

  return (
    <>
      <SiteHeader />
      <main className="wrap pc-page">
        <div className="pc-intro">
          <h1>Postcards.</h1>
          <p>
            Eleven places around the Swan and Dolphin, two versions of the card for each. Unbranded, one line each, five colours and a
            different look in the eye on every card. Every QR code carries its card’s code, so the scans say which version wins.
          </p>
          <PrintButton />
        </div>

        {USE_CASES.map((u) => (
          <section className="pc-case" key={u.n}>
            <h2>
              <span>{u.n}</span> {u.place}
            </h2>
            <div className="pc-pair">
              {u.cards.map((c, i) => (
                <figure className="pcw" key={c.id}>
                  <Card c={c} code={codes[c.id]} />
                  <figcaption>
                    <b>{i === 0 ? 'A' : 'B'}</b> · {c.id} · {EYE[c.eye].name}, on {THEME_NAME[c.theme]}
                    <br />
                    <a href={`${SCAN_BASE}${c.id}`}>{`${SCAN_BASE}${c.id}`.replace('https://', '')}</a>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
