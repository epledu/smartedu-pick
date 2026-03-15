import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-extrabold text-primary">404</h1>
        <h2 className="mb-4 text-xl font-bold text-text-primary">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="mb-8 text-text-secondary">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-white transition-all hover:bg-primary-hover active:scale-95"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/test"
            className="inline-flex h-11 items-center rounded-full border-2 border-primary px-6 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-white active:scale-95"
          >
            테스트 해보기
          </Link>
        </div>
      </div>
    </div>
  );
}
