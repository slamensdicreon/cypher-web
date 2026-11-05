'use client';

import { useEffect } from 'react';
import { matrixRain } from '@/lib/matrix';

/** For whoever opens the console: a frame of falling code, and a nudge back to the form. */
export default function WakeUp() {
  useEffect(() => {
    const art = matrixRain(64, 18, ['wake up.', '', 'there is no spoon.'], 1311);
    console.log(`%c${art}`, 'font-family:ui-monospace,Menlo,monospace;font-size:12px;line-height:1.15;color:#3dff7a;background:#020a04;padding:14px 18px');
    console.log('%cthere is no spoon.', 'font:800 26px system-ui,sans-serif;letter-spacing:-.03em;color:#e8553d');
    console.log('%cYou found the console. Now find the form: https://www.ignoranceisbliss.ai/#join', 'font:600 13px system-ui,sans-serif;color:#b7a6ff');
  }, []);
  return null;
}
