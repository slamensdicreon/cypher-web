import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';

/** The eye for email headers, as a PNG (email clients don't show SVG). */
export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
        <svg width="80" height="80" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="31" fill="#e8553d" />
          <path d="M18 36 Q36 20 54 36 Q36 52 18 36 Z" fill="#ffffff" />
          <circle cx="36" cy="36" r="7" fill="#141433" />
        </svg>
      </div>
    ),
    { width: 80, height: 80 },
  );
}
