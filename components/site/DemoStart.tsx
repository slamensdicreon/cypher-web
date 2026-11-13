'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { track } from '@/lib/track';

/** The small start of a demo request: a work email, then on to the demo page with it filled in. */
export default function DemoStart({ label }: { label: string }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  return (
    <form
      className="demo-start-form"
      onSubmit={(e) => {
        e.preventDefault();
        track('cta', { label });
        router.push(email.trim() ? `/demo?email=${encodeURIComponent(email.trim())}#book` : '/demo#book');
      }}
    >
      <label className="sr" htmlFor={`ds-${label}`}>Work email</label>
      <input
        id={`ds-${label}`}
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@yourcompany.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit" className="site-cta big">Book a demo</button>
    </form>
  );
}
