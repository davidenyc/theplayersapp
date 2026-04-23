"use client";

import type { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, title, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-4 md:items-center">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
          >
            Close
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
