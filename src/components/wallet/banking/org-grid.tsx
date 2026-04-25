"use client";

/**
 * OrgGrid — institution selection grid for the CODEF bank-selector flow.
 *
 * Renders banks and card companies in separate sections.
 * Each tile shows a colored avatar and the organization name.
 */

import { Building2, CreditCard } from "lucide-react";
import type { Organization } from "@/lib/wallet/codef/organizations";

interface OrgGridProps {
  orgs: Organization[];
  onSelect: (org: Organization) => void;
}

function OrgTile({ org, onSelect }: { org: Organization; onSelect: (org: Organization) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(org)}
      className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
        style={{ backgroundColor: org.color ?? "#6b7280" }}
      >
        {org.name.slice(0, 2)}
      </div>
      <span className="text-xs text-gray-600 text-center leading-tight">{org.name}</span>
    </button>
  );
}

export default function OrgGrid({ orgs, onSelect }: OrgGridProps) {
  const banks = orgs.filter((o) => o.type === "BK");
  const cards = orgs.filter((o) => o.type === "CD");

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5" /> 은행
        </p>
        <div className="grid grid-cols-4 gap-2">
          {banks.map((org) => (
            <OrgTile key={org.code} org={org} onSelect={onSelect} />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
          <CreditCard className="w-3.5 h-3.5" /> 카드
        </p>
        <div className="grid grid-cols-4 gap-2">
          {cards.map((org) => (
            <OrgTile key={org.code} org={org} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </div>
  );
}
