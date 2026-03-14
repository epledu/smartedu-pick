'use client';

import type { Question, LearningType } from '@/data/tests/learning-style';

interface QuestionCardProps {
  question: Question;
  onAnswer: (type: LearningType) => void;
  isVisible: boolean;
}

export default function QuestionCard({ question, onAnswer, isVisible }: QuestionCardProps) {
  return (
    <div
      className={`transition-all duration-400 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <h2 className="mb-8 text-center text-lg font-bold leading-relaxed text-text-primary md:text-xl">
        <span className="mb-2 block text-sm font-medium text-primary">Q{question.id}.</span>
        {question.text}
      </h2>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option.type)}
            className="group flex w-full items-center gap-4 rounded-2xl border-2 border-border bg-surface p-4 text-left transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:shadow-md active:scale-[0.98] md:p-5"
            style={{ minHeight: '52px' }}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg text-sm font-bold text-text-secondary transition-colors group-hover:bg-primary group-hover:text-white">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="text-[15px] font-medium leading-snug text-text-primary md:text-base">
              {option.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
