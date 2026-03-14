export default function AdSlot({ className = '' }: { className?: string }) {
  return (
    <div
      className={`mx-auto flex min-h-[100px] max-w-3xl items-center justify-center rounded-xl border-2 border-dashed border-border bg-bg/50 text-sm text-text-secondary ${className}`}
    >
      <span>광고 영역 (애드센스 승인 후 활성화)</span>
    </div>
  );
}
