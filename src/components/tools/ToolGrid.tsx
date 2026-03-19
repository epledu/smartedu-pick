'use client';

import { useState, useMemo } from 'react';
import { aiTools, ALL_TARGETS, TARGET_EMOJI, PRICING_STYLE, BADGE_STYLE } from '@/data/ai-tools';
import type { AITool, ToolTarget } from '@/data/ai-tools';

/* ── Usage category mapping ── */
type UsageCategory = '글쓰기/문서' | '디자인/발표' | '학습/교육' | '리서치/검색' | '음악/음성' | '개발/자동화';
const USAGE_MAP: Record<string, UsageCategory> = {
  chatgpt: '글쓰기/문서', claude: '글쓰기/문서', wrtn: '글쓰기/문서', 'notion-ai': '글쓰기/문서',
  'canva-ai': '디자인/발표', gamma: '디자인/발표', miricanvas: '디자인/발표', midjourney: '디자인/발표',
  'khan-academy': '학습/교육', quizlet: '학습/교육', notebooklm: '학습/교육', 'khan-kids': '학습/교육', speak: '학습/교육', mathway: '학습/교육', diffit: '학습/교육',
  perplexity: '리서치/검색', gemini: '리서치/검색',
  suno: '음악/음성', clovanote: '음악/음성', otter: '음악/음성', autodraw: '디자인/발표',
  cursor: '개발/자동화', 'claude-code': '개발/자동화', replit: '개발/자동화', zapier: '개발/자동화',
};
const USAGE_EMOJI: Record<UsageCategory, string> = {
  '글쓰기/문서': '✍️', '디자인/발표': '🎨', '학습/교육': '📚', '리서치/검색': '🔍', '음악/음성': '🎵', '개발/자동화': '💻',
};
const ALL_USAGES: UsageCategory[] = ['글쓰기/문서', '디자인/발표', '학습/교육', '리서치/검색', '음악/음성', '개발/자동화'];

/* ── Quick Recommend mapping ── */
type QuickUse = '수업 설계' | '글쓰기' | '디자인' | '리서치' | '학습' | '자녀 교육';
const QUICK_MAP: Record<string, Record<string, string[]>> = {
  '교사용': { '수업 설계': ['chatgpt', 'claude', 'gamma'], '글쓰기': ['chatgpt', 'claude', 'wrtn'], '디자인': ['canva-ai', 'gamma', 'miricanvas'], '리서치': ['perplexity', 'gemini', 'notebooklm'], '학습': ['notebooklm', 'quizlet', 'diffit'], '자녀 교육': ['khan-kids', 'autodraw', 'speak'] },
  '학생용': { '수업 설계': ['chatgpt', 'notebooklm', 'gamma'], '글쓰기': ['chatgpt', 'claude', 'wrtn'], '디자인': ['canva-ai', 'gamma', 'miricanvas'], '리서치': ['perplexity', 'gemini', 'chatgpt'], '학습': ['khan-academy', 'quizlet', 'mathway'], '자녀 교육': ['khan-kids', 'autodraw', 'speak'] },
  '직장인용': { '수업 설계': ['chatgpt', 'gamma', 'notebooklm'], '글쓰기': ['chatgpt', 'claude', 'notion-ai'], '디자인': ['canva-ai', 'gamma', 'midjourney'], '리서치': ['perplexity', 'gemini', 'claude'], '학습': ['chatgpt', 'perplexity', 'notebooklm'], '자녀 교육': ['khan-kids', 'autodraw', 'speak'] },
  '학부모용': { '수업 설계': ['chatgpt', 'gamma', 'notebooklm'], '글쓰기': ['chatgpt', 'wrtn', 'claude'], '디자인': ['canva-ai', 'miricanvas', 'gamma'], '리서치': ['perplexity', 'gemini', 'chatgpt'], '학습': ['khan-academy', 'quizlet', 'speak'], '자녀 교육': ['khan-kids', 'autodraw', 'speak'] },
  '창작용': { '수업 설계': ['gamma', 'canva-ai', 'chatgpt'], '글쓰기': ['chatgpt', 'claude', 'wrtn'], '디자인': ['midjourney', 'canva-ai', 'miricanvas'], '리서치': ['perplexity', 'gemini', 'chatgpt'], '학습': ['notebooklm', 'chatgpt', 'perplexity'], '자녀 교육': ['khan-kids', 'autodraw', 'suno'] },
  '개발자용': { '수업 설계': ['chatgpt', 'claude', 'gamma'], '글쓰기': ['chatgpt', 'claude', 'notion-ai'], '디자인': ['canva-ai', 'gamma', 'midjourney'], '리서치': ['perplexity', 'gemini', 'claude'], '학습': ['cursor', 'claude-code', 'replit'], '자녀 교육': ['khan-kids', 'autodraw', 'speak'] },
};
const QUICK_ROLES = ['교사', '학생', '직장인', '학부모', '크리에이터', '개발자'] as const;
const QUICK_ROLE_TARGET: Record<(typeof QUICK_ROLES)[number], string> = {
  '교사': '교사용', '학생': '학생용', '직장인': '직장인용', '학부모': '학부모용', '크리에이터': '창작용', '개발자': '개발자용',
};
const QUICK_USES: QuickUse[] = ['수업 설계', '글쓰기', '디자인', '리서치', '학습', '자녀 교육'];

/* ── Tool Card ── */
function ToolCard({ tool, highlight }: { tool: AITool; highlight?: boolean }) {
  const priceStyle = PRICING_STYLE[tool.pricing];
  const badgeStyle = tool.badge ? BADGE_STYLE[tool.badge] : null;

  return (
    <div className={`group rounded-2xl border bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${highlight ? 'border-primary/40 ring-2 ring-primary/10' : 'border-border'}`}>
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{tool.emoji}</span>
          <div>
            <h3 className="text-lg font-bold text-text-primary group-hover:text-primary">{tool.name}</h3>
            <span className="text-xs text-text-secondary">{TARGET_EMOJI[tool.target]} {tool.target}</span>
          </div>
        </div>
        <span className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: priceStyle.bg, color: priceStyle.text }}>{tool.pricing}</span>
      </div>

      {/* Badge */}
      {badgeStyle && (
        <div className="mb-3">
          <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ backgroundColor: badgeStyle.bg, color: badgeStyle.color }}>{tool.badge}</span>
        </div>
      )}

      <p className="mb-3 text-sm leading-relaxed text-text-secondary">{tool.description}</p>

      <div className="mb-3 flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={`text-sm ${i < tool.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
        ))}
        <span className="ml-1 text-xs text-text-secondary">{tool.rating}/5</span>
      </div>

      <div className="mb-4 rounded-xl bg-bg p-3">
        <p className="text-xs leading-relaxed text-text-secondary">
          <span className="font-semibold text-primary">💡 전문가 한마디</span> {tool.expertTip}
        </p>
      </div>

      <a href={tool.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1 rounded-full bg-primary px-5 text-sm font-semibold text-white transition-all hover:bg-primary-dark active:scale-95">
        사이트 방문
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}

/* ── Main ── */
export default function ToolGrid() {
  const [viewMode, setViewMode] = useState<'target' | 'usage'>('target');
  const [activeFilter, setActiveFilter] = useState<ToolTarget | '전체'>('전체');
  const [quickRole, setQuickRole] = useState<(typeof QUICK_ROLES)[number]>('교사');
  const [quickUse, setQuickUse] = useState<QuickUse>('수업 설계');

  const editorPicks = aiTools.filter((t) => t.rating === 5);

  const quickResults = useMemo(() => {
    const targetKey = QUICK_ROLE_TARGET[quickRole];
    const ids = QUICK_MAP[targetKey]?.[quickUse] || [];
    return ids.map((id) => aiTools.find((t) => t.id === id)).filter(Boolean) as AITool[];
  }, [quickRole, quickUse]);

  const filteredByTarget = activeFilter === '전체' ? aiTools : aiTools.filter((t) => t.target === activeFilter);

  const groupedByUsage = useMemo(() => {
    return ALL_USAGES.map((usage) => ({
      usage,
      emoji: USAGE_EMOJI[usage],
      tools: aiTools.filter((t) => USAGE_MAP[t.id] === usage),
    })).filter((g) => g.tools.length > 0);
  }, []);

  return (
    <>
      {/* ── Quick Recommend ── */}
      <section className="mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 p-6 md:p-8">
        <h2 className="mb-4 text-lg font-bold text-text-primary md:text-xl">
          🎯 나에게 맞는 AI 도구 찾기
        </h2>
        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-text-primary">
          <span>나는</span>
          <select
            value={quickRole}
            onChange={(e) => setQuickRole(e.target.value as (typeof QUICK_ROLES)[number])}
            className="rounded-lg border border-border bg-white px-3 py-2 font-semibold text-primary focus:border-primary focus:outline-none"
          >
            {QUICK_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <span>이고</span>
          <select
            value={quickUse}
            onChange={(e) => setQuickUse(e.target.value as QuickUse)}
            className="rounded-lg border border-border bg-white px-3 py-2 font-semibold text-primary focus:border-primary focus:outline-none"
          >
            {QUICK_USES.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
          <span>에 AI를 쓰고 싶어요</span>
        </div>
        {quickResults.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-3">
            {quickResults.map((tool, i) => (
              <a key={tool.id} href={tool.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                <div>
                  <h4 className="text-sm font-bold text-text-primary group-hover:text-primary">{tool.name}</h4>
                  <p className="text-[11px] text-text-secondary">{tool.target} · {tool.pricing}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* ── Editor Picks ── */}
      <section className="mb-12">
        <h2 className="mb-1 text-xl font-bold text-text-primary">
          🏆 에디터 <span className="text-accent">픽</span>
        </h2>
        <p className="mb-5 text-sm text-text-secondary">스마트에듀픽이 가장 추천하는 도구</p>
        <div className="grid gap-5 sm:grid-cols-2">
          {editorPicks.map((tool) => (
            <ToolCard key={tool.id} tool={tool} highlight />
          ))}
        </div>
      </section>

      {/* ── View Toggle ── */}
      <div className="mb-6 flex items-center gap-2">
        <button
          onClick={() => setViewMode('target')}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${viewMode === 'target' ? 'bg-primary text-white' : 'border border-border bg-surface text-text-secondary hover:border-primary hover:text-primary'}`}
        >
          대상별 보기
        </button>
        <button
          onClick={() => setViewMode('usage')}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${viewMode === 'usage' ? 'bg-primary text-white' : 'border border-border bg-surface text-text-secondary hover:border-primary hover:text-primary'}`}
        >
          용도별 보기
        </button>
      </div>

      {/* ── Target View ── */}
      {viewMode === 'target' && (
        <>
          <div className="mb-8 flex flex-wrap gap-2">
            <button onClick={() => setActiveFilter('전체')} className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${activeFilter === '전체' ? 'bg-primary text-white' : 'border border-border bg-surface text-text-secondary hover:border-primary hover:text-primary'}`}>전체</button>
            {ALL_TARGETS.map((target) => (
              <button key={target} onClick={() => setActiveFilter(target)} className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${activeFilter === target ? 'bg-primary text-white' : 'border border-border bg-surface text-text-secondary hover:border-primary hover:text-primary'}`}>
                {TARGET_EMOJI[target]} {target}
              </button>
            ))}
          </div>
          <p className="mb-4 text-sm text-text-secondary">
            총 <strong className="text-text-primary">{filteredByTarget.length}개</strong> 도구
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {filteredByTarget.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
          </div>
        </>
      )}

      {/* ── Usage View ── */}
      {viewMode === 'usage' && (
        <div className="space-y-10">
          {groupedByUsage.map((group) => (
            <section key={group.usage}>
              <h3 className="mb-4 text-lg font-bold text-text-primary">
                {group.emoji} {group.usage} <span className="text-base font-normal text-text-secondary">({group.tools.length})</span>
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                {group.tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* ── Comparison Table ── */}
      <section className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-text-primary">📊 한눈에 비교하기</h2>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="sticky left-0 bg-bg px-4 py-3 text-left font-bold text-text-primary">도구</th>
                <th className="px-4 py-3 text-left font-bold text-text-primary">대상</th>
                <th className="px-4 py-3 text-left font-bold text-text-primary">가격</th>
                <th className="px-4 py-3 text-center font-bold text-text-primary">추천도</th>
                <th className="px-4 py-3 text-center font-bold text-text-primary">배지</th>
              </tr>
            </thead>
            <tbody>
              {aiTools.map((tool, i) => {
                const priceStyle = PRICING_STYLE[tool.pricing];
                const bStyle = tool.badge ? BADGE_STYLE[tool.badge] : null;
                return (
                  <tr key={tool.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? 'bg-surface' : 'bg-bg/50'}`}>
                    <td className="sticky left-0 px-4 py-3 font-medium text-text-primary" style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                      {tool.emoji} {tool.name}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{tool.target}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ backgroundColor: priceStyle.bg, color: priceStyle.text }}>{tool.pricing}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-yellow-400">
                      {'★'.repeat(tool.rating)}{'☆'.repeat(5 - tool.rating)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {bStyle && <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: bStyle.bg, color: bStyle.color }}>{tool.badge}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
