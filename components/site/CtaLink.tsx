'use client';

import Link from 'next/link';
import { track } from '@/lib/track';

/** A call to action that counts its clicks (by label and page) before it goes. */
export default function CtaLink({ href, label, className, children }: { href: string; label: string; className?: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={className} onClick={() => track('cta', { label })}>
      {children}
    </Link>
  );
}
