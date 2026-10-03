import { z } from "zod";

const optionalEmailField = z.union([
  z.literal(""),
  z.string().trim().email("请输入有效邮箱地址"),
]);

const optionalUrlField = z.union([
  z.literal(""),
  z.string().trim().url("请输入有效链接"),
]);

const hexColorField = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "请选择有效的十六进制颜色");

const personalInfoSchema = z.object({
  fullName: z.string().trim().max(100, "姓名不能超过 100 个字符"),
  gender: z.string().trim().max(20, "性别不能超过 20 个字符"),
  birthDateAge: z.string().trim().max(60, "出生年月 / 年龄不能超过 60 个字符"),
  phone: z.string().trim().max(30, "手机号码不能超过 30 个字符"),
  email: optionalEmailField,
  city: z.string().trim().max(100, "现居城市不能超过 100 个字符"),
  jobTitle: z.string().trim().max(100, "求职意向不能超过 100 个字符"),
  avatar: z.string().trim().max(6000000, "头像图片数据过大"),
  politicalStatus: z.string().trim().max(30, "政治面貌不能超过 30 个字符"),
  nativePlace: z.string().trim().max(100, "籍贯不能超过 100 个字符"),
  github: optionalUrlField,
  sidebarColor: hexColorField,
  accentColor: hexColorField,
  sidebarSpacing: z.number().min(6, "左侧间距不能小于 6").max(20, "左侧间距不能大于 20"),
  contentSpacing: z.number().min(0, "右侧间距不能小于 0").max(24, "右侧间距不能大于 24"),
});

const educationItemSchema = z.object({
  school: z.string().trim().max(150, "学校名称不能超过 150 个字符"),
  degree: z.string().trim().max(80, "学历不能超过 80 个字符"),
  major: z.string().trim().max(80, "专业不能超过 80 个字符"),
  startDate: z.string().trim().max(30, "入学时间不能超过 30 个字符"),
  endDate: z.string().trim().max(30, "毕业时间不能超过 30 个字符"),
  courses: z.string().trim().max(1200, "主修课程不能超过 1200 个字符"),
  gpaRank: z.string().trim().max(120, "GPA/排名不能超过 120 个字符"),
  honors: z.string().trim().max(1200, "在校荣誉不能超过 1200 个字符"),
});

const internshipItemSchema = z.object({
  company: z.string().trim().max(150, "公司名称不能超过 150 个字符"),
  position: z.string().trim().max(100, "实习岗位不能超过 100 个字符"),
  startDate: z.string().trim().max(30, "开始时间不能超过 30 个字符"),
  endDate: z.string().trim().max(30, "结束时间不能超过 30 个字符"),
  content: z.string().trim().max(1500, "工作内容不能超过 1500 个字符"),
  achievements: z.string().trim().max(1500, "工作成果不能超过 1500 个字符"),
  modules: z.string().trim().max(1200, "负责模块不能超过 1200 个字符"),
});

const projectItemSchema = z.object({
  name: z.string().trim().max(150, "项目名称不能超过 150 个字符"),
  startDate: z.string().trim().max(30, "开始时间不能超过 30 个字符"),
  endDate: z.string().trim().max(30, "结束时间不能超过 30 个字符"),
  role: z.string().trim().max(100, "项目角色不能超过 100 个字符"),
  description: z.string().trim().max(1500, "项目描述不能超过 1500 个字符"),
  responsibilities: z.string().trim().max(1500, "个人职责不能超过 1500 个字符"),
  techStack: z.string().trim().max(1200, "技术栈不能超过 1200 个字符"),
  outcomes: z.string().trim().max(1500, "项目成果不能超过 1500 个字符"),
});

const workExperienceItemSchema = z.object({
  company: z.string().trim().max(150, "公司名称不能超过 150 个字符"),
  position: z.string().trim().max(100, "职位不能超过 100 个字符"),
  startDate: z.string().trim().max(30, "入职时间不能超过 30 个字符"),
  endDate: z.string().trim().max(30, "离职时间不能超过 30 个字符"),
  content: z.string().trim().max(1500, "工作内容不能超过 1500 个字符"),
  achievements: z.string().trim().max(1500, "业绩成果不能超过 1500 个字符"),
  management: z.string().trim().max(1200, "管理经验不能超过 1200 个字符"),
});

const campusExperienceItemSchema = z.object({
  organization: z.string().trim().max(150, "组织名称不能超过 150 个字符"),
  role: z.string().trim().max(100, "职务不能超过 100 个字符"),
  time: z.string().trim().max(60, "时间不能超过 60 个字符"),
  responsibilities: z.string().trim().max(1500, "负责工作不能超过 1500 个字符"),
  outcomes: z.string().trim().max(1500, "活动成果不能超过 1500 个字符"),
});

const certificatesSchema = z.object({
  english: z.string().trim().max(300, "英语等级不能超过 300 个字符"),
  computer: z.string().trim().max(300, "计算机证书不能超过 300 个字符"),
  professional: z.string().trim().max(500, "专业证书不能超过 500 个字符"),
  software: z.string().trim().max(500, "软件技能不能超过 500 个字符"),
  language: z.string().trim().max(500, "语言能力不能超过 500 个字符"),
});

const awardItemSchema = z.object({
  name: z.string().trim().max(150, "奖项名称不能超过 150 个字符"),
  issuer: z.string().trim().max(150, "颁发单位不能超过 150 个字符"),
  date: z.string().trim().max(30, "获奖时间不能超过 30 个字符"),
  level: z.string().trim().max(30, "奖项级别不能超过 30 个字符"),
});

const selfEvaluationSchema = z.object({
  strengths: z.string().trim().max(1500, "个人优势不能超过 1500 个字符"),
  professionalAbility: z
    .string()
    .trim()
    .max(1500, "专业能力不能超过 1500 个字符"),
  jobAttitude: z.string().trim().max(1200, "求职态度不能超过 1200 个字符"),
  careerPlan: z.string().trim().max(1200, "职业规划不能超过 1200 个字符"),
});

const optionalModulesSchema = z.object({
  enabled: z.object({
    portfolio: z.boolean(),
    training: z.boolean(),
    papersPatents: z.boolean(),
    socialPractice: z.boolean(),
    hobbies: z.boolean(),
  }),
  portfolioLinks: z.string().trim().max(1500, "作品集链接不能超过 1500 个字符"),
  trainingExperience: z
    .string()
    .trim()
    .max(2500, "培训经历不能超过 2500 个字符"),
  papersPatents: z.string().trim().max(2500, "论文/专利不能超过 2500 个字符"),
  socialPractice: z.string().trim().max(2500, "社会实践不能超过 2500 个字符"),
  hobbies: z.string().trim().max(500, "兴趣爱好不能超过 500 个字符"),
});

export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  education: z.array(educationItemSchema).max(10, "教育背景最多 10 条"),
  internships: z.array(internshipItemSchema).max(10, "实习经历最多 10 条"),
  projects: z.array(projectItemSchema).max(10, "项目经历最多 10 条"),
  workExperience: z
    .array(workExperienceItemSchema)
    .max(10, "工作经历最多 10 条"),
  campusExperience: z
    .array(campusExperienceItemSchema)
    .max(10, "校园经历最多 10 条"),
  certificates: certificatesSchema,
  awards: z.array(awardItemSchema).max(20, "获奖情况最多 20 条"),
  selfEvaluation: selfEvaluationSchema,
  optionalModules: optionalModulesSchema,
});

export type ResumeValues = z.infer<typeof resumeSchema>;

/**
 * AI 优化模块白名单。
 * 前端面板与 /api/ai-optimize 共用同一份定义，避免两侧枚举漂移。
 */
export const optimizeSections = [
  "selfEvaluation",
  "workExperience",
  "internship",
  "project",
  "campusExperience",
  "fullResume",
] as const;

export type OptimizeSection = (typeof optimizeSections)[number];

export function isOptimizeSection(value: unknown): value is OptimizeSection {
  return (
    typeof value === "string" &&
    (optimizeSections as readonly string[]).includes(value)
  );
}
