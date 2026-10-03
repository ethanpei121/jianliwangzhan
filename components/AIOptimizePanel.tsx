"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Sparkles, Loader2, Check, RotateCcw, FileText, Copy } from "lucide-react";

import { ResumeValues, type OptimizeSection } from "@/lib/schema";

type AIOptimizePanelProps = {
  form: UseFormReturn<ResumeValues>;
};

type OptimizeItem = {
  key: OptimizeSection;
  label: string;
  description: string;
  getContent: (data: ResumeValues) => string;
  applyResult?: (form: UseFormReturn<ResumeValues>, result: string) => void;
};

function formatSelfEvaluation(data: ResumeValues): string {
  const se = data.selfEvaluation;
  const parts: string[] = [];
  if (se.strengths) parts.push(`个人优势：${se.strengths}`);
  if (se.professionalAbility) parts.push(`专业能力：${se.professionalAbility}`);
  if (se.jobAttitude) parts.push(`求职态度：${se.jobAttitude}`);
  if (se.careerPlan) parts.push(`职业规划：${se.careerPlan}`);
  return parts.join("\n\n");
}

function formatWorkExperience(data: ResumeValues): string {
  return data.workExperience
    .filter((w) => w.company || w.content)
    .map(
      (w, i) =>
        `【工作经历 ${i + 1}】\n公司：${w.company}\n职位：${w.position}\n时间：${w.startDate} - ${w.endDate}\n工作内容：${w.content}\n业绩成果：${w.achievements}\n管理经验：${w.management}`,
    )
    .join("\n\n");
}

function formatInternship(data: ResumeValues): string {
  return data.internships
    .filter((item) => item.company || item.content)
    .map(
      (item, i) =>
        `【实习经历 ${i + 1}】\n公司：${item.company}\n岗位：${item.position}\n时间：${item.startDate} - ${item.endDate}\n工作内容：${item.content}\n工作成果：${item.achievements}\n负责模块：${item.modules}`,
    )
    .join("\n\n");
}

function formatProject(data: ResumeValues): string {
  return data.projects
    .filter((p) => p.name || p.description)
    .map(
      (p, i) =>
        `【项目 ${i + 1}】\n名称：${p.name}\n时间：${p.startDate} - ${p.endDate}\n角色：${p.role}\n描述：${p.description}\n职责：${p.responsibilities}\n技术栈：${p.techStack}\n成果：${p.outcomes}`,
    )
    .join("\n\n");
}

function formatCampusExperience(data: ResumeValues): string {
  return data.campusExperience
    .filter((c) => c.organization || c.responsibilities)
    .map(
      (c, i) =>
        `【校园经历 ${i + 1}】\n组织：${c.organization}\n职务：${c.role}\n时间：${c.time}\n负责工作：${c.responsibilities}\n活动成果：${c.outcomes}`,
    )
    .join("\n\n");
}

function formatFullResume(data: ResumeValues): string {
  const parts: string[] = [];
  const pi = data.personalInfo;
  parts.push(
    `【基本信息】\n姓名：${pi.fullName}\n求职意向：${pi.jobTitle}\n城市：${pi.city}`,
  );

  const eduText = data.education
    .filter((e) => e.school)
    .map((e) => `${e.school} - ${e.degree} ${e.major} (${e.startDate}-${e.endDate})`)
    .join("\n");
  if (eduText) parts.push(`【教育背景】\n${eduText}`);

  const workText = formatWorkExperience(data);
  if (workText) parts.push(workText);

  const internText = formatInternship(data);
  if (internText) parts.push(internText);

  const projText = formatProject(data);
  if (projText) parts.push(projText);

  const campusText = formatCampusExperience(data);
  if (campusText) parts.push(campusText);

  const seText = formatSelfEvaluation(data);
  if (seText) parts.push(`【自我评价】\n${seText}`);

  return parts.join("\n\n---\n\n");
}

const optimizeItems: OptimizeItem[] = [
  {
    key: "selfEvaluation",
    label: "优化自我评价",
    description: "让自我评价更专业、更有说服力",
    getContent: formatSelfEvaluation,
    applyResult: (form, result) => {
      const lines = result.split("\n\n");
      const extract = (prefix: string) => {
        const line = lines.find((l) => l.startsWith(prefix));
        return line ? line.replace(prefix, "").trim() : undefined;
      };
      const strengths = extract("个人优势：");
      const professionalAbility = extract("专业能力：");
      const jobAttitude = extract("求职态度：");
      const careerPlan = extract("职业规划：");
      if (strengths) form.setValue("selfEvaluation.strengths", strengths);
      if (professionalAbility)
        form.setValue("selfEvaluation.professionalAbility", professionalAbility);
      if (jobAttitude) form.setValue("selfEvaluation.jobAttitude", jobAttitude);
      if (careerPlan) form.setValue("selfEvaluation.careerPlan", careerPlan);
    },
  },
  {
    key: "workExperience",
    label: "优化工作经历",
    description: "用 STAR 法则重塑工作描述",
    getContent: formatWorkExperience,
  },
  {
    key: "internship",
    label: "优化实习经历",
    description: "突出实习中的成长和贡献",
    getContent: formatInternship,
  },
  {
    key: "project",
    label: "优化项目经历",
    description: "突出技术深度和个人贡献",
    getContent: formatProject,
  },
  {
    key: "campusExperience",
    label: "优化校园经历",
    description: "突出领导力和组织能力",
    getContent: formatCampusExperience,
  },
  {
    key: "fullResume",
    label: "简历整体诊断",
    description: "获取简历的全面分析和改进建议",
    getContent: formatFullResume,
  },
];

export function AIOptimizePanel({ form }: AIOptimizePanelProps) {
  const [loading, setLoading] = useState<OptimizeSection | null>(null);
  const [results, setResults] = useState<
    Record<string, { text: string; applied: boolean }>
  >({});
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async (item: OptimizeItem) => {
    const data = form.getValues();
    const content = item.getContent(data);
    if (!content.trim()) {
      setError(`请先填写${item.label.replace("优化", "")}相关内容`);
      return;
    }

    setLoading(item.key);
    setError(null);
    setResults((prev) => {
      const next = { ...prev };
      delete next[item.key];
      return next;
    });

    try {
      const resp = await fetch("/api/ai-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: item.key, content }),
      });

      const json = await resp.json();
      if (!resp.ok) {
        setError(json.error || "优化失败，请重试");
        return;
      }

      setResults((prev) => ({
        ...prev,
        [item.key]: { text: json.result, applied: false },
      }));
    } catch {
      setError("网络请求失败，请检查网络连接");
    } finally {
      setLoading(null);
    }
  };

  const handleApply = (item: OptimizeItem) => {
    const result = results[item.key];
    if (!result || !item.applyResult) return;
    item.applyResult(form, result.text);
    setResults((prev) => ({
      ...prev,
      [item.key]: { ...result, applied: true },
    }));
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback: ignore
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-500" />
        <h2 className="text-lg font-semibold text-gray-900">AI 智能优化</h2>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        使用 AI 分析并优化你的简历内容，让简历更加专业有力。
      </p>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {optimizeItems.map((item) => {
          const result = results[item.key];
          const isLoading = loading === item.key;

          return (
            <div key={item.key} className="rounded-lg border border-gray-200 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {item.label}
                  </h3>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
                <button
                  type="button"
                  disabled={isLoading || loading !== null}
                  onClick={() => handleOptimize(item)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      优化中...
                    </>
                  ) : result ? (
                    <>
                      <RotateCcw className="h-3.5 w-3.5" />
                      重新优化
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      开始优化
                    </>
                  )}
                </button>
              </div>

              {result && (
                <div className="mt-3 rounded-lg border border-purple-100 bg-purple-50/50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs font-medium text-purple-700">
                      <FileText className="h-3.5 w-3.5" />
                      优化结果
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(result.text)}
                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-500 hover:bg-purple-100 hover:text-purple-700"
                      >
                        <Copy className="h-3 w-3" />
                        复制
                      </button>
                      {item.applyResult && (
                        <button
                          type="button"
                          disabled={result.applied}
                          onClick={() => handleApply(item)}
                          className="inline-flex items-center gap-1 rounded bg-purple-600 px-2 py-1 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                        >
                          {result.applied ? (
                            <>
                              <Check className="h-3 w-3" />
                              已应用
                            </>
                          ) : (
                            "应用到简历"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {result.text}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-lg bg-gray-50 px-4 py-3">
        <p className="text-xs text-gray-400">
          💡 提示：AI 优化结果仅供参考，请根据实际情况修改。「自我评价」支持一键应用，其他模块请复制后手动替换。
        </p>
      </div>
    </div>
  );
}
