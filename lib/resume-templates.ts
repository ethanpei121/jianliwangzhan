import type { ResumeValues } from "@/lib/schema";

/* ─── color helpers ─── */

export function safeHexColor(value: string | undefined, fallback: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value ?? "") ? (value as string) : fallback;
}

export function withOpacity(hexColor: string, opacity: number) {
  const n = hexColor.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function mixWithBlack(hexColor: string, ratio: number) {
  const n = hexColor.replace("#", "");
  const r = Math.max(0, Math.round(parseInt(n.slice(0, 2), 16) * (1 - ratio)));
  const g = Math.max(0, Math.round(parseInt(n.slice(2, 4), 16) * (1 - ratio)));
  const b = Math.max(0, Math.round(parseInt(n.slice(4, 6), 16) * (1 - ratio)));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export function getContrastTextColor(hexColor: string) {
  const n = hexColor.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16);
  const g = parseInt(n.slice(2, 4), 16);
  const b = parseInt(n.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness >= 145 ? "#0f172a" : "#ffffff";
}

/* ─── text helpers ─── */

export function hasValue(value: string) {
  return value.trim() !== "";
}

export function formatRange(startDate: string, endDate: string) {
  return [startDate.trim(), endDate.trim()].filter(Boolean).join(" ~ ");
}

export function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/* ─── data processing ─── */

export type LabelValue = { label: string; value: string };

export function processResumeData(data: ResumeValues) {
  const personalInfo = data.personalInfo;

  const education = data.education.filter((item) =>
    [item.school, item.degree, item.major, item.startDate, item.endDate, item.courses, item.gpaRank, item.honors].some(hasValue),
  );
  const internships = data.internships.filter((item) =>
    [item.company, item.position, item.startDate, item.endDate, item.content, item.achievements, item.modules].some(hasValue),
  );
  const projects = data.projects.filter((item) =>
    [item.name, item.startDate, item.endDate, item.role, item.description, item.responsibilities, item.techStack, item.outcomes].some(hasValue),
  );
  const workExperience = data.workExperience.filter((item) =>
    [item.company, item.position, item.startDate, item.endDate, item.content, item.achievements, item.management].some(hasValue),
  );
  const campusExperience = data.campusExperience.filter((item) =>
    [item.organization, item.role, item.time, item.responsibilities, item.outcomes].some(hasValue),
  );
  const awards = data.awards.filter((item) =>
    [item.name, item.issuer, item.date, item.level].some(hasValue),
  );

  const certificateList: LabelValue[] = [
    { label: "英语等级", value: data.certificates.english },
    { label: "计算机证书", value: data.certificates.computer },
    { label: "专业证书", value: data.certificates.professional },
    { label: "软件技能", value: data.certificates.software },
    { label: "语言能力", value: data.certificates.language },
  ].filter((item) => hasValue(item.value));

  const selfEvaluationList: LabelValue[] = [
    { label: "个人优势", value: data.selfEvaluation.strengths },
    { label: "专业能力", value: data.selfEvaluation.professionalAbility },
    { label: "求职态度", value: data.selfEvaluation.jobAttitude },
    { label: "职业规划", value: data.selfEvaluation.careerPlan },
  ].filter((item) => hasValue(item.value));

  const optionalEnabled = data.optionalModules.enabled;
  const optionalList = [
    { enabled: optionalEnabled.portfolio, label: "作品集链接", value: data.optionalModules.portfolioLinks },
    { enabled: optionalEnabled.training, label: "培训经历", value: data.optionalModules.trainingExperience },
    { enabled: optionalEnabled.papersPatents, label: "论文 / 专利", value: data.optionalModules.papersPatents },
    { enabled: optionalEnabled.socialPractice, label: "社会实践 / 志愿者经历", value: data.optionalModules.socialPractice },
    { enabled: optionalEnabled.hobbies, label: "兴趣爱好", value: data.optionalModules.hobbies },
  ].filter((item) => item.enabled && hasValue(item.value));

  return {
    personalInfo,
    education,
    internships,
    projects,
    workExperience,
    campusExperience,
    awards,
    certificateList,
    selfEvaluationList,
    optionalList,
  };
}

export type ProcessedResumeData = ReturnType<typeof processResumeData>;

/* ─── template registry ─── */

export const defaultSidebarColor = "#0f6db6";
export const defaultAccentColor = "#0f6db6";

export type TemplateId = "template1" | "template2" | "template3";

export type TemplateOption = {
  id: TemplateId;
  label: string;
  description: string;
};

export const templateOptions: TemplateOption[] = [
  { id: "template1", label: "模板一", description: "侧边栏 + 卡片式布局" },
  { id: "template2", label: "模板二", description: "经典单栏 · 简约清晰" },
  { id: "template3", label: "模板三", description: "时间线 · 现代商务" },
];
