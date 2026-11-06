import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';

export const metadata: Metadata = { title: 'Unsubscribe | Cypher', robots: { index: false, follow: false } };

/** Asks before unsubscribing, so link scanners in mail security tools can't unsubscribe people by accident. */
export default async function Unsubscribe({ searchParams }: { searchParams: Promise<{ t?: string; done?: string; bad?: string }> }) {
  const sp = await searchParams;
  return (
    <>
      <SiteHeader />
      <main className="wrap legal">
        <div className="legal-head">
          {sp.done ? (
            <>
              <h1>Done.</h1>
              <p>You won’t get any more emails from Cypher. Ignorance is bliss.</p>
            </>
          ) : sp.bad || !sp.t ? (
            <>
              <h1>That link didn’t work.</h1>
              <p>Use the unsubscribe link in the email itself, or reply to it and we’ll take you off.</p>
            </>
          ) : (
            <>
              <h1>Unsubscribe?</h1>
              <p>One click and Cypher stops emailing you.</p>
              <form method="post" action="/api/unsubscribe" style={{ marginTop: 28 }}>
                <input type="hidden" name="t" value={sp.t} />
                <button className="btn" type="submit" style={{ width: 'auto', padding: '16px 28px', background: '#e8553d' }}>Unsubscribe me</button>
              </form>
            </>
          )}
        </div>
      </main>
    </>
  );
}
