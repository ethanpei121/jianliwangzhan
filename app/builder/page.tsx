"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useDeferredValue, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, PenLine, Menu, X, ChevronDown } from "lucide-react";

import { AIOptimizePanel } from "@/components/AIOptimizePanel";
import { AwardsForm } from "@/components/AwardsForm";
import { CampusExperienceForm } from "@/components/CampusExperienceForm";
import { CertificatesForm } from "@/components/CertificatesForm";
import { EducationForm } from "@/components/EducationForm";
import { ExportActions } from "@/components/ExportActions";
import { InternshipForm } from "@/components/InternshipForm";
import { OptionalModulesForm } from "@/components/OptionalModulesForm";
import { PersonalInfoForm } from "@/components/PersonalInfoForm";
import { ProjectExperienceForm } from "@/components/ProjectExperienceForm";
import { ResumePreview } from "@/components/ResumePreview";
import { SaveStatusIndicator } from "@/components/SaveStatusIndicator";
import { SelfEvaluationForm } from "@/components/SelfEvaluationForm";
import { WorkExperienceForm } from "@/components/WorkExperienceForm";
import { Form } from "@/components/ui/form";
import { defaultResumeValues } from "@/lib/resume-defaults";
import { ResumeValues, resumeSchema } from "@/lib/schema";
import { type TemplateId, templateOptions } from "@/lib/resume-templates";
import { useResumePersistence } from "@/lib/use-resume-persistence";

const resumeSections = [
  { key: "personalInfo", label: "基本信息" },
  { key: "education", label: "教育背景" },
  { key: "internships", label: "实习经历（可选）" },
  { key: "projects", label: "项目经历（可选）" },
  { key: "workExperience", label: "工作经历（可选）" },
  { key: "campusExperience", label: "校园经历（可选）" },
  { key: "certificates", label: "技能证书（可选）" },
  { key: "awards", label: "获奖情况（可选）" },
  { key: "selfEvaluation", label: "自我评价（可选）" },
  { key: "optionalModules", label: "附加模块（可选）" },
  { key: "aiOptimize", label: "✨ AI 智能优化" },
] as const;

type SectionKey = (typeof resumeSections)[number]["key"];
type MobileTab = "edit" | "preview";

/* ─── Sidebar building blocks (shared by mobile drawer & desktop rail) ─── */

function TemplateSelect({
  value,
  onChange,
}: {
  value: TemplateId;
  onChange: (template: TemplateId) => void;
}) {
  return (
    <div className="relative mb-5">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TemplateId)}
        className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm font-medium text-gray-800 shadow-sm transition hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        {templateOptions.map((t) => (
          <option key={t.id} value={t.id}>
            {t.label} — {t.description}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  );
}

function SectionNav({
  activeSection,
  onSelect,
}: {
  activeSection: SectionKey;
  onSelect: (section: SectionKey) => void;
}) {
  return (
    <nav className="space-y-2">
      {resumeSections.map((section) => (
        <button
          key={section.key}
          type="button"
          onClick={() => onSelect(section.key)}
          className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
            activeSection === section.key
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-700 hover:bg-white hover:shadow-sm"
          }`}
        >
          {section.label}
        </button>
      ))}
    </nav>
  );
}

function SidebarNav({
  activeTemplate,
  onTemplateChange,
  activeSection,
  onSectionChange,
}: {
  activeTemplate: TemplateId;
  onTemplateChange: (template: TemplateId) => void;
  activeSection: SectionKey;
  onSectionChange: (section: SectionKey) => void;
}) {
  return (
    <>
      <h2 className="mb-4 text-sm font-semibold text-gray-500">简历模板</h2>
      <TemplateSelect value={activeTemplate} onChange={onTemplateChange} />
      <h2 className="mb-4 text-sm font-semibold text-gray-500">简历模块</h2>
      <SectionNav activeSection={activeSection} onSelect={onSectionChange} />
    </>
  );
}

export default function BuilderPage() {
  const [activeSection, setActiveSection] = useState<SectionKey>("personalInfo");
  const [mobileTab, setMobileTab] = useState<MobileTab>("edit");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>("template1");
  const previewRef = useRef<HTMLDivElement>(null);

  const form = useForm<ResumeValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: defaultResumeValues,
    mode: "onChange",
  });

  const { status: saveStatus, lastSavedAt, saveNow } = useResumePersistence(form);

  const liveData = form.watch();
  // 预览量级远大于输入框：用 deferred 值让输入保持即时响应，预览以低优先级跟进。
  const previewData = useDeferredValue(liveData);

  const activeSectionLabel =
    resumeSections.find((section) => section.key === activeSection)?.label ??
    "简历编辑器";

  const handleMobileSectionChange = useCallback((section: SectionKey) => {
    setActiveSection(section);
    setSidebarOpen(false);
  }, []);

  const sectionForm = useMemo(() => {
    switch (activeSection) {
      case "personalInfo":
        return <PersonalInfoForm control={form.control} />;
      case "education":
        return <EducationForm control={form.control} />;
      case "internships":
        return <InternshipForm control={form.control} />;
      case "projects":
        return <ProjectExperienceForm control={form.control} />;
      case "workExperience":
        return <WorkExperienceForm control={form.control} />;
      case "campusExperience":
        return <CampusExperienceForm control={form.control} />;
      case "certificates":
        return <CertificatesForm control={form.control} />;
      case "awards":
        return <AwardsForm control={form.control} />;
      case "selfEvaluation":
        return <SelfEvaluationForm control={form.control} />;
      case "optionalModules":
        return <OptionalModulesForm control={form.control} />;
      case "aiOptimize":
        return <AIOptimizePanel form={form} />;
      default:
        return <PersonalInfoForm control={form.control} />;
    }
  }, [activeSection, form]);

  return (
    <main className="flex h-[100dvh] flex-col bg-gray-100 xl:overflow-hidden">
      {/* ── Mobile / Tablet top bar (below xl) ── */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 xl:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="切换菜单"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-base font-semibold text-gray-900 sm:text-lg">简历编辑器</h1>
        </div>

        {/* Edit / Preview toggle */}
        <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          <button
            type="button"
            onClick={() => setMobileTab("edit")}
            className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
              mobileTab === "edit"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <PenLine size={14} />
            编辑
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
              mobileTab === "preview"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Eye size={14} />
            预览
          </button>
        </div>
      </header>

      {/* ── Mobile sidebar overlay (below xl) ── */}
      {sidebarOpen && (
        <div className="xl:hidden">
          <div
            className="fixed inset-0 z-30 bg-black/30"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto border-r border-gray-200 bg-gray-50 p-5 pt-16">
            <SidebarNav
              activeTemplate={activeTemplate}
              onTemplateChange={setActiveTemplate}
              activeSection={activeSection}
              onSectionChange={handleMobileSectionChange}
            />
          </aside>
        </div>
      )}

      {/* ── Mobile section tabs (horizontal scroll, below xl) ── */}
      <div className="border-b border-gray-200 bg-gray-50 xl:hidden">
        <div className="flex gap-1 overflow-x-auto px-3 py-2 scrollbar-none">
          {resumeSections.map((section) => (
            <button
              key={section.key}
              type="button"
              onClick={() => setActiveSection(section.key)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition whitespace-nowrap ${
                activeSection === section.key
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-200"
              }`}
            >
              {section.label.replace("（可选）", "")}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content area ── */}
      <div className="flex min-h-0 flex-1">
        {/* Desktop sidebar (xl+) */}
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 p-5 xl:block">
          <SidebarNav
            activeTemplate={activeTemplate}
            onTemplateChange={setActiveTemplate}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </aside>

        {/* Form section */}
        <section
          className={`flex-1 overflow-y-auto bg-white p-4 sm:p-6 xl:p-8 ${
            mobileTab === "edit" ? "block" : "hidden xl:block"
          }`}
        >
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="hidden text-2xl font-semibold text-gray-900 xl:block">简历编辑器</h1>
                <p className="text-sm text-gray-500">
                  当前模块：{activeSectionLabel}
                </p>
                <div className="mt-1">
                  <SaveStatusIndicator
                    status={saveStatus}
                    lastSavedAt={lastSavedAt}
                    onRetry={saveNow}
                  />
                </div>
              </div>
              <ExportActions data={liveData} previewRef={previewRef} />
            </div>
            <Form {...form}>
              <form
                className="mt-4 pb-8 sm:mt-6"
                onSubmit={(event) => event.preventDefault()}
              >
                {sectionForm}
              </form>
            </Form>
          </div>
        </section>

        {/* Preview section */}
        <aside
          className={`bg-gray-200 p-3 sm:p-4 xl:w-[45%] xl:p-6 ${
            mobileTab === "preview" ? "flex-1" : "hidden xl:block"
          }`}
        >
          <div className="flex h-full items-center justify-center">
            <div className="aspect-[210/297] h-full max-h-full w-full max-w-[760px] rounded-xl bg-white shadow-2xl ring-1 ring-white/70 xl:h-[90%] xl:rounded-2xl">
              <div
                ref={previewRef}
                className="h-full overflow-y-auto rounded-xl bg-white xl:rounded-2xl"
              >
                <ResumePreview data={previewData} template={activeTemplate} />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
