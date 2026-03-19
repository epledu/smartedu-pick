'use client';

import { useEffect, useState } from 'react';
import { getTestCount } from '@/lib/test-counter';

interface TestParticipantsProps {
  testId: string;
}

export default function TestParticipants({ testId }: TestParticipantsProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(getTestCount(testId));
  }, [testId]);

  if (count === null) return null;

  return (
    <p className="mt-3 text-sm text-text-secondary">
      지금까지 <strong className="text-primary">{count.toLocaleString()}</strong>명이 참여했어요
    </p>
  );
}
