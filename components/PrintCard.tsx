import QRCode from 'qrcode';
import StaticEye from '@/components/StaticEye';
import { EYE_COLORS } from '@/lib/cardStyle';
import { EYE, SCAN_BASE, USE_CASES, type Postcard } from '@/lib/postcards';

export { THEME_NAME } from '@/lib/cardStyle';

/** Long lines get a smaller size so every card keeps the same rhythm. */
const size = (line: string) => (line.length <= 52 ? 's' : line.length <= 60 ? 'm' : line.length <= 66 ? 'l' : 'xl');

/** Keeps hyphenated words (twenty-six, $400,000+) from breaking across lines. */
const keep = (text: string) =>
  text.split(/(\S+-\S+)/).map((part, i) => (i % 2 ? <span className="nw" key={i}>{part}</span> : part));

/** Every card's QR code, as SVG, keyed by card id. Generated on the server at build. */
export async function qrCodes(): Promise<Record<string, string>> {
  const all = USE_CASES.flatMap((u) => u.cards);
  const svgs = await Promise.all(
    all.map((c) =>
      QRCode.toString(`${SCAN_BASE}${c.id}`, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#141433', light: '#ffffff' } }),
    ),
  );
  return Object.fromEntries(all.map((c, i) => [c.id, svgs[i]]));
}

/**
 * One card, as it prints. `postcard` is 4×6 in; `trading` is a 2.5×3.5 in trading card. Everything
 * inside is sized off the card's width, so both formats come from the same layout.
 */
export function PrintCard({ c, code, format = 'postcard' }: { c: Postcard; code: string; format?: 'postcard' | 'trading' }) {
  return (
    <div className={`pc t-${c.theme}${format === 'trading' ? ' tc' : ''}`}>
      <div className="pc-eye">
        <span className="pc-halo" aria-hidden="true" />
        <span className="pc-well" aria-hidden="true" />
        <StaticEye id={`${c.id}-${format}`} state={EYE[c.eye]} {...EYE_COLORS[c.theme]} />
      </div>
      <h3 className={`pc-line ${size(c.line)}`}>{keep(c.line)}</h3>
      <p className="pc-pay">{keep(c.payoff)}</p>
      <div className="pc-foot">
        <div className="pc-sig">
          <b>cypher</b>
          <span className="pc-url">ignoranceisbliss.ai</span>
          <span className="pc-kick">{keep(c.kicker)}</span>
        </div>
        <div className="pc-qr" role="img" aria-label={`QR code for ${SCAN_BASE}${c.id}`} dangerouslySetInnerHTML={{ __html: code }} />
      </div>
    </div>
  );
}
