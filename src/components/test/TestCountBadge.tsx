'use client';

import { useEffect, useState } from 'react';
import { getTestCount, formatCount } from '@/lib/test-counter';

interface TestCountBadgeProps {
  testId: string;
  duration: string;
}

export default function TestCountBadge({ testId, duration }: TestCountBadgeProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(getTestCount(testId));
  }, [testId]);

  return (
    <span className="text-xs text-text-secondary">
      {duration} {count !== null && `| ${formatCount(count)}`}
    </span>
  );
}
