"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import { mergeResumeData } from "@/lib/resume-defaults";
import type { ResumeValues } from "@/lib/schema";

export type SaveStatus =
  | "loading"
  | "idle"
  | "saving"
  | "saved"
  | "error"
  | "unconfigured";

/** 停止输入 1 秒后落库，避免每敲一个字都打一次接口。 */
const SAVE_DEBOUNCE_MS = 1000;

export function useResumePersistence(form: UseFormReturn<ResumeValues>) {
  const [status, setStatus] = useState<SaveStatus>("loading");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  /** 数据尚未从云端回填完成前不触发保存，避免用空表单覆盖已存内容。 */
  const hydrated = useRef(false);
  /** 上次成功入库的快照，用于跳过无意义的重复保存。 */
  const lastSavedJson = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(async () => {
    const json = JSON.stringify(form.getValues());
    if (json === lastSavedJson.current) {
      return;
    }

    setStatus("saving");
    try {
      const response = await fetch("/api/resumes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: json,
      });

      if (response.status === 503) {
        setStatus("unconfigured");
        return;
      }
      if (!response.ok) {
        setStatus("error");
        return;
      }

      lastSavedJson.current = json;
      setLastSavedAt(new Date());
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }, [form]);

  // ── 首次进入：从云端拉取已保存的简历 ──
  useEffect(() => {
    let cancelled = false;

    const finish = (next: SaveStatus) => {
      hydrated.current = true;
      if (!cancelled) {
        setStatus(next);
      }
    };

    void (async () => {
      try {
        const response = await fetch("/api/resumes", { cache: "no-store" });
        if (cancelled) return;

        if (response.status === 503) return finish("unconfigured");
        if (response.status === 401) return finish("idle");
        if (!response.ok) return finish("error");

        const payload: { data?: unknown } = await response.json();
        if (cancelled) return;

        if (payload.data) {
          const merged = mergeResumeData(payload.data);
          lastSavedJson.current = JSON.stringify(merged);
          form.reset(merged);
        } else {
          lastSavedJson.current = JSON.stringify(form.getValues());
        }
        finish("idle");
      } catch {
        finish("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [form]);

  // ── 监听表单变化：防抖自动保存 ──
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (!hydrated.current) return;

      const json = JSON.stringify(values);
      if (json === lastSavedJson.current) return;

      // 状态相同时 React 会跳过重渲染，所以这里不会每次按键都触发额外渲染。
      setStatus((prev) => (prev === "unconfigured" ? prev : "saving"));

      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        void save();
      }, SAVE_DEBOUNCE_MS);
    });

    return () => {
      subscription.unsubscribe();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [form, save]);

  // ── 切换标签页 / 最小化时尽力补一次保存 ──
  useEffect(() => {
    const flush = () => {
      if (document.visibilityState !== "hidden") return;
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      void save();
    };

    document.addEventListener("visibilitychange", flush);
    return () => document.removeEventListener("visibilitychange", flush);
  }, [save]);

  return { status, lastSavedAt, saveNow: save };
}
