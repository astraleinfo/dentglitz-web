"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiAlertTriangle, FiInfo, FiX } from "react-icons/fi";

export interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "danger" | "info";
  hideCancel?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputType?: string;
  onConfirm: (inputValue?: string) => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  type = "info",
  hideCancel = false,
  inputLabel,
  inputPlaceholder,
  inputType = "text",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isDanger = type === "danger";

  useEffect(() => {
    if (inputLabel) inputRef.current?.focus();
  }, [inputLabel]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const Icon = isDanger ? FiAlertTriangle : FiInfo;
  const canConfirm = !inputLabel || inputValue.trim().length > 0;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <FiX />
        </button>

        <div className="flex items-start gap-4">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${
              isDanger ? "bg-rose-100 text-rose-500" : "bg-primary/10 text-primary"
            }`}
          >
            <Icon />
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-secondary">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{message}</p>
          </div>
        </div>

        {inputLabel && (
          <div className="mt-4">
            <label className="label">{inputLabel}</label>
            <input
              ref={inputRef}
              type={inputType}
              className="input"
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && canConfirm) onConfirm(inputValue); }}
            />
          </div>
        )}

        <div className={`mt-5 flex gap-2.5 ${hideCancel ? "justify-end" : ""}`}>
          {!hideCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            disabled={!canConfirm}
            onClick={() => onConfirm(inputLabel ? inputValue : undefined)}
            className={`rounded-xl py-2.5 text-sm font-semibold text-white transition disabled:opacity-40 ${
              hideCancel ? "px-6" : "flex-1"
            } ${isDanger ? "bg-rose-500 hover:bg-rose-600" : "bg-primary hover:bg-primary-dark"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
