import type { Metadata } from 'next';
import QRCode from 'qrcode';
import PrintButton from '@/components/PrintButton';
import SiteHeader from '@/components/SiteHeader';
import StaticEye from '@/components/StaticEye';
import type { RGB } from '@/lib/eyeEngine';
import { EYE, POSTCARDS, SCAN_BASE, type Theme } from '@/lib/postcards';

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
const size = (line: string) => (line.length <= 52 ? 's' : line.length <= 60 ? 'm' : 'l');

/** The campaign, card by card, as it will be printed: 4×6 in, one per page. Not linked from the site. */
export default async function Postcards() {
  const cards = await Promise.all(
    POSTCARDS.map(async (c) => ({
      ...c,
      url: `${SCAN_BASE}${c.id}`,
      qr: await QRCode.toString(`${SCAN_BASE}${c.id}`, {
        type: 'svg',
        margin: 0,
        errorCorrectionLevel: 'M',
        color: { dark: '#141433', light: '#ffffff' },
      }),
    })),
  );

  return (
    <>
      <SiteHeader />
      <main className="wrap pc-page">
        <div className="pc-intro">
          <h1>Postcards.</h1>
          <p>
            Ten cards for the Swan and Dolphin. Unbranded, one line each, five colours and a different look in the eye on every card, left where people stop. Every QR code carries its card’s
            code, so each submission says which card earned it. Every card names SitecoreAI and the close date.
          </p>
          <PrintButton />
        </div>

        <div className="pc-grid">
          {cards.map((c) => (
            <figure className="pcw" key={c.id}>
              <div className={`pc t-${c.theme}`}>
                <div className="pc-eye">
                  <span className="pc-halo" aria-hidden="true" />
                  <span className="pc-well" aria-hidden="true" />
                  <StaticEye id={c.id} state={EYE[c.eye]} {...EYE_COLORS[c.theme]} />
                </div>
                <h2 className={`pc-line ${size(c.line)}`}>{c.line}</h2>
                <p className="pc-pay">{c.payoff}</p>
                <div className="pc-foot">
                  <div className="pc-sig">
                    <b>cypher</b>
                    <span className="pc-meta">25 SitecoreAI builds. Closes Nov 13.</span>
                    <span className="pc-url">ignoranceisbliss.ai</span>
                    <span className="pc-kick">{c.kicker}</span>
                  </div>
                  <div className="pc-qr" role="img" aria-label={`QR code for ${c.url}`} dangerouslySetInnerHTML={{ __html: c.qr }} />
                </div>
              </div>
              <figcaption>
                <b>{c.id}</b> · {c.place}
                <br />
                {EYE[c.eye].name}, on {THEME_NAME[c.theme]}
                <br />
                <a href={c.url}>{c.url.replace('https://', '')}</a>
              </figcaption>
            </figure>
          ))}
        </div>
      </main>
    </>
  );
}
