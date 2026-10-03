import Image from "next/image";

import {
  type ProcessedResumeData,
  defaultSidebarColor,
  defaultAccentColor,
  safeHexColor,
  withOpacity,
  mixWithBlack,
  getContrastTextColor,
  hasValue,
  formatRange,
  clampNumber,
} from "@/lib/resume-templates";

type Props = { processed: ProcessedResumeData };

export function ResumeTemplate2({ processed }: Props) {
  const {
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
  } = processed;

  const accent = safeHexColor(personalInfo.accentColor, defaultAccentColor);
  const headerBg = safeHexColor(personalInfo.sidebarColor, defaultSidebarColor);
  const headerText = getContrastTextColor(headerBg);
  const sidebarSpacing = clampNumber(personalInfo.sidebarSpacing ?? 10, 6, 20);
  const contentSpacing = clampNumber(personalInfo.contentSpacing ?? 6, 0, 24);

  // 模板二没有左右分栏：将“左侧间距”映射到头部模块留白，将“右侧间距”映射到正文模块留白。
  const headerPaddingY = Math.max(14, sidebarSpacing + 8);
  const headerPaddingX = Math.max(18, sidebarSpacing + 10);
  const headerGap = Math.max(12, sidebarSpacing + 1);
  const profileGapX = Math.max(10, sidebarSpacing - 1);
  const profileGapY = Math.max(4, Math.round(sidebarSpacing / 4));

  const contentPaddingY = Math.max(12, contentSpacing + 8);
  const contentPaddingX = Math.max(16, contentSpacing + 12);
  const sectionGap = Math.max(6, contentSpacing + 2);

  const profileItems = [
    { label: "性别", value: personalInfo.gender },
    { label: "出生年月/年龄", value: personalInfo.birthDateAge },
    { label: "电话", value: personalInfo.phone },
    { label: "邮箱", value: personalInfo.email },
    { label: "现居城市", value: personalInfo.city },
    { label: "政治面貌", value: personalInfo.politicalStatus },
    { label: "籍贯", value: personalInfo.nativePlace },
    { label: "作品链接", value: personalInfo.github, breakAll: true },
  ].filter((item) => hasValue(item.value));

  return (
    <div
      data-resume-preview="true"
      className="h-full min-h-full bg-white text-slate-800 [font-family:var(--font-geist-sans)]"
    >
      {/* ── Header banner ── */}
      <header
        className="relative"
        style={{
          padding: `${headerPaddingY}px ${headerPaddingX}px`,
          background: `linear-gradient(135deg, ${headerBg} 0%, ${mixWithBlack(headerBg, 0.18)} 100%)`,
        }}
      >
        <div className="relative flex items-start" style={{ gap: `${headerGap}px` }}>
          {/* Avatar */}
          <div className="h-[78px] w-[60px] shrink-0 overflow-hidden rounded-lg border-2 bg-white/10 shadow-lg"
            style={{ borderColor: withOpacity(headerText, 0.3) }}
          >
            {hasValue(personalInfo.avatar) ? (
              <Image
                src={personalInfo.avatar}
                alt="简历头像"
                width={80}
                height={104}
                unoptimized
                priority
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="flex h-full items-center justify-center text-[10px]"
                style={{ color: withOpacity(headerText, 0.7) }}
              >
                照片
              </div>
            )}
          </div>

          {/* Name & Title */}
          <div className="min-w-0 flex-1">
            <h1
              className="text-[20px] font-bold tracking-wide"
              style={{ color: headerText }}
            >
              {hasValue(personalInfo.fullName) ? personalInfo.fullName : "你的姓名"}
            </h1>
            <p
              className="mt-1 text-[12px] font-medium tracking-wider"
              style={{ color: withOpacity(headerText, 0.82) }}
            >
              {hasValue(personalInfo.jobTitle)
                ? `求职意向：${personalInfo.jobTitle}`
                : "求职意向"}
            </p>
            {/* Profile fields */}
            <div
              className="mt-2 flex flex-wrap text-[10px] leading-[1.45]"
              style={{
                color: withOpacity(headerText, 0.78),
                columnGap: `${profileGapX}px`,
                rowGap: `${profileGapY}px`,
              }}
            >
              {profileItems.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex min-w-0 max-w-full items-start gap-1"
                >
                  <span className="shrink-0" style={{ color: withOpacity(headerText, 0.66) }}>
                    {item.label}：
                  </span>
                  <span className={item.breakAll ? "break-all" : "break-words"}>
                    {item.value}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${sectionGap}px`,
          padding: `${contentPaddingY}px ${contentPaddingX}px`,
        }}
      >
        {/* Education */}
        {education.length > 0 && (
          <Section title="教育背景" accent={accent}>
            {education.map((item, i) => (
              <div key={i} className="mt-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-800">
                    {[item.school, item.degree, item.major].filter(hasValue).join("  ·  ")}
                  </span>
                  <span className="shrink-0 text-[10px] text-slate-500">
                    {formatRange(item.startDate, item.endDate)}
                  </span>
                </div>
                <div className="mt-1 space-y-0.5 text-[11px] leading-[1.6] text-slate-600">
                  {hasValue(item.courses) && <p>主修课程：{item.courses}</p>}
                  {hasValue(item.gpaRank) && <p>GPA/排名：{item.gpaRank}</p>}
                  {hasValue(item.honors) && <p>在校荣誉：{item.honors}</p>}
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Work Experience */}
        {workExperience.length > 0 && (
          <Section title="工作经历" accent={accent}>
            {workExperience.map((item, i) => (
              <div key={i} className="mt-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-800">
                    {[item.company, item.position].filter(hasValue).join("  ·  ")}
                  </span>
                  <span className="shrink-0 text-[10px] text-slate-500">
                    {formatRange(item.startDate, item.endDate)}
                  </span>
                </div>
                <div className="mt-1 space-y-0.5 text-[11px] leading-[1.6] text-slate-600">
                  {hasValue(item.content) && <p>工作内容：{item.content}</p>}
                  {hasValue(item.achievements) && <p>业绩成果：{item.achievements}</p>}
                  {hasValue(item.management) && <p>管理经验：{item.management}</p>}
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Internships */}
        {internships.length > 0 && (
          <Section title="实习经历" accent={accent}>
            {internships.map((item, i) => (
              <div key={i} className="mt-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-800">
                    {[item.company, item.position].filter(hasValue).join("  ·  ")}
                  </span>
                  <span className="shrink-0 text-[10px] text-slate-500">
                    {formatRange(item.startDate, item.endDate)}
                  </span>
                </div>
                <div className="mt-1 space-y-0.5 text-[11px] leading-[1.6] text-slate-600">
                  {hasValue(item.content) && <p>工作内容：{item.content}</p>}
                  {hasValue(item.achievements) && <p>工作成果：{item.achievements}</p>}
                  {hasValue(item.modules) && <p>负责模块：{item.modules}</p>}
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section title="项目经历" accent={accent}>
            {projects.map((item, i) => (
              <div key={i} className="mt-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-800">
                    {[item.name, item.role].filter(hasValue).join("  ·  ")}
                  </span>
                  <span className="shrink-0 text-[10px] text-slate-500">
                    {formatRange(item.startDate, item.endDate)}
                  </span>
                </div>
                <div className="mt-1 space-y-0.5 text-[11px] leading-[1.6] text-slate-600">
                  {hasValue(item.description) && <p>项目描述：{item.description}</p>}
                  {hasValue(item.responsibilities) && <p>个人职责：{item.responsibilities}</p>}
                  {hasValue(item.techStack) && <p>技术栈：{item.techStack}</p>}
                  {hasValue(item.outcomes) && <p>项目成果：{item.outcomes}</p>}
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Campus Experience */}
        {campusExperience.length > 0 && (
          <Section title="校园经历" accent={accent}>
            {campusExperience.map((item, i) => (
              <div key={i} className="mt-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-800">
                    {[item.organization, item.role].filter(hasValue).join("  ·  ")}
                  </span>
                  <span className="shrink-0 text-[10px] text-slate-500">
                    {hasValue(item.time) ? item.time : ""}
                  </span>
                </div>
                <div className="mt-1 space-y-0.5 text-[11px] leading-[1.6] text-slate-600">
                  {hasValue(item.responsibilities) && <p>负责工作：{item.responsibilities}</p>}
                  {hasValue(item.outcomes) && <p>活动成果：{item.outcomes}</p>}
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Certificates */}
        {certificateList.length > 0 && (
          <Section title="技能证书" accent={accent}>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {certificateList.map((item) => (
                <span
                  key={item.label}
                  className="rounded border px-2 py-0.5 text-[10px] text-slate-700"
                  style={{ borderColor: withOpacity(accent, 0.3), backgroundColor: withOpacity(accent, 0.06) }}
                >
                  {item.label}：{item.value}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <Section title="获奖情况" accent={accent}>
            <div className="mt-1.5 space-y-1">
              {awards.map((item, i) => (
                <p key={i} className="text-[11px] leading-[1.6] text-slate-700">
                  {[item.date, item.name, item.level, item.issuer].filter(hasValue).join("  ·  ")}
                </p>
              ))}
            </div>
          </Section>
        )}

        {/* Self Evaluation */}
        {selfEvaluationList.length > 0 && (
          <Section title="自我评价" accent={accent}>
            <div className="mt-1.5 space-y-1">
              {selfEvaluationList.map((item) => (
                <p key={item.label} className="text-[11px] leading-[1.6] text-slate-700">
                  <span className="font-semibold text-slate-800">{item.label}：</span>
                  {item.value}
                </p>
              ))}
            </div>
          </Section>
        )}

        {/* Optional modules */}
        {optionalList.length > 0 && (
          <Section title="附加信息" accent={accent}>
            <div className="mt-1.5 space-y-1">
              {optionalList.map((item) => (
                <p key={item.label} className="text-[11px] leading-[1.6] text-slate-700">
                  <span className="font-semibold text-slate-800">{item.label}：</span>
                  {item.value}
                </p>
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

/* ─── Section component for Template 2 ─── */
function Section({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span
          className="h-[14px] w-[3px] rounded-full"
          style={{ backgroundColor: accent }}
        />
        <h2
          className="text-[12px] font-bold tracking-[0.12em]"
          style={{ color: mixWithBlack(accent, 0.2) }}
        >
          {title}
        </h2>
        <span
          className="h-px flex-1"
          style={{ backgroundColor: withOpacity(accent, 0.25) }}
        />
      </div>
      {children}
    </div>
  );
}
