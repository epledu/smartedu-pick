'use client';

import { categories } from '@/data/categories';

interface CategoryFilterProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect('all')}
        className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
          selected === 'all'
            ? 'bg-primary text-white shadow-sm'
            : 'bg-surface text-text-secondary hover:bg-primary/10 hover:text-primary border border-border'
        }`}
      >
        전체
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
            selected === cat.id
              ? 'bg-primary text-white shadow-sm'
              : 'bg-surface text-text-secondary hover:bg-primary/10 hover:text-primary border border-border'
          }`}
        >
          {cat.emoji} {cat.label}
        </button>
      ))}
    </div>
  );
}
