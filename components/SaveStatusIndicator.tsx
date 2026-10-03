"use client";

import { memo } from "react";
import { AlertTriangle, Check, CloudOff, Loader2 } from "lucide-react";

import type { SaveStatus } from "@/lib/use-resume-persistence";

const STATUS_TEXT: Record<SaveStatus, string> = {
  loading: "加载中…",
  idle: "内容会自动保存",
  saving: "保存中…",
  saved: "已保存",
  error: "保存失败",
  unconfigured: "未开启云端保存",
};

function formatTime(date: Date) {
  return `${`${date.getHours()}`.padStart(2, "0")}:${`${date.getMinutes()}`.padStart(2, "0")}`;
}

export const SaveStatusIndicator = memo(function SaveStatusIndicator({
  status,
  lastSavedAt,
  onRetry,
}: {
  status: SaveStatus;
  lastSavedAt: Date | null;
  onRetry: () => void;
}) {
  const icon =
    status === "loading" || status === "saving" ? (
      <Loader2 size={13} className="animate-spin" />
    ) : status === "saved" ? (
      <Check size={13} />
    ) : status === "error" ? (
      <AlertTriangle size={13} />
    ) : status === "unconfigured" ? (
      <CloudOff size={13} />
    ) : null;

  const tone =
    status === "saved"
      ? "text-emerald-600"
      : status === "error"
        ? "text-red-600"
        : status === "unconfigured"
          ? "text-amber-600"
          : "text-gray-400";

  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-flex items-center gap-1 text-xs ${tone}`}>
        {icon}
        {STATUS_TEXT[status]}
        {status === "saved" && lastSavedAt ? ` ${formatTime(lastSavedAt)}` : ""}
      </span>
      {status === "error" ? (
        <button
          type="button"
          onClick={onRetry}
          className="text-xs text-blue-600 underline-offset-2 hover:underline"
        >
          重试
        </button>
      ) : null}
    </div>
  );
});
