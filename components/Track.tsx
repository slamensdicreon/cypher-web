'use client';

import { useEffect } from 'react';
import { track } from '@/lib/track';

/** Counts a page view. Placed only on the public pages. */
export default function Track() {
  useEffect(() => {
    track('view');
  }, []);
  return null;
}
