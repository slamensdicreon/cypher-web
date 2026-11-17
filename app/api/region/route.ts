export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/** The EEA, the UK and Switzerland: visitors here get no analytics cookies (see the privacy page). */
const EUROPE = new Set(['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH']);

/**
 * Whether this visitor is in Europe, from the country our host derives from the connection. Google's
 * tag can't work out the region through this Tag Manager container, so the site sets consent itself.
 * Only a yes or no goes back; nothing is stored. An unknown country counts as Europe.
 */
export function GET(req: Request) {
  const country = (req.headers.get('x-vercel-ip-country') || '').toUpperCase();
  return Response.json({ europe: !country || EUROPE.has(country) }, { headers: { 'cache-control': 'private, no-store' } });
}
