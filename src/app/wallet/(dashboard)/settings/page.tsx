"use client";

/**
 * Settings page.
 *
 * Desktop (lg+): sticky sidebar nav + scrollable section content side by side.
 * Mobile: accordion-style collapsible sections — each section header toggles
 *   its content. Reduces cognitive load and scroll distance on small screens.
 *
 * Sections:
 *  1. 프로필      — ProfileSection
 *  2. 앱 설정     — AppSettingsSection
 *  3. 알림 설정   — NotificationSettingsSection
 *  4. K-패스 설정 — KpassSettingsSection
 *  5. 데이터 관리 — DataSection
 *  6. 테마        — ThemeSection
 *  7. 계정        — AccountSection
 */
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import ProfileSection from "./components/profile-section";
import AppSettingsSection from "./components/app-settings-section";
import NotificationSettingsSection from "./components/notification-settings-section";
import KpassSettingsSection from "./components/kpass-settings-section";
import DataSection from "./components/data-section";
import ThemeSection from "./components/theme-section";
import AccountSection from "./components/account-section";
import PwaSection from "./components/pwa-section";

// ---------------------------------------------------------------------------
// Section metadata
// ---------------------------------------------------------------------------

const SECTIONS = [
  { id: "profile",       label: "프로필",      Component: ProfileSection },
  { id: "app",           label: "앱 설정",     Component: AppSettingsSection },
  { id: "notifications", label: "알림 설정",   Component: NotificationSettingsSection },
  { id: "kpass",         label: "K-패스 설정", Component: KpassSettingsSection },
  { id: "data",          label: "데이터 관리", Component: DataSection },
  { id: "theme",         label: "테마",        Component: ThemeSection },
  { id: "pwa",           label: "앱 설치",     Component: PwaSection },
  { id: "account",       label: "계정",        Component: AccountSection },
] as const;

type SectionId = typeof SECTIONS[number]["id"];

// ---------------------------------------------------------------------------
// Accordion item — mobile only
// ---------------------------------------------------------------------------

function AccordionSection({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  // Dark mode: accordion card background, border, and text colors
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      {/* Header — 44px+ tap target */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-4 min-h-[52px] text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Collapsible content */}
      {open && (
        <div className="border-t border-gray-100 dark:border-gray-800 px-4 pb-4 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  // Refs for desktop smooth scroll-to
  const refs = useRef<Partial<Record<SectionId, HTMLElement | null>>>({});

  const scrollTo = (id: SectionId) => {
    refs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const setRef = (id: SectionId) => (el: HTMLElement | null) => {
    refs.current[id] = el;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page title */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">설정</h1>
        <p className="text-sm text-gray-500 mt-1">앱 환경 및 계정을 관리합니다.</p>
      </div>

      {/* ── Mobile: accordion layout ── */}
      <div className="lg:hidden space-y-3">
        {SECTIONS.map(({ id, label, Component }, i) => (
          <AccordionSection key={id} label={label} defaultOpen={i === 0}>
            <Component />
          </AccordionSection>
        ))}
      </div>

      {/* ── Desktop: sidebar + scrollable sections ── */}
      <div className="hidden lg:flex gap-6 items-start">
        {/* Sidebar nav */}
        <aside className="w-44 shrink-0 sticky top-6">
          <nav className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-800 transition-colors border-b border-gray-100 last:border-0"
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Section content */}
        <div className="flex-1 min-w-0 space-y-6">
          {SECTIONS.map(({ id, Component }) => (
            <div
              key={id}
              ref={setRef(id)}
              id={id}
              className="scroll-mt-6"
            >
              <Component />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
