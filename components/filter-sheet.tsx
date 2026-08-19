"use client";

import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { trackEvent } from "@/lib/gtag";

export function FilterSheet({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 sm:hidden">
      <button
        type="button"
        aria-label="필터 닫기"
        onClick={() => {
          trackEvent("filter_sheet_close", { method: "backdrop" });
          onClose();
        }}
        className="absolute inset-0 bg-ink/40"
      />
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-canvas p-6 pb-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">필터</h2>
          <button
            type="button"
            onClick={() => {
              trackEvent("filter_sheet_close", { method: "x_button" });
              onClose();
            }}
            aria-label="닫기"
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink"
          >
            <X size={20} />
          </button>
        </div>
        {children}
        <button
          type="button"
          onClick={() => {
            trackEvent("filter_apply", { method: "sheet" });
            onClose();
          }}
          className="mt-8 h-14 w-full rounded-xl bg-accent text-sm font-bold text-white"
        >
          결과 보기
        </button>
      </div>
    </div>
  );
}
