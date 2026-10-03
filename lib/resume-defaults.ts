import { type ResumeValues } from "@/lib/schema";

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
): Record<string, string>[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [{ ...emptyItem }];
  }
  // 逐条补齐字段：历史记录若缺字段，模板里 hasValue(value) 的 value.trim() 会直接崩。
  return raw
    .filter(isRecord)
    .map((item) => ({ ...emptyItem, ...item }) as Record<string, string>);
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
    education: mergeList(input.education, emptyEducation) as ResumeValues["education"],
    internships: mergeList(input.internships, emptyInternship) as ResumeValues["internships"],
    projects: mergeList(input.projects, emptyProject) as ResumeValues["projects"],
    workExperience: mergeList(
      input.workExperience,
      emptyWorkExperience,
    ) as ResumeValues["workExperience"],
    campusExperience: mergeList(
      input.campusExperience,
      emptyCampusExperience,
    ) as ResumeValues["campusExperience"],
    certificates: {
      ...defaultResumeValues.certificates,
      ...(input.certificates ?? {}),
    },
    awards: mergeList(input.awards, emptyAward) as ResumeValues["awards"],
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
