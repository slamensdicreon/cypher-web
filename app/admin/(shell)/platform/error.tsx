'use client';

import Link from 'next/link';

/** A platform screen that failed to draw: say so, offer a retry, and give the reference to report. */
export default function PlatformError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="wrap ad">
      <header className="ad-top">
        <div>
          <h1>That page didn’t load</h1>
          <p>Launchworks answered with something this screen didn’t expect. Nothing was changed.</p>
        </div>
      </header>
      <section className="ad-card ad-wide">
        <p className="ad-fine">{error.digest ? `Reference: ${error.digest}. Send it to the admin’s builder with the page you opened.` : error.message}</p>
        <div className="ad-actions">
          <button className="ad-btn primary" type="button" onClick={reset}>Try again</button>
          <Link className="ad-btn" href="/admin/platform">Back to Organizations</Link>
        </div>
      </section>
    </main>
  );
}
