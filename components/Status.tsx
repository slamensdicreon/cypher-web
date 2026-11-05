'use client';

import { useEffect, useState } from 'react';
import { isClosed } from '@/lib/config';

export default function Status() {
  const [closed, setClosed] = useState(false);
  useEffect(() => setClosed(isClosed()), []);
  return <span className="count">{closed ? 'Selection closed' : 'Selection closes Nov 13'}</span>;
}
