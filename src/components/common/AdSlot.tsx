'use client';

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  responsive?: boolean;
  className?: string;
}

export default function AdSlot({ slot, format = 'auto', responsive = true, className = '' }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (!adClientId || !slot || !adRef.current) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded
    }
  }, [adClientId, slot]);

  // No AdSense ID → render nothing (pre-approval)
  if (!adClientId || !slot) return null;

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
