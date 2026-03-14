'use client';

import type { ChildTypeInfo } from '@/data/tests/child-type';

interface ParentActionGuideProps {
  typeInfo: ChildTypeInfo;
}

export default function ParentActionGuide({ typeInfo }: ParentActionGuideProps) {
  return (
    <section>
      <h2 className="mb-6 text-xl font-bold text-text-primary">
        👨‍👩‍👧 부모 가이드
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {/* DO List */}
        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5 md:p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm text-white">
              ✓
            </span>
            이렇게 해주세요
          </h3>
          <ul className="space-y-3">
            {typeInfo.doList.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-emerald-800">
                <span className="mt-0.5 shrink-0 text-emerald-500">✅</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* DON'T List */}
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-5 md:p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-red-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm text-white">
              ✕
            </span>
            이것은 피해주세요
          </h3>
          <ul className="space-y-3">
            {typeInfo.dontList.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-red-800">
                <span className="mt-0.5 shrink-0 text-red-500">❌</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
