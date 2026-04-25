"use client";

/**
 * ExportButton
 *
 * Reusable button that opens ExportDialog.
 * Can be placed on any page that needs export functionality.
 */
import React, { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/wallet/ui/button";
import ExportDialog from "./export-dialog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExportButtonProps {
  /** Pre-selected start date (YYYY-MM-DD) passed into the dialog. */
  defaultDateFrom?: string;
  /** Pre-selected end date (YYYY-MM-DD) passed into the dialog. */
  defaultDateTo?: string;
  /** Visual variant forwarded to Button. */
  variant?: "default" | "outline" | "ghost";
  /** Button label. Defaults to "내보내기". */
  label?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ExportButton({
  defaultDateFrom,
  defaultDateTo,
  variant = "outline",
  label = "내보내기",
}: ExportButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5"
      >
        <Download size={16} />
        {label}
      </Button>

      {open && (
        <ExportDialog
          onClose={() => setOpen(false)}
          defaultDateFrom={defaultDateFrom}
          defaultDateTo={defaultDateTo}
        />
      )}
    </>
  );
}
