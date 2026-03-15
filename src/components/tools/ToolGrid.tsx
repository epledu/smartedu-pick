'use client';

import { useState } from 'react';
import { aiTools, ALL_TARGETS, TARGET_EMOJI, PRICING_STYLE } from '@/data/ai-tools';
import type { ToolTarget } from '@/data/ai-tools';

export default function ToolGrid() {
  const [activeFilter, setActiveFilter] = useState<ToolTarget | '전체'>('전체');

  const filtered = activeFilter === '전체'
    ? aiTools
    : aiTools.filter((t) => t.target === activeFilter);

  return (
    <>
      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter('전체')}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            activeFilter === '전체'
              ? 'bg-primary text-white'
              : 'border border-border bg-surface text-text-secondary hover:border-primary hover:text-primary'
          }`}
        >
          전체
        </button>
        {ALL_TARGETS.map((target) => (
          <button
            key={target}
            onClick={() => setActiveFilter(target)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              activeFilter === target
                ? 'bg-primary text-white'
                : 'border border-border bg-surface text-text-secondary hover:border-primary hover:text-primary'
            }`}
          >
            {TARGET_EMOJI[target]} {target}
          </button>
        ))}
      </div>

      {/* Tool Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {filtered.map((tool) => {
          const priceStyle = PRICING_STYLE[tool.pricing];
          return (
            <div
              key={tool.id}
              className="group rounded-2xl border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              {/* Header */}
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{tool.emoji}</span>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary group-hover:text-primary">
                      {tool.name}
                    </h3>
                    <span className="text-xs text-text-secondary">
                      {TARGET_EMOJI[tool.target]} {tool.target}
                    </span>
                  </div>
                </div>
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{ backgroundColor: priceStyle.bg, color: priceStyle.text }}
                >
                  {tool.pricing}
                </span>
              </div>

              {/* Description */}
              <p className="mb-3 text-sm leading-relaxed text-text-secondary">
                {tool.description}
              </p>

              {/* Rating */}
              <div className="mb-3 flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${i < tool.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                  >
                    ★
                  </span>
                ))}
                <span className="ml-1 text-xs text-text-secondary">{tool.rating}/5</span>
              </div>

              {/* Expert Tip */}
              <div className="mb-4 rounded-xl bg-bg p-3">
                <p className="text-xs leading-relaxed text-text-secondary">
                  <span className="font-semibold text-primary">💡 전문가 한마디</span>{' '}
                  {tool.expertTip}
                </p>
              </div>

              {/* CTA */}
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-1 rounded-full bg-primary px-5 text-sm font-semibold text-white transition-all hover:bg-primary-hover active:scale-95"
              >
                사이트 방문
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          );
        })}
      </div>
    </>
  );
}
