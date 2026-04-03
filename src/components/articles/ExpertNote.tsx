interface ExpertNoteProps {
  children: React.ReactNode;
  label?: string;
}

export default function ExpertNote({ children, label = '현장에서 느낀 점' }: ExpertNoteProps) {
  return (
    <div className="my-6 rounded-r-lg border-l-4 border-amber-400 bg-amber-50 p-5 dark:bg-amber-950/20">
      <p className="mb-2 font-semibold text-amber-700 dark:text-amber-400">
        💡 {label}
      </p>
      <div className="text-gray-700 dark:text-gray-300">
        {children}
      </div>
      <p className="mt-3 text-sm text-gray-500">
        — 스마트에듀픽 운영자 (에듀테크 현직)
      </p>
    </div>
  );
}
