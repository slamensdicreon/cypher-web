import { ImageResponse } from 'next/og';

export const alt = 'Ignorance is bliss. Cypher, for SitecoreAI.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', gap: 72, padding: '0 96px', background: '#141433', color: '#ffffff' }}>
        <div style={{ width: 300, height: 300, borderRadius: 999, background: 'rgba(232,85,61,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="210" height="210" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="31" fill="#e8553d" />
            <path d="M18 36 Q36 20 54 36 Q36 52 18 36 Z" fill="#ffffff" />
            <circle cx="36" cy="36" r="7" fill="#141433" />
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: -4, lineHeight: 1 }}>Ignorance is bliss.</div>
          <div style={{ fontSize: 34, color: '#d6d0f5' }}>For SitecoreAI. Twenty-five companies. Closes Nov 13.</div>
        </div>
      </div>
    ),
    size,
  );
}
