import { type ResumeValues } from "@/lib/schema";

/**
 * 各数组模块的条目上限，与 schema.ts 里的 .max() 保持一致。
 *
 * 导出成常量是为了让「新增」按钮能读取同一个上限做禁用判断 ——
 * 以前上限只写在 schema 里，界面完全不知道它存在，用户可以无限新增。
 */
export const ARRAY_LIMITS = {
  education: 10,
  internships: 10,
  projects: 10,
  workExperience: 10,
  campusExperience: 10,
  awards: 20,
} as const satisfies Record<string, number>;

export type ArraySectionKey = keyof typeof ARRAY_LIMITS;

/** 单份简历的 JSON 体积上限（字符数），防止异常数据撑爆数据库行。 */
export const MAX_PAYLOAD_CHARS = 8_000_000;

/** 各模块的空条目模板，用于合并历史数据时补齐缺失字段。 */
const emptyEducation: Record<string, string> = {
  school: "",
  degree: "",
  major: "",
  startDate: "",
  endDate: "",
  courses: "",
  gpaRank: "",
  honors: "",
};

const emptyInternship: Record<string, string> = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  content: "",
  achievements: "",
  modules: "",
};

const emptyProject: Record<string, string> = {
  name: "",
  startDate: "",
  endDate: "",
  role: "",
  description: "",
  responsibilities: "",
  techStack: "",
  outcomes: "",
};

const emptyWorkExperience: Record<string, string> = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  content: "",
  achievements: "",
  management: "",
};

const emptyCampusExperience: Record<string, string> = {
  organization: "",
  role: "",
  time: "",
  responsibilities: "",
  outcomes: "",
};

const emptyAward: Record<string, string> = {
  name: "",
  issuer: "",
  date: "",
  level: "",
};

/** 简历表单的初始数据，同时作为历史数据合并时的兜底基准。 */
export const defaultResumeValues: ResumeValues = {
  personalInfo: {
    fullName: "",
    gender: "",
    birthDateAge: "",
    phone: "",
    email: "",
    city: "",
    jobTitle: "",
    avatar: "",
    politicalStatus: "",
    nativePlace: "",
    github: "",
    sidebarColor: "#0f6db6",
    accentColor: "#0f6db6",
    sidebarSpacing: 10,
    contentSpacing: 6,
  },
  education: [{ ...emptyEducation }] as ResumeValues["education"],
  internships: [{ ...emptyInternship }] as ResumeValues["internships"],
  projects: [{ ...emptyProject }] as ResumeValues["projects"],
  workExperience: [{ ...emptyWorkExperience }] as ResumeValues["workExperience"],
  campusExperience: [
    { ...emptyCampusExperience },
  ] as ResumeValues["campusExperience"],
  certificates: {
    english: "",
    computer: "",
    professional: "",
    software: "",
    language: "",
  },
  awards: [{ ...emptyAward }] as ResumeValues["awards"],
  selfEvaluation: {
    strengths: "",
    professionalAbility: "",
    jobAttitude: "",
    careerPlan: "",
  },
  optionalModules: {
    enabled: {
      portfolio: false,
      training: false,
      papersPatents: false,
      socialPractice: false,
      hobbies: false,
    },
    portfolioLinks: "",
    trainingExperience: "",
    papersPatents: "",
    socialPractice: "",
    hobbies: "",
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeList(
  raw: unknown,
  emptyItem: Record<string, string>,
  limit?: number,
): Record<string, string>[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [{ ...emptyItem }];
  }
  // 逐条补齐字段：历史记录若缺字段，模板里 hasValue(value) 的 value.trim() 会直接崩。
  const items = raw
    .filter(isRecord)
    .map((item) => ({ ...emptyItem, ...item }) as Record<string, string>);
  // 历史上界面没有上限保护，可能已写入超量数据；读取时顺手裁掉，
  // 否则非法条目会跨会话无限累积。
  return typeof limit === "number" ? items.slice(0, limit) : items;
}

/**
 * 把服务端返回的简历数据与默认值做防御性合并。
 *
 * 云端存的是草稿快照，可能来自旧版本结构或半途保存的中间态，
 * 因此不直接信任远端结构，而是逐段回落到默认值。
 */
export function mergeResumeData(raw: unknown): ResumeValues {
  if (!isRecord(raw)) {
    return defaultResumeValues;
  }
  const input = raw as Partial<ResumeValues>;

  return {
    personalInfo: {
      ...defaultResumeValues.personalInfo,
      ...(input.personalInfo ?? {}),
    },
    education: mergeList(
      input.education,
      emptyEducation,
      ARRAY_LIMITS.education,
    ) as ResumeValues["education"],
    internships: mergeList(
      input.internships,
      emptyInternship,
      ARRAY_LIMITS.internships,
    ) as ResumeValues["internships"],
    projects: mergeList(
      input.projects,
      emptyProject,
      ARRAY_LIMITS.projects,
    ) as ResumeValues["projects"],
    workExperience: mergeList(
      input.workExperience,
      emptyWorkExperience,
      ARRAY_LIMITS.workExperience,
    ) as ResumeValues["workExperience"],
    campusExperience: mergeList(
      input.campusExperience,
      emptyCampusExperience,
      ARRAY_LIMITS.campusExperience,
    ) as ResumeValues["campusExperience"],
    certificates: {
      ...defaultResumeValues.certificates,
      ...(input.certificates ?? {}),
    },
    awards: mergeList(
      input.awards,
      emptyAward,
      ARRAY_LIMITS.awards,
    ) as ResumeValues["awards"],
    selfEvaluation: {
      ...defaultResumeValues.selfEvaluation,
      ...(input.selfEvaluation ?? {}),
    },
    optionalModules: {
      ...defaultResumeValues.optionalModules,
      ...(input.optionalModules ?? {}),
      enabled: {
        ...defaultResumeValues.optionalModules.enabled,
        ...(input.optionalModules?.enabled ?? {}),
      },
    },
  };
}

/**
 * 落库前清洗。
 *
 * 刻意**不做** schema 严格校验：自动保存必须能存半成品，
 * 否则用户邮箱打到一半（`zhang@`）整份简历就再也存不进去了。
 * 这里只挡住真正有风险的形态 —— 数组超量。
 */
export function sanitizeResumeData(data: ResumeValues): ResumeValues {
  return {
    ...data,
    education: data.education.slice(0, ARRAY_LIMITS.education),
    internships: data.internships.slice(0, ARRAY_LIMITS.internships),
    projects: data.projects.slice(0, ARRAY_LIMITS.projects),
    workExperience: data.workExperience.slice(0, ARRAY_LIMITS.workExperience),
    campusExperience: data.campusExperience.slice(0, ARRAY_LIMITS.campusExperience),
    awards: data.awards.slice(0, ARRAY_LIMITS.awards),
  };
}
