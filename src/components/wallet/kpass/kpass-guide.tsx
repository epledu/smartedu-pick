"use client";

/**
 * KPassGuide — expandable guide section explaining K-Pass registration,
 * integration with this app, and FAQ.
 */
import React, { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Guide sections content
// ---------------------------------------------------------------------------

const STEPS = [
  "K-패스 공식 홈페이지 또는 제휴 카드사(BC카드, 신한카드, 우리카드 등) 방문",
  "K-패스 카드 신청 (기존 카드에 K-패스 기능 추가도 가능)",
  "카드 수령 후 K-패스 공식 앱에서 회원가입",
  "이용 후 다음달 환급금 지급",
];

const FAQ_ITEMS = [
  {
    q: "청년 유형은 언제까지 적용되나요?",
    a: "만 19~34세 청년에게 적용됩니다. 나이 기준은 신청 시점 기준이며, 카드사별로 확인이 필요합니다.",
  },
  {
    q: "환급은 어떻게 받나요?",
    a: "다음 달 K-패스 카드 청구 금액에서 차감되거나, 별도 계좌로 입금됩니다. 카드사마다 방식이 다를 수 있습니다.",
  },
  {
    q: "월 60회 이상 이용 시 어떻게 되나요?",
    a: "환급은 최대 60회 이용분까지만 인정됩니다. 60회를 초과한 이용분은 환급에 포함되지 않습니다.",
  },
  {
    q: "환급률은 어떻게 결정되나요?",
    a: "일반 20%, 청년(만 19~34세) 30%, 저소득(기초·차상위) 53% 환급률이 적용됩니다.",
  },
];

function buildSections(): Section[] {
  return [
    {
      id: "about",
      title: "K-패스란?",
      content: (
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            K-패스는 정부에서 운영하는 대중교통 환급 사업입니다. 월 15회 이상
            대중교통을 이용하면 결제 금액의 <strong>20~53%</strong>를 돌려받을 수 있습니다.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-500">
            <li>월 최대 60회 이용분 환급 인정</li>
            <li>일반 20% / 청년(19~34세) 30% / 저소득 53%</li>
            <li>버스, 지하철, 광역철도 모두 적용</li>
          </ul>
          <a
            href="https://korea-pass.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium"
          >
            K-패스 공식 사이트
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      ),
    },
    {
      id: "signup",
      title: "K-패스 카드 발급받기",
      content: (
        <ol className="space-y-2">
          {STEPS.map((step, idx) => (
            <li key={idx} className="flex gap-2.5 text-sm text-gray-600">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                {idx + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      ),
    },
    {
      id: "integration",
      title: "이 앱과 어떻게 연결되나요?",
      content: (
        <div className="text-sm text-gray-600 space-y-3">
          <p>
            현재는 <strong>수동 입력</strong> 방식입니다. 대중교통 지출을
            &quot;교통&quot; 카테고리로 기록하면 K-패스 환급 계산에 자동으로 반영됩니다.
          </p>
          <div className="space-y-1.5">
            <p className="font-semibold text-gray-700 text-xs uppercase tracking-wide">
              자동 연동 로드맵
            </p>
            {[
              { phase: "Phase 1 (현재)", desc: "수동 입력 기반 환급 예측" },
              { phase: "Phase 2", desc: "오픈뱅킹 연동 — 카드 거래 자동 수집" },
              { phase: "Phase 3", desc: "K-패스 공식 API — 실시간 환급 현황 조회" },
            ].map(({ phase, desc }) => (
              <div key={phase} className="flex gap-2 text-xs text-gray-500">
                <span className="font-medium text-indigo-600 w-36 flex-shrink-0">
                  {phase}
                </span>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "faq",
      title: "자주 묻는 질문 (FAQ)",
      content: (
        <dl className="space-y-3">
          {FAQ_ITEMS.map(({ q, a }) => (
            <div key={q}>
              <dt className="text-sm font-semibold text-gray-700">Q. {q}</dt>
              <dd className="text-sm text-gray-500 mt-0.5 ml-3">{a}</dd>
            </div>
          ))}
        </dl>
      ),
    },
  ];
}

// ---------------------------------------------------------------------------
// Accordion item
// ---------------------------------------------------------------------------

function AccordionItem({
  section,
  isOpen,
  onToggle,
}: {
  section: Section;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-800">
          {section.title}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 bg-white border-t border-gray-50">
          {section.content}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function KPassGuide() {
  const sections = buildSections();
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
      <h2 className="text-base font-bold text-gray-900">K-패스 연동 방법 안내</h2>
      <div className="space-y-2">
        {sections.map((section) => (
          <AccordionItem
            key={section.id}
            section={section}
            isOpen={openId === section.id}
            onToggle={() => toggle(section.id)}
          />
        ))}
      </div>
    </div>
  );
}
